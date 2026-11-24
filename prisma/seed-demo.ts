import {
  BillingCycle,
  CRMType,
  Industry,
  InvoiceStatus,
  JobStatus,
  LeadStatus,
  PaymentMethod,
  PlatformRole,
  Prisma,
  PrismaClient,
  QuoteStatus,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO = {
  slug: "summit-hvac-demo",
  organizationName: "Summit HVAC Services",
  ownerName: "Alex Morgan",
  ownerEmail: "owner@summit-hvac.example",
  password: "SummitHVAC@2026",
  timezone: "America/New_York",
  currency: "USD",
  city: "Orlando",
  state: "Florida",
  country: "United States",
  phone: "+1 407-555-0100",
  website: "https://summit-hvac.example",
};

const money = (value: string | number) => new Prisma.Decimal(value);
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date;
};
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date;
};

async function main() {
  console.log("\n==============================================");
  console.log("       KONIQTECH HVAC DEMO SEED");
  console.log("==============================================\n");

  // Safety: this dedicated seed never deletes or resets existing data.
  const existing = await prisma.organization.findUnique({
    where: { slug: DEMO.slug },
    select: { id: true, name: true },
  });

  if (existing) {
    throw new Error(
      `Demo organization "${DEMO.slug}" already exists (id: ${existing.id}). ` +
      "No data was changed. This seed is intentionally non-destructive; inspect the existing demo before rerunning."
    );
  }

  // Keep global plan catalog consistent with the existing platform seed.
  const unlimited = 2_147_483_647;
  const plans = [
    {
      code: SubscriptionPlan.starter,
      name: "Starter",
      description: "For small service businesses getting started with KoniqTech CRM.",
      price: money("99.00"),
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 5,
      maxLocations: 1,
      storageLimit: 20,
      aiCredits: 0,
      active: true,
      sortOrder: 1,
    },
    {
      code: SubscriptionPlan.professional,
      name: "Professional",
      description: "For growing service businesses with advanced CRM capabilities.",
      price: money("199.00"),
      currency: "USD",
      billingCycle: "monthly",
      userLimit: unlimited,
      maxLocations: 1,
      storageLimit: 100,
      aiCredits: 5000,
      active: true,
      sortOrder: 2,
    },
    {
      code: SubscriptionPlan.enterprise,
      name: "Enterprise",
      description: "For multi-location service organizations.",
      price: money("499.00"),
      currency: "USD",
      billingCycle: "monthly",
      userLimit: unlimited,
      maxLocations: unlimited,
      storageLimit: 500,
      aiCredits: 20000,
      active: true,
      sortOrder: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        userLimit: plan.userLimit,
        maxLocations: plan.maxLocations,
        storageLimit: plan.storageLimit,
        aiCredits: plan.aiCredits,
        active: plan.active,
        sortOrder: plan.sortOrder,
      },
      create: plan,
    });
  }
  console.log("✓ Subscription plan catalog verified");

  const passwordHash = await bcrypt.hash(DEMO.password, 12);
  const trialStart = new Date();
  const trialEnd = daysFromNow(3);

  const result = await prisma.$transaction(async (tx) => {
    // Registration-equivalent organization setup, using the same fields
    // and defaults visible in shared/lib/auth/register.ts.
    const organization = await tx.organization.create({
      data: {
        name: DEMO.organizationName,
        slug: DEMO.slug,
        industry: Industry.hvac,
        crmType: CRMType.hvac,
        plan: SubscriptionPlan.starter,
        phone: DEMO.phone,
        website: DEMO.website,
        email: DEMO.ownerEmail,
        address: "1200 Orange Avenue",
        city: DEMO.city,
        state: DEMO.state,
        country: DEMO.country,
        postalCode: "32801",
        timezone: DEMO.timezone,
        currency: DEMO.currency,
        language: "en",
        usersLimit: 5,
        trialEndsAt: trialEnd,
        active: true,
      },
    });

    const ownerRole = await tx.organizationRole.create({
      data: {
        orgId: organization.id,
        name: "Owner",
        description: "Organization Owner",
        isSystem: true,
        active: true,
      },
    });

    const managerRole = await tx.organizationRole.create({
      data: {
        orgId: organization.id,
        name: "Manager",
        description: "HVAC operations and sales manager",
        active: true,
      },
    });

    const salesRole = await tx.organizationRole.create({
      data: {
        orgId: organization.id,
        name: "Sales",
        description: "Manages leads, opportunities and customer follow-up",
        active: true,
      },
    });

    const technicianRole = await tx.organizationRole.create({
      data: {
        orgId: organization.id,
        name: "Technician",
        description: "HVAC field technician",
        active: true,
      },
    });

    // Module names below are taken from shared/constants/modules.ts.
    // Owner access is handled by the application's existing owner bypass.
    await tx.rolePermission.createMany({
      data: [
        ...["Dashboard", "Leads", "Customers", "Pipeline", "Quotes", "Jobs", "Calendar", "Invoices", "Reports"].map((module) => ({
          roleId: managerRole.id,
          module,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: false,
          canImport: true,
          canExport: true,
          canApprove: true,
          canAssign: true,
        })),
        ...["Dashboard", "Leads", "Customers", "Pipeline", "Quotes", "Jobs", "Calendar", "Invoices", "Reports"].map((module) => ({
          roleId: salesRole.id,
          module,
          canView: true,
          canCreate: ["Leads", "Customers", "Quotes"].includes(module),
          canEdit: ["Leads", "Customers", "Quotes"].includes(module),
          canDelete: false,
          canImport: false,
          canExport: ["Leads", "Customers", "Reports"].includes(module),
          canApprove: false,
          canAssign: false,
        })),
        ...["Dashboard", "Customers", "Jobs", "Calendar"].map((module) => ({
          roleId: technicianRole.id,
          module,
          canView: true,
          canCreate: module === "Jobs",
          canEdit: module === "Jobs",
          canDelete: false,
          canImport: false,
          canExport: false,
          canApprove: false,
          canAssign: false,
        })),
      ],
    });

    const location = await tx.organizationLocation.create({
      data: {
        orgId: organization.id,
        name: "Orlando Main Office",
        address: "1200 Orange Avenue",
        city: DEMO.city,
        state: DEMO.state,
        country: DEMO.country,
        postalCode: "32801",
        phone: DEMO.phone,
        email: DEMO.ownerEmail,
        timezone: DEMO.timezone,
        currency: DEMO.currency,
        isDefault: true,
        active: true,
      },
    });

    const userSpecs = [
      { name: DEMO.ownerName, email: DEMO.ownerEmail, roleId: ownerRole.id, phone: "+1 407-555-0101" },
      { name: "Jordan Lee", email: "jordan.manager@summit-hvac.example", roleId: managerRole.id, phone: "+1 407-555-0102" },
      { name: "Taylor Brooks", email: "taylor.sales@summit-hvac.example", roleId: salesRole.id, phone: "+1 407-555-0103" },
      { name: "Chris Davis", email: "chris.tech@summit-hvac.example", roleId: technicianRole.id, phone: "+1 407-555-0104" },
      { name: "Morgan Reed", email: "morgan.tech@summit-hvac.example", roleId: technicianRole.id, phone: "+1 407-555-0105" },
    ];

    const users = [];
    for (let i = 0; i < userSpecs.length; i++) {
      const spec = userSpecs[i];
      const user = await tx.user.create({
        data: {
          orgId: organization.id,
          organizationRoleId: spec.roleId,
          name: spec.name,
          email: spec.email,
          passwordHash,
          phone: spec.phone,
          role: PlatformRole.user,
          emailVerified: true,
          status: "active",
        },
      });
      users.push(user);

      await tx.userPreference.create({
        data: {
          userId: user.id,
          timezone: DEMO.timezone,
          language: "en",
          dateFormat: "MM/DD/YYYY",
          emailNotifications: true,
          smsNotifications: false,
        },
      });

      await tx.userLocation.create({
        data: { userId: user.id, locationId: location.id },
      });
    }

    const [owner, manager, sales, tech1, tech2] = users;

    await tx.organizationSettings.create({
      data: {
        orgId: organization.id,
        timezone: DEMO.timezone,
        currency: DEMO.currency,
        branding: {
          companyName: DEMO.organizationName,
          primaryColor: "#0F766E",
          demoEnvironment: true,
        },
        integrations: {},
        aiEnabled: false,
        aiRequireApproval: true,
        aiCanAct: false,
        aiKnowledgeEnabled: false,
        aiWebSearchEnabled: false,
        aiVoiceEnabled: false,
      },
    });

    await tx.subscription.create({
      data: {
        orgId: organization.id,
        provider: "paypal",
        plan: SubscriptionPlan.starter,
        status: SubscriptionStatus.trial,
        billingCycle: BillingCycle.monthly,
        amount: money("0.00"),
        currency: DEMO.currency,
        trialStart,
        trialEnd,
        userLimit: 5,
        maxLocations: 1,
        storageLimit: 20,
        aiCredits: 0,
      },
    });

    const pipeline = await tx.pipeline.create({
      data: {
        orgId: organization.id,
        name: "HVAC Sales Pipeline",
      },
    });

    const stageNames = ["New", "Contacted", "Demo", "Proposal", "Negotiation", "Won", "Lost"];
    const stages = [];
    for (let i = 0; i < stageNames.length; i++) {
      stages.push(
        await tx.pipelineStage.create({
          data: { pipelineId: pipeline.id, name: stageNames[i], position: i + 1 },
        })
      );
    }

    const leadSpecs = [
      ["John", "Miller", "john.miller@example.test", "AC installation", LeadStatus.converted, "website", 5500],
      ["Robert", "Wilson", "robert.wilson@example.test", "HVAC repair", LeadStatus.converted, "google_maps", 850],
      ["Michael", "Brown", "michael.brown@example.test", "AC replacement", LeadStatus.converted, "referral", 4200],
      ["David", "Anderson", "david.anderson@example.test", "Furnace repair", LeadStatus.converted, "facebook", 1250],
      ["James", "Taylor", "james.taylor@example.test", "Annual maintenance", LeadStatus.converted, "website", 450],
      ["William", "Thomas", "william.thomas@example.test", "Duct cleaning", LeadStatus.converted, "linkedin", 650],
      ["Daniel", "Jackson", "daniel.jackson@example.test", "Heat pump installation", LeadStatus.converted, "referral", 6800],
      ["Matthew", "White", "matthew.white@example.test", "Commercial HVAC service", LeadStatus.converted, "google_maps", 9200],
      ["Anthony", "Harris", "anthony.harris@example.test", "AC not cooling", LeadStatus.estimate, "website", 950],
      ["Mark", "Martin", "mark.martin@example.test", "Thermostat replacement", LeadStatus.contacted, "facebook", 350],
      ["Steven", "Thompson", "steven.thompson@example.test", "Seasonal tune-up", LeadStatus.new, "google_maps", 275],
      ["Paul", "Garcia", "paul.garcia@example.test", "Mini-split installation", LeadStatus.estimate, "referral", 3900],
      ["Andrew", "Martinez", "andrew.martinez@example.test", "Air handler repair", LeadStatus.contacted, "website", 1100],
      ["Joshua", "Robinson", "joshua.robinson@example.test", "Commercial maintenance", LeadStatus.new, "linkedin", 2400],
      ["Kevin", "Clark", "kevin.clark@example.test", "Indoor air quality", LeadStatus.lost, "facebook", 700],
      ["Brian", "Rodriguez", "brian.rodriguez@example.test", "Furnace replacement", LeadStatus.new, "manual", 5100],
      ["George", "Lewis", "george.lewis@example.test", "Emergency HVAC repair", LeadStatus.contacted, "google_maps", 1400],
      ["Edward", "Walker", "edward.walker@example.test", "Preventive maintenance", LeadStatus.estimate, "website", 525],
      ["Ronald", "Hall", "ronald.hall@example.test", "AC inspection", LeadStatus.new, "referral", 300],
      ["Timothy", "Allen", "timothy.allen@example.test", "Commercial rooftop unit", LeadStatus.contacted, "linkedin", 7800],
    ] as const;

    const leads = [];
    for (let i = 0; i < leadSpecs.length; i++) {
      const [firstName, lastName, email, service, status, source, budget] = leadSpecs[i];
      const lead = await tx.lead.create({
        data: {
          orgId: organization.id,
          locationId: location.id,
          firstName,
          lastName,
          email,
          phone: `+1 407-555-${String(1100 + i).padStart(4, "0")}`,
          companyName: i === 7 || i === 13 || i === 19 ? `${lastName} Property Group` : null,
          address: `${100 + i} Demo Street`,
          source,
          budget,
          priority: i < 5 ? "High" : "Medium",
          tags: "hvac,demo",
          industry: Industry.hvac,
          status,
          assignedToId: i % 2 === 0 ? sales.id : manager.id,
          createdAt: daysAgo(30 - i),
        },
      });
      leads.push(lead);

      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "call",
          title: "Initial qualification call",
          createdAt: daysAgo(Math.max(1, 25 - i)),
        },
      });

      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "note",
          title: `Service requirement: ${service}`,
          createdAt: daysAgo(Math.max(1, 20 - i)),
        },
      });

      if (i < 8) {
        await tx.leadNote.create({
          data: {
            leadId: lead.id,
            content: `Demo note: prospect requested ${service}. Follow-up and estimate recorded for walkthrough.`,
            createdBy: sales.id,
          },
        });
      }
    }

    const customerNames = [
      ["John", "Miller", "Residential"],
      ["Robert", "Wilson", "Residential"],
      ["Michael", "Brown", "Residential"],
      ["David", "Anderson", "Residential"],
      ["James", "Taylor", "Residential"],
      ["William", "Thomas", "Residential"],
      ["Daniel", "Jackson", "Residential"],
      ["Matthew", "White", "Commercial"],
    ] as const;

    const customers = [];
    for (let i = 0; i < customerNames.length; i++) {
      const [firstName, lastName, segment] = customerNames[i];
      const lead = leads[i];
      const customer = await tx.customer.create({
        data: {
          orgId: organization.id,
          locationId: location.id,
          leadId: lead.id,
          firstName,
          lastName,
          companyName: segment === "Commercial" ? `${lastName} Property Group` : null,
          email: lead.email,
          phone: lead.phone,
          address: `${200 + i} Customer Avenue`,
          city: DEMO.city,
          state: DEMO.state,
          zip: "32801",
          source: lead.source,
          status: "active",
          createdAt: daysAgo(18 - i),
        },
      });
      customers.push(customer);

      await tx.customerActivity.create({
        data: {
          customerId: customer.id,
          title: "Customer onboarded",
          description: "Converted from qualified HVAC lead.",
          createdAt: daysAgo(15 - i),
        },
      });

      await tx.customerNote.create({
        data: {
          customerId: customer.id,
          orgId: organization.id,
          createdBy: owner.id,
          organizationRoleId: ownerRole.id,
          content: `Demo customer record for ${segment.toLowerCase()} HVAC service history.`,
        },
      });

      await tx.hvacUnit.create({
        data: {
          customerId: customer.id,
          model: i % 2 === 0 ? "Carrier Performance 24ACC6" : "Trane XR15",
          serialNo: `HVAC-DEMO-${String(10001 + i)}`,
          installDate: daysAgo(365 + i * 30),
        },
      });
    }

    // Deals are connected to customers and actual pipeline stages.
    const dealSpecs = [
      { customerIndex: 0, title: "AC Installation – Miller Residence", value: "5500.00", stageIndex: 5, probability: 100 },
      { customerIndex: 1, title: "HVAC Repair – Wilson Residence", value: "850.00", stageIndex: 5, probability: 100 },
      { customerIndex: 2, title: "AC Replacement – Brown Residence", value: "4200.00", stageIndex: 4, probability: 90 },
      { customerIndex: 3, title: "Furnace Repair – Anderson Residence", value: "1250.00", stageIndex: 3, probability: 75 },
      { customerIndex: 4, title: "Annual Maintenance – Taylor Residence", value: "450.00", stageIndex: 2, probability: 60 },
      { customerIndex: 5, title: "Duct Cleaning – Thomas Residence", value: "650.00", stageIndex: 1, probability: 30 },
    ];
    for (const deal of dealSpecs) {
      await tx.deal.create({
        data: {
          orgId: organization.id,
          customerId: customers[deal.customerIndex].id,
          stageId: stages[deal.stageIndex].id,
          title: deal.title,
          value: money(deal.value),
          probability: deal.probability,
          assignedTo: sales.id,
          expectedClose: daysFromNow(10),
        },
      });
    }

    const quoteSpecs = [
      { customerIndex: 0, quoteNumber: "SUM-Q-1001", subtotal: "5000.00", tax: "500.00", total: "5500.00", status: QuoteStatus.approved, item: "Central AC installation", price: "5000.00", accepted: true },
      { customerIndex: 1, quoteNumber: "SUM-Q-1002", subtotal: "800.00", tax: "50.00", total: "850.00", status: QuoteStatus.approved, item: "HVAC diagnostic and repair", price: "800.00", accepted: true },
      { customerIndex: 2, quoteNumber: "SUM-Q-1003", subtotal: "4000.00", tax: "200.00", total: "4200.00", status: QuoteStatus.sent, item: "AC system replacement", price: "4000.00", accepted: false },
      { customerIndex: 3, quoteNumber: "SUM-Q-1004", subtotal: "1000.00", tax: "250.00", total: "1250.00", status: QuoteStatus.approved, item: "Furnace repair service", price: "1000.00", accepted: true },
      { customerIndex: 4, quoteNumber: "SUM-Q-1005", subtotal: "400.00", tax: "50.00", total: "450.00", status: QuoteStatus.sent, item: "Annual maintenance plan", price: "400.00", accepted: false },
      { customerIndex: 5, quoteNumber: "SUM-Q-1006", subtotal: "600.00", tax: "50.00", total: "650.00", status: QuoteStatus.draft, item: "Residential duct cleaning", price: "600.00", accepted: false },
      { customerIndex: 6, quoteNumber: "SUM-Q-1007", subtotal: "6000.00", tax: "800.00", total: "6800.00", status: QuoteStatus.approved, item: "Heat pump installation", price: "6000.00", accepted: true },
      { customerIndex: 7, quoteNumber: "SUM-Q-1008", subtotal: "8500.00", tax: "700.00", total: "9200.00", status: QuoteStatus.sent, item: "Commercial HVAC service package", price: "8500.00", accepted: false },
    ];

    const quotes = [];
    for (let i = 0; i < quoteSpecs.length; i++) {
      const spec = quoteSpecs[i];
      const quote = await tx.quote.create({
        data: {
          orgId: organization.id,
          locationId: location.id,
          customerId: customers[spec.customerIndex].id,
          quoteNumber: spec.quoteNumber,
          status: spec.status,
          validUntil: daysFromNow(30),
          notes: "Demonstration estimate. Not a live customer quote.",
          terms: "Demo terms: subject to site inspection and customer approval.",
          subtotal: money(spec.subtotal),
          tax: money(spec.tax),
          total: money(spec.total),
          sentAt: spec.status === QuoteStatus.draft ? null : daysAgo(5),
          acceptedAt: spec.accepted ? daysAgo(3) : null,
          createdById: sales.id,
          updatedById: manager.id,
          createdAt: daysAgo(8 - i),
          items: {
            create: [
              {
                itemName: spec.item,
                description: "HVAC labor and/or equipment for demonstration",
                unit: "service",
                qty: 1,
                price: money(spec.price),
                tax: money(spec.tax),
                total: money(spec.total),
                sortOrder: 1,
              },
            ],
          },
        },
      });
      quotes.push(quote);
    }

    const jobSpecs = [
      { customerIndex: 0, quoteIndex: 0, title: "Central AC Installation – Miller", status: JobStatus.completed, techId: tech1.id, days: 12 },
      { customerIndex: 1, quoteIndex: 1, title: "HVAC Repair – Wilson", status: JobStatus.completed, techId: tech2.id, days: 10 },
      { customerIndex: 2, quoteIndex: 2, title: "AC System Replacement – Brown", status: JobStatus.scheduled, techId: tech1.id, days: 2 },
      { customerIndex: 3, quoteIndex: 3, title: "Furnace Repair – Anderson", status: JobStatus.in_progress, techId: tech2.id, days: 0 },
      { customerIndex: 4, quoteIndex: 4, title: "Annual Maintenance – Taylor", status: JobStatus.scheduled, techId: tech1.id, days: 4 },
      { customerIndex: 5, quoteIndex: 5, title: "Duct Cleaning – Thomas", status: JobStatus.cancelled, techId: tech2.id, days: -2 },
      { customerIndex: 6, quoteIndex: 6, title: "Heat Pump Installation – Jackson", status: JobStatus.completed, techId: tech1.id, days: 8 },
      { customerIndex: 7, quoteIndex: 7, title: "Commercial HVAC Service – White", status: JobStatus.in_progress, techId: tech2.id, days: 1 },
    ];

    const jobs = [];
    for (let i = 0; i < jobSpecs.length; i++) {
      const spec = jobSpecs[i];
      const scheduledDate = spec.days < 0 ? daysAgo(Math.abs(spec.days)) : daysFromNow(spec.days);
      const job = await tx.job.create({
        data: {
          orgId: organization.id,
          locationId: location.id,
          customerId: customers[spec.customerIndex].id,
          quoteId: quotes[spec.quoteIndex].id,
          title: spec.title,
          status: spec.status,
          technicianId: spec.techId,
          scheduledDate,
          completedDate: spec.status === JobStatus.completed ? daysAgo(spec.days) : null,
          notes: "Demonstration job record.",
          createdAt: daysAgo(14 - i),
          tasks: {
            create: [
              { title: "Confirm customer appointment", status: "completed" },
              { title: "Perform HVAC service", status: spec.status === JobStatus.completed ? "completed" : "in_progress" },
              { title: "Complete service checklist", status: spec.status === JobStatus.completed ? "completed" : "todo" },
            ],
          },
        },
      });
      jobs.push(job);

      await tx.event.create({
        data: {
          orgId: organization.id,
          title: `HVAC appointment: ${spec.title}`,
          startTime: scheduledDate,
          endTime: new Date(scheduledDate.getTime() + 2 * 60 * 60 * 1000),
          userId: spec.techId,
          jobId: job.id,
        },
      });
    }

    const invoiceSpecs = [
      { jobIndex: 0, customerIndex: 0, number: "SUM-INV-1001", subtotal: "5000.00", tax: "500.00", total: "5500.00", status: InvoiceStatus.paid, paid: true, due: -8 },
      { jobIndex: 1, customerIndex: 1, number: "SUM-INV-1002", subtotal: "800.00", tax: "50.00", total: "850.00", status: InvoiceStatus.paid, paid: true, due: -5 },
      { jobIndex: 2, customerIndex: 2, number: "SUM-INV-1003", subtotal: "4000.00", tax: "200.00", total: "4200.00", status: InvoiceStatus.sent, paid: false, due: 15 },
      { jobIndex: 3, customerIndex: 3, number: "SUM-INV-1004", subtotal: "1000.00", tax: "250.00", total: "1250.00", status: InvoiceStatus.overdue, paid: false, due: -10 },
      { jobIndex: 4, customerIndex: 4, number: "SUM-INV-1005", subtotal: "400.00", tax: "50.00", total: "450.00", status: InvoiceStatus.sent, paid: false, due: 20 },
      { jobIndex: 6, customerIndex: 6, number: "SUM-INV-1006", subtotal: "6000.00", tax: "800.00", total: "6800.00", status: InvoiceStatus.paid, paid: true, due: -2 },
    ];

    for (const spec of invoiceSpecs) {
      const invoice = await tx.invoice.create({
        data: {
          orgId: organization.id,
          locationId: location.id,
          customerId: customers[spec.customerIndex].id,
          jobId: jobs[spec.jobIndex].id,
          invoiceNumber: spec.number,
          subtotal: money(spec.subtotal),
          tax: money(spec.tax),
          total: money(spec.total),
          dueDate: spec.due < 0 ? daysAgo(Math.abs(spec.due)) : daysFromNow(spec.due),
          status: spec.status,
          sentAt: daysAgo(4),
          paidAt: spec.paid ? daysAgo(2) : null,
        },
      });

      if (spec.paid) {
        await tx.payment.create({
          data: {
            orgId: organization.id,
            customerId: customers[spec.customerIndex].id,
            invoiceId: invoice.id,
            amount: money(spec.total),
            method: PaymentMethod.credit_card,
            reference: `DEMO-PAY-${spec.number}`,
            notes: "Fictional demo payment; no money was processed.",
            paidAt: daysAgo(2),
          },
        });
      }
    }

    // A final set of lead notes/activities makes activity history populated.
    await tx.leadActivity.createMany({
      data: [
        { leadId: leads[8].id, type: "email", title: "Estimate emailed to prospect", createdAt: daysAgo(2) },
        { leadId: leads[9].id, type: "call", title: "Follow-up call completed", createdAt: daysAgo(1) },
        { leadId: leads[10].id, type: "note", title: "New inbound HVAC inquiry", createdAt: daysAgo(1) },
      ],
    });

    return {
      organizationId: organization.id,
      locationId: location.id,
      userIds: users.map((user) => user.id),
      leadCount: leads.length,
      customerCount: customers.length,
      quoteCount: quotes.length,
      jobCount: jobs.length,
      invoiceCount: invoiceSpecs.length,
    };
  }, { timeout: 120000 });

  // Read-back checks: counts and totals are queried from the database.
  const [leadCount, customerCount, jobCount, invoiceCount, paidInvoiceAggregate, totalInvoiceAggregate] =
    await Promise.all([
      prisma.lead.count({ where: { orgId: result.organizationId } }),
      prisma.customer.count({ where: { orgId: result.organizationId } }),
      prisma.job.count({ where: { orgId: result.organizationId } }),
      prisma.invoice.count({ where: { orgId: result.organizationId } }),
      prisma.invoice.aggregate({
        where: { orgId: result.organizationId, status: InvoiceStatus.paid },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: { orgId: result.organizationId },
        _sum: { total: true },
      }),
    ]);

  console.log("\n==============================================");
  console.log("       HVAC DEMO SEEDED SUCCESSFULLY");
  console.log("==============================================");
  console.log(`Organization : ${DEMO.organizationName}`);
  console.log(`Slug         : ${DEMO.slug}`);
  console.log(`Organization ID: ${result.organizationId}`);
  console.log(`Location ID  : ${result.locationId}`);
  console.log(`Leads        : ${leadCount}`);
  console.log(`Customers    : ${customerCount}`);
  console.log(`Jobs         : ${jobCount}`);
  console.log(`Invoices     : ${invoiceCount}`);
  console.log(`Invoice total: $${Number(totalInvoiceAggregate._sum.total ?? 0).toFixed(2)}`);
  console.log(`Paid total   : $${Number(paidInvoiceAggregate._sum.total ?? 0).toFixed(2)}`);
  console.log("\nDEMO OWNER LOGIN");
  console.log(`Email        : ${DEMO.ownerEmail}`);
  console.log(`Password     : ${DEMO.password}`);
  console.log("\nOther demo users share the same password:");
  console.log("jordan.manager@summit-hvac.example");
  console.log("taylor.sales@summit-hvac.example");
  console.log("chris.tech@summit-hvac.example");
  console.log("morgan.tech@summit-hvac.example");
  console.log("\nAll demo emails use reserved .example domains; no external mailboxes are required.");
  console.log("All demo customer contacts are fictional; payment records do not represent real transactions.");
  console.log("==============================================\n");
}

main()
  .catch((error) => {
    console.error("\nHVAC demo seed failed. No existing organization was intentionally deleted.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
