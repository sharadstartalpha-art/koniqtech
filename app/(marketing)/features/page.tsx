import Link from "next/link"
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Wrench,
  CalendarDays,
  ClipboardCheck,
  FileText,
  CreditCard,
  Bell,
  Smartphone,
  BarChart3,
  CheckCircle2,
  Globe,
  Lock,
  Zap,
  Star,
  TrendingUp,
  Clock3,
   Truck,
  Package,
  MapPinned,
  CalendarClock,
  Brain,
  Bot,
  Mic,
  Sparkles,
  MessageSquare,
  Mail,
  PhoneCall,
  Wand2,
  Cpu,
  Activity,
  LineChart,
  Search,
  Workflow,
  FileSearch,
  
  UserRound,
 
  Camera,
  FileSignature,
  
  WifiOff,
  RefreshCw,
  MonitorSmartphone,
  Plug,
  Calendar,
  
  Cloud,
  Database,
 
  Code2,
 
  ArrowRightLeft,
  
  KeyRound,
  Fingerprint,
  Server,
  
  BadgeCheck,
  
} from "lucide-react"

export const metadata = {
  title: "Features | KoniqTech AI Field Service CRM",
  description:
    "Explore every feature included with KoniqTech. AI Dispatching, CRM, Jobs, Scheduling, Estimates, Billing, Automation, Voice AI, Customer Portal, Mobile Apps and more."
}

const stats = [
  {
    title: "Businesses",
    value: "10,000+",
    icon: Building2
  },
  {
    title: "Jobs Managed",
    value: "5M+",
    icon: ClipboardCheck
  },
  {
    title: "AI Automations",
    value: "20M+",
    icon: Brain
  },
  {
    title: "Countries",
    value: "18+",
    icon: Globe
  }
]

const categories = [
  {
    icon: Users,
    title: "CRM",
    description:
      "Leads, customers, contacts and communication."
  },
  {
    icon: CalendarDays,
    title: "Scheduling",
    description:
      "Dispatch crews and optimize calendars."
  },
  {
    icon: ClipboardCheck,
    title: "Jobs",
    description:
      "Manage projects from quote to completion."
  },
  {
    icon: CreditCard,
    title: "Billing",
    description:
      "Invoices, payments and subscriptions."
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Voice AI, automation and predictive insights."
  },
  {
    icon: BarChart3,
    title: "Reporting",
    description:
      "Business intelligence dashboards."
  },
  {
    icon: Smartphone,
    title: "Mobile",
    description:
      "Native apps for technicians and managers."
  },
  {
    icon: ShieldCheck,
    title: "Enterprise",
    description:
      "Security, permissions and compliance."
  }
]

const highlights = [
  "Complete AI Field Service CRM",
  "Built for Roofing, HVAC, Plumbing & Landscaping",
  "Multi-Tenant SaaS Architecture",
  "Modern Next.js Platform",
  "Real-time Dashboards",
  "Unlimited Jobs & Customers",
  "Advanced Scheduling Engine",
  "AI Voice Assistants",
  "Powerful Automation Engine",
  "Customer Self-Service Portal",
  "Native Mobile Experience",
  "Enterprise Grade Security"
]

const salesModules = [
  {
    icon: Users,
    title: "Sales CRM",
    description:
      "Manage every opportunity from first contact to closed deal with an intuitive sales pipeline.",
    features: [
      "Sales Pipeline",
      "Opportunity Tracking",
      "Deal Stages",
      "Sales Dashboard",
      "Activity Timeline",
      "Revenue Forecasting"
    ]
  },
  {
    icon: Building2,
    title: "Lead Management",
    description:
      "Capture, organize and qualify leads from every marketing channel automatically.",
    features: [
      "Lead Capture",
      "Lead Assignment",
      "Lead Scoring",
      "Duplicate Detection",
      "Follow-up Reminders",
      "Source Tracking"
    ]
  },
  {
    icon: ClipboardCheck,
    title: "Customer Management",
    description:
      "Maintain a complete history of every customer, property and interaction.",
    features: [
      "Customer Profiles",
      "Properties",
      "Communication History",
      "Attachments",
      "Service History",
      "Customer Notes"
    ]
  },
  {
    icon: FileText,
    title: "Estimates",
    description:
      "Create professional estimates within minutes using reusable templates.",
    features: [
      "Estimate Templates",
      "Line Items",
      "Taxes",
      "Discounts",
      "Digital Approval",
      "PDF Export"
    ]
  },
  {
    icon: CreditCard,
    title: "Quotes",
    description:
      "Generate beautiful branded quotes that customers can approve online.",
    features: [
      "Professional Quotes",
      "Pricing Rules",
      "Version History",
      "Approval Workflow",
      "Customer Portal",
      "Online Acceptance"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Contracts",
    description:
      "Generate legally compliant contracts with electronic signatures.",
    features: [
      "Contract Templates",
      "Electronic Signature",
      "Attachments",
      "Renewals",
      "Version Control",
      "Audit Trail"
    ]
  }
]


const operationsModules = [
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description:
      "Plan jobs with an intelligent drag-and-drop calendar that optimizes technician availability.",
    features: [
      "Drag & Drop Calendar",
      "Recurring Jobs",
      "Availability",
      "Route Optimization",
      "Resource Allocation",
      "Google Calendar Sync"
    ]
  },
  {
    icon: ClipboardCheck,
    title: "Job Management",
    description:
      "Track every service job from assignment to completion with real-time updates.",
    features: [
      "Work Orders",
      "Job Checklists",
      "Attachments",
      "Photos & Videos",
      "Customer Signatures",
      "Completion Reports"
    ]
  },
  {
    icon: Truck,
    title: "Dispatch Center",
    description:
      "Dispatch technicians efficiently using GPS, live status updates and intelligent routing.",
    features: [
      "Live Dispatch Board",
      "GPS Tracking",
      "Technician Status",
      "Emergency Dispatch",
      "Travel Optimization",
      "Route AI"
    ]
  },
  {
    icon: Users,
    title: "Employee Management",
    description:
      "Manage technicians, dispatchers, office staff and field crews from one dashboard.",
    features: [
      "Attendance",
      "Leave Management",
      "Payroll Ready",
      "Performance",
      "Departments",
      "Teams"
    ]
  },
  {
    icon: Package,
    title: "Inventory",
    description:
      "Track inventory across warehouses, technician vehicles and job sites.",
    features: [
      "Warehouse Stock",
      "Vehicle Inventory",
      "Purchase Orders",
      "Suppliers",
      "Barcode Support",
      "Low Stock Alerts"
    ]
  },
  {
    icon: Truck,
    title: "Fleet Management",
    description:
      "Monitor company vehicles, maintenance schedules and technician travel.",
    features: [
      "Vehicle Tracking",
      "Maintenance",
      "Fuel Logs",
      "Trip History",
      "Driver Assignment",
      "GPS Integration"
    ]
  }
]


const aiModules = [
  {
    icon: Bot,
    title: "AI Business Assistant",
    description:
      "Ask natural language questions about customers, jobs, invoices and revenue.",
    features: [
      "Business Q&A",
      "Customer Lookup",
      "Invoice Search",
      "Job Insights",
      "Revenue Questions",
      "Daily Summary"
    ]
  },
  {
    icon: Wand2,
    title: "AI Quote Generator",
    description:
      "Generate detailed estimates and proposals using customer requirements.",
    features: [
      "Estimate Drafting",
      "Proposal Builder",
      "Line Item Suggestions",
      "Material Recommendations",
      "Labor Calculations",
      "Professional Formatting"
    ]
  },
  {
    icon: Mic,
    title: "Voice AI",
    description:
      "Answer incoming calls, qualify leads and schedule appointments automatically.",
    features: [
      "24×7 Receptionist",
      "Appointment Booking",
      "Lead Qualification",
      "Call Summaries",
      "Speech Recognition",
      "CRM Updates"
    ]
  },
  {
    icon: MessageSquare,
    title: "AI Messaging",
    description:
      "Create customer replies, SMS reminders and follow-up campaigns automatically.",
    features: [
      "SMS Replies",
      "Email Writing",
      "Follow-ups",
      "Appointment Reminders",
      "Review Requests",
      "Campaign Messages"
    ]
  },
  {
    icon: Search,
    title: "Knowledge AI",
    description:
      "Search your entire business using plain English.",
    features: [
      "Document Search",
      "Customer History",
      "Invoice Lookup",
      "Job Search",
      "Equipment History",
      "Knowledge Base"
    ]
  },
  {
    icon: LineChart,
    title: "Predictive AI",
    description:
      "Forecast revenue, technician utilization and customer trends.",
    features: [
      "Revenue Forecast",
      "Lead Conversion",
      "Technician Productivity",
      "Demand Prediction",
      "Customer Retention",
      "Business Insights"
    ]
  }
]



const automationModules = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive business processes so your team can focus on customers.",
    features: [
      "Visual Workflow Builder",
      "Conditional Logic",
      "Recurring Jobs",
      "Task Automation",
      "Approval Flows",
      "Background Processing"
    ]
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Keep employees and customers informed automatically.",
    features: [
      "Push Notifications",
      "SMS Alerts",
      "Email Alerts",
      "Technician Alerts",
      "Job Updates",
      "Reminder Engine"
    ]
  },
  {
    icon: Mail,
    title: "Email Automation",
    description:
      "Automatically communicate throughout the customer journey.",
    features: [
      "Welcome Emails",
      "Follow-ups",
      "Estimate Delivery",
      "Invoice Emails",
      "Review Requests",
      "Marketing Campaigns"
    ]
  },
  {
    icon: MessageSquare,
    title: "SMS Automation",
    description:
      "Increase customer engagement using automated SMS communication.",
    features: [
      "Appointment Reminders",
      "Arrival Notifications",
      "Payment Reminders",
      "Two-way Messaging",
      "OTP Verification",
      "Marketing SMS"
    ]
  }
]

const mobileFeatures = [
  "Today's Schedule",
  "GPS Navigation",
  "Customer History",
  "Offline Mode",
  "Photo Upload",
  "Video Upload",
  "Digital Signature",
  "Invoice Creation",
  "Payment Collection",
  "Inventory Usage",
  "Time Tracking",
  "Voice Notes"
]

const portalFeatures = [
  "Book Appointments",
  "Approve Estimates",
  "View Invoices",
  "Online Payments",
  "Track Technician",
  "Service History",
  "Download Documents",
  "Customer Messaging"
]


const integrationGroups = [
  {
    icon: Calendar,
    title: "Calendar & Scheduling",
    description: "Keep appointments synchronized across your team.",
    apps: [
      "Google Calendar",
      "Microsoft Outlook",
      "Apple Calendar",
      "ICS Calendar"
    ]
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Collect payments using your preferred payment provider.",
    apps: [
      "PayPal",
      "Stripe",
      "Square",
      "Razorpay"
    ]
  },
  {
    icon: Mail,
    title: "Email",
    description: "Send transactional and marketing emails.",
    apps: [
      "Resend",
      "SMTP",
      "Google Workspace",
      "Microsoft 365"
    ]
  },
  {
    icon: MessageSquare,
    title: "SMS & Communication",
    description: "Automate customer communication.",
    apps: [
      "Twilio",
      "MSG91",
      "WhatsApp",
      "SMS Gateway"
    ]
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description: "Store photos, invoices and customer files securely.",
    apps: [
      "AWS S3",
      "Cloudflare R2",
      "Google Drive",
      "Dropbox"
    ]
  },
  {
    icon: Cpu,
    title: "Artificial Intelligence",
    description: "Bring AI into every workflow.",
    apps: [
      "OpenAI",
      "Claude",
      "Gemini",
      "Azure AI"
    ]
  }
]

const apiFeatures = [
  "REST API",
  "OAuth Authentication",
  "Webhooks",
  "API Keys",
  "SDK Support",
  "Rate Limiting",
  "Developer Documentation",
  "Sandbox Environment"
]


const securityModules = [
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Protect customer and business data with enterprise-grade security.",
    features: [
      "TLS Encryption",
      "Encrypted Storage",
      "Secure Sessions",
      "Password Hashing",
      "CSRF Protection",
      "Audit Logging"
    ]
  },
  {
    icon: KeyRound,
    title: "Access Control",
    description:
      "Granular permissions for every employee and department.",
    features: [
      "Role Based Access",
      "Departments",
      "Teams",
      "Permission Matrix",
      "Session Management",
      "Activity Tracking"
    ]
  },
  {
    icon: Database,
    title: "Data Protection",
    description:
      "Business data remains isolated and protected.",
    features: [
      "Multi-Tenant Isolation",
      "Automatic Backups",
      "Disaster Recovery",
      "Point-in-Time Restore",
      "Data Retention",
      "Secure Storage"
    ]
  },
  {
    icon: Activity,
    title: "Monitoring",
    description:
      "Monitor the health and activity of your organization in real time.",
    features: [
      "Audit Logs",
      "Usage Metrics",
      "Security Alerts",
      "Performance Metrics",
      "API Monitoring",
      "System Status"
    ]
  }
]

const enterpriseFeatures = [
  "Unlimited Customers",
  "Unlimited Jobs",
  "Unlimited Documents",
  "Unlimited Employees",
  "Multiple Branches",
  "Multi-Location Support",
  "Department Management",
  "Custom Roles",
  "Custom Permissions",
  "REST API",
  "Webhook Support",
  "White Label Ready"
]




export default function FeaturesPage() {
  return (
    <main className="bg-white">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-orange-600">

              <Sparkles className="h-4 w-4" />

              <span className="font-medium">
                Complete AI Field Service Platform
              </span>

            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

              Everything Your
              <span className="block text-orange-500">
                Service Business
              </span>
              Needs.

            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

              KoniqTech combines CRM, Scheduling,
              Dispatch, Estimates, Billing,
              AI Automation, Reporting,
              Customer Portal and Mobile Apps
              into one connected platform.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-600"
              >
                Start Free Trial

                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/pricing"
                className="rounded-xl border border-slate-300 px-7 py-4 font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                View Pricing
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* TRUST */}
      {/* ===================================================== */}

      <section className="border-y bg-slate-50">

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 px-6 py-8 text-sm font-semibold text-slate-500">

          <span>AI Powered</span>

          <span>Cloud Native</span>

          <span>Enterprise Security</span>

          <span>99.9% Uptime</span>

          <span>Multi-Tenant SaaS</span>

          <span>Built for Service Businesses</span>

        </div>

      </section>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-3xl border bg-white p-8 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-500">
                        {item.title}
                      </p>

                      <h2 className="mt-3 text-5xl font-black text-slate-900">
                        {item.value}
                      </h2>

                    </div>

                    <div className="rounded-2xl bg-orange-100 p-4">

                      <Icon className="h-8 w-8 text-orange-500" />

                    </div>

                  </div>

                </div>

              )
            })}

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* FEATURE CATEGORIES */}
      {/* ===================================================== */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Platform Modules
            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Every Department.
              <br />
              One Connected Platform.

            </h2>

            <p className="mt-6 text-xl text-slate-600">

              Replace disconnected software with one
              modern AI-powered operating system.

            </p>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {categories.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-3xl border bg-white p-8 transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="inline-flex rounded-2xl bg-orange-100 p-4">

                    <Icon className="h-8 w-8 text-orange-500" />

                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {item.description}
                  </p>

                </div>

              )
            })}

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* WHY KONIQTECH */}
      {/* ===================================================== */}

      <section className="py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

          <div>

            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Why KoniqTech
            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Built Specifically
              <br />
              For Field Service Companies

            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">

              Unlike generic CRMs, KoniqTech was
              designed around how contractors actually
              sell, schedule, dispatch and complete jobs.

            </p>

            <div className="mt-10 space-y-5">

              {highlights.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >
                  <CheckCircle2 className="h-6 w-6 text-green-600" />

                  <span className="text-lg text-slate-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          <div className="rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white">

            <div className="grid gap-6">

              <EnterpriseCard
                icon={Brain}
                title="AI Powered"
                description="Automate repetitive office work."
              />

              <EnterpriseCard
                icon={Clock3}
                title="Save Time"
                description="Reduce manual scheduling and paperwork."
              />

              <EnterpriseCard
                icon={TrendingUp}
                title="Grow Faster"
                description="Increase revenue with better operations."
              />

              <EnterpriseCard
                icon={ShieldCheck}
                title="Enterprise Secure"
                description="Role permissions, audit logs and encryption."
              />

            </div>

          </div>

        </div>

      </section>



{/* ===================================================== */}
{/* SALES CRM */}
{/* ===================================================== */}

<section className="bg-slate-50 py-24">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">
        Sales Platform
      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Sell Faster.
        <br />

        Close More Jobs.

      </h2>

      <p className="mt-6 text-xl leading-9 text-slate-600">

        Every sales feature your team needs,
        from capturing new leads to signed
        contracts.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {salesModules.map((module) => {

        const Icon = module.icon

        return (

          <div
            key={module.title}
            className="
            rounded-[32px]
            border
            bg-white
            p-10
            shadow-sm
            transition
            hover:-translate-y-2
            hover:shadow-2xl
            "
          >

            <div className="
            flex
            items-center
            gap-5
            ">

              <div className="
              rounded-2xl
              bg-orange-100
              p-4
              ">

                <Icon
                  className="
                  h-8
                  w-8
                  text-orange-500
                  "
                />

              </div>

              <div>

                <h3 className="
                text-3xl
                font-bold
                text-slate-900
                ">
                  {module.title}
                </h3>

              </div>

            </div>

            <p className="
            mt-6
            leading-8
            text-slate-600
            ">
              {module.description}
            </p>

            <div className="
            mt-8
            grid
            gap-4
            sm:grid-cols-2
            ">

              {module.features.map((feature) => (

                <div
                  key={feature}
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >

                  <CheckCircle2
                    className="
                    h-5
                    w-5
                    text-green-600
                    "
                  />

                  <span className="text-slate-700">

                    {feature}

                  </span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>



{/* ===================================================== */}
{/* WHY SALES TEAMS LOVE KONIQTECH */}
{/* ===================================================== */}

<section className="py-24">

  <div className="mx-auto max-w-7xl px-6">

    <div className="rounded-[40px] bg-gradient-to-r from-orange-500 to-orange-600 p-12 text-white">

      <div className="grid items-center gap-16 lg:grid-cols-2">

        <div>

          <h2 className="text-5xl font-black">

            Everything Sales Needs.
            <br />

            Nothing Missing.

          </h2>

          <p className="mt-8 text-xl leading-9 text-orange-100">

            Stop switching between multiple
            applications. KoniqTech keeps
            your entire sales workflow
            connected in one platform.

          </p>

        </div>

        <div className="grid gap-5">

          {[
            "Capture Leads",
            "Qualify Prospects",
            "Schedule Estimates",
            "Generate Quotes",
            "Send Contracts",
            "Collect Approvals",
            "Convert to Jobs",
            "Generate Invoices"
          ].map((item) => (

            <div
              key={item}
              className="
              flex
              items-center
              gap-4
              rounded-2xl
              bg-white/10
              px-6
              py-5
              "
            >

              <CheckCircle2
                className="
                h-6
                w-6
                text-green-300
                "
              />

              <span className="text-lg">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* OPERATIONS PLATFORM */}
{/* ===================================================== */}

<section className="bg-white py-24">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Operations Platform

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Manage Every
        <br />

        Service Operation

      </h2>

      <p className="mt-6 text-xl leading-9 text-slate-600">

        From scheduling and dispatching to inventory,
        employees and fleet management, KoniqTech
        keeps your operations running efficiently.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {operationsModules.map((module) => {

        const Icon = module.icon

        return (

          <div
            key={module.title}
            className="rounded-[32px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-100 p-4">

                <Icon className="h-8 w-8 text-orange-500" />

              </div>

              <h3 className="text-3xl font-bold text-slate-900">

                {module.title}

              </h3>

            </div>

            <p className="mt-6 leading-8 text-slate-600">

              {module.description}

            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {module.features.map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600" />

                  <span className="text-slate-700">

                    {feature}

                  </span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>




{/* ===================================================== */}
{/* OPERATIONS WORKFLOW */}
{/* ===================================================== */}

<section className="bg-slate-900 py-24">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-400">

        Service Workflow

      </p>

      <h2 className="mt-4 text-5xl font-black text-white">

        Every Job.
        <br />

        Fully Connected.

      </h2>

    </div>

    <div className="mt-20 grid gap-6 lg:grid-cols-6">

      <WorkflowCard
        icon={CalendarClock}
        title="Schedule"
      />

      <WorkflowCard
        icon={Truck}
        title="Dispatch"
      />

      <WorkflowCard
        icon={MapPinned}
        title="Travel"
      />

      <WorkflowCard
        icon={ClipboardCheck}
        title="Complete Job"
      />

      <WorkflowCard
        icon={CreditCard}
        title="Invoice"
      />

      <WorkflowCard
        icon={BarChart3}
        title="Report"
      />

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* OPERATIONS RESULTS */}
{/* ===================================================== */}

<section className="bg-orange-500 py-24">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      <OperationsMetric
        value="40%"
        label="Less Travel Time"
      />

      <OperationsMetric
        value="3x"
        label="Faster Dispatch"
      />

      <OperationsMetric
        value="99%"
        label="Job Completion"
      />

      <OperationsMetric
        value="24/7"
        label="Live Visibility"
      />

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* AI PLATFORM */}
{/* ===================================================== */}

<section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-5 py-2 text-orange-300">

        <Sparkles className="h-4 w-4" />

        Artificial Intelligence Platform

      </div>

      <h2 className="mt-8 text-5xl font-black text-white">

        AI That Works
        <br />

        For Your Business

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-300">

        KoniqTech AI helps your sales team,
        office staff and technicians complete
        work faster with intelligent automation.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {aiModules.map((module) => {

        const Icon = module.icon

        return (

          <div
            key={module.title}
            className="rounded-[32px] border border-slate-700 bg-slate-900 p-10 transition hover:border-orange-400 hover:-translate-y-2"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-500 p-4">

                <Icon className="h-8 w-8 text-white" />

              </div>

              <h3 className="text-3xl font-bold text-white">

                {module.title}

              </h3>

            </div>

            <p className="mt-6 leading-8 text-slate-300">

              {module.description}

            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {module.features.map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-400" />

                  <span className="text-slate-200">

                    {feature}

                  </span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* AI WORKFLOW */}
{/* ===================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        AI Workflow

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Every AI Action
        <br />

        Saves Your Team Time

      </h2>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-5">

      <AiWorkflowStep
        icon={PhoneCall}
        title="Customer Calls"
      />

      <AiWorkflowStep
        icon={Brain}
        title="AI Understands"
      />

      <AiWorkflowStep
        icon={Workflow}
        title="Automation Runs"
      />

      <AiWorkflowStep
        icon={Mail}
        title="Customer Updated"
      />

      <AiWorkflowStep
        icon={Activity}
        title="CRM Updated"
      />

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* AI DASHBOARD */}
{/* ===================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          AI Insights

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Your Business
          <br />

          Never Stops Learning

        </h2>

        <p className="mt-8 text-lg leading-9 text-slate-600">

          AI continuously analyzes your business to
          improve scheduling, customer satisfaction,
          technician performance and profitability.

        </p>

        <div className="mt-10 space-y-5">

          {[
            "Predict busy seasons",
            "Identify slow-paying customers",
            "Recommend pricing improvements",
            "Optimize technician schedules",
            "Reduce travel time",
            "Improve customer retention",
            "Increase quote conversion",
            "Detect business trends"
          ].map((item) => (

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[36px] bg-slate-900 p-10 text-white shadow-2xl">

        <h3 className="text-3xl font-bold">

          AI Activity Today

        </h3>

        <div className="mt-10 space-y-5">

          <AiActivity text="24 Quotes Generated" />

          <AiActivity text="18 Appointments Scheduled" />

          <AiActivity text="142 Customer Messages Sent" />

          <AiActivity text="11 Jobs Optimized" />

          <AiActivity text="Revenue Forecast Updated" />

          <AiActivity text="Weekly Report Generated" />

        </div>

      </div>

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* AUTOMATION */}
{/* ===================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">
        Automation Engine
      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Let Automation
        <br />

        Handle The Busy Work

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Automate repetitive office work while your
        team focuses on serving customers.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {automationModules.map((module) => {

        const Icon = module.icon

        return (

          <div
            key={module.title}
            className="rounded-[32px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-100 p-4">

                <Icon className="h-8 w-8 text-orange-500" />

              </div>

              <h3 className="text-3xl font-bold text-slate-900">

                {module.title}

              </h3>

            </div>

            <p className="mt-6 leading-8 text-slate-600">

              {module.description}

            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {module.features.map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600" />

                  <span>{feature}</span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* MOBILE APP */}
{/* ===================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

    <div>

      <p className="font-semibold uppercase tracking-widest text-orange-400">

        Technician Mobile App

      </p>

      <h2 className="mt-4 text-5xl font-black text-white">

        Everything Your
        <br />

        Technicians Need

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-300">

        Work anywhere with a powerful mobile
        application designed specifically for
        field technicians.

      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">

        {mobileFeatures.map((item) => (

          <div
            key={item}
            className="flex items-center gap-3"
          >

            <CheckCircle2 className="h-5 w-5 text-green-400" />

            <span className="text-slate-200">

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

    <div className="mx-auto w-full max-w-sm rounded-[48px] border-[12px] border-slate-700 bg-white p-6 shadow-2xl">

      <div className="rounded-3xl bg-orange-500 p-6 text-white">

        <p className="text-sm opacity-80">

          Today's Schedule

        </p>

        <h3 className="mt-2 text-3xl font-bold">

          6 Jobs

        </h3>

      </div>

      <div className="mt-8 space-y-4">

        <MobileTask
          icon={MapPinned}
          title="Navigate"
        />

        <MobileTask
          icon={Camera}
          title="Upload Photos"
        />

        <MobileTask
          icon={FileSignature}
          title="Customer Signature"
        />

        <MobileTask
          icon={CreditCard}
          title="Collect Payment"
        />

        <MobileTask
          icon={WifiOff}
          title="Offline Ready"
        />

        <MobileTask
          icon={RefreshCw}
          title="Sync Automatically"
        />

      </div>

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* CUSTOMER PORTAL */}
{/* ===================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Customer Portal

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Self-Service
        <br />

        Customer Experience

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Give customers a modern portal to manage
        appointments, invoices and communication.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      <div className="rounded-[36px] bg-white p-10 shadow-sm">

        <div className="flex items-center gap-4">

          <MonitorSmartphone className="h-10 w-10 text-orange-500" />

          <h3 className="text-3xl font-bold">

            Portal Features

          </h3>

        </div>

        <div className="mt-10 grid gap-4">

          {portalFeatures.map((feature) => (

            <div
              key={feature}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <span>{feature}</span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[36px] bg-gradient-to-br from-orange-500 to-orange-600 p-10 text-white">

        <UserRound className="h-12 w-12" />

        <h3 className="mt-8 text-4xl font-bold">

          Delight Every Customer

        </h3>

        <p className="mt-6 text-lg leading-8 text-orange-100">

          Customers can schedule appointments,
          approve estimates, pay invoices,
          download documents and communicate
          with your team from one secure portal.

        </p>

        <div className="mt-10 flex items-center gap-3">

          <Globe className="h-6 w-6" />

          Available 24×7 on any device

        </div>

      </div>

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* INTEGRATIONS */}
{/* ===================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Integrations

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Connect With
        <br />

        Your Favorite Tools

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        KoniqTech integrates with popular business
        applications so your team can continue using
        the tools they already trust.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {integrationGroups.map((group) => {

        const Icon = group.icon

        return (

          <div
            key={group.title}
            className="rounded-[32px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-100 p-4">

                <Icon className="h-8 w-8 text-orange-500" />

              </div>

              <div>

                <h3 className="text-3xl font-bold text-slate-900">

                  {group.title}

                </h3>

              </div>

            </div>

            <p className="mt-6 leading-8 text-slate-600">

              {group.description}

            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {group.apps.map((app) => (

                <div
                  key={app}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600" />

                  <span>{app}</span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* DEVELOPER PLATFORM */}
{/* ===================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Developer Platform

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          Extend
          <br />

          KoniqTech

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Build custom integrations,
          synchronize data,
          automate workflows
          and connect external systems.

        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">

          {apiFeatures.map((item) => (

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-400" />

              <span className="text-slate-200">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[36px] bg-slate-800 p-10">

        <div className="space-y-5">

          <ApiCard
            icon={Plug}
            title="REST API"
            value="200+ Endpoints"
          />

          <ApiCard
            icon={Workflow}
            title="Webhooks"
            value="Real-Time Events"
          />

          <ApiCard
            icon={Database}
            title="Data Sync"
            value="Bi-directional"
          />

          <ApiCard
            icon={ArrowRightLeft}
            title="Automation"
            value="Connect Everything"
          />

        </div>

      </div>

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* MARKETPLACE */}
{/* ===================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Marketplace

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Expand Without
        <br />

        Writing Code

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Install templates, automation packs,
        AI assistants and future integrations
        from the KoniqTech Marketplace.

      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      <MarketplaceCard title="Automation Packs" />

      <MarketplaceCard title="Email Templates" />

      <MarketplaceCard title="AI Agents" />

      <MarketplaceCard title="Workflow Library" />

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* SECURITY */}
{/* ===================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Enterprise Security

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Built For
        <br />

        Business Critical Operations

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        KoniqTech is designed to securely manage
        your customers, employees, finances,
        documents and operational data.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {securityModules.map((module) => {

        const Icon = module.icon

        return (

          <div
            key={module.title}
            className="rounded-[32px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-100 p-4">

                <Icon className="h-8 w-8 text-orange-500" />

              </div>

              <h3 className="text-3xl font-bold text-slate-900">

                {module.title}

              </h3>

            </div>

            <p className="mt-6 leading-8 text-slate-600">

              {module.description}

            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {module.features.map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600" />

                  <span>{feature}</span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>

{/* ===================================================== */}
{/* ENTERPRISE */}
{/* ===================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Enterprise Ready

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          Scale Without
          <br />

          Limits

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Whether you manage one technician or
          hundreds across multiple locations,
          KoniqTech grows with your business.

        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">

          {enterpriseFeatures.map((feature) => (

            <div
              key={feature}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-400" />

              <span className="text-slate-200">

                {feature}

              </span>

            </div>

          ))}

        </div>

      </div>

      <div className="grid gap-6">

        <EnterpriseStat
          icon={Building2}
          value="Unlimited"
          label="Organizations"
        />

        <EnterpriseStat
          icon={Users}
          value="Unlimited"
          label="Employees"
        />

        <EnterpriseStat
          icon={Globe}
          value="Multi"
          label="Locations"
        />

        <EnterpriseStat
          icon={Cloud}
          value="99.9%"
          label="Platform Uptime"
        />

      </div>

    </div>

  </div>

</section>


{/* ===================================================== */}
{/* FINAL CTA */}
{/* ===================================================== */}

<section className="bg-gradient-to-r from-orange-500 to-orange-600 py-28">

  <div className="mx-auto max-w-5xl px-6 text-center text-white">

    <BadgeCheck className="mx-auto h-16 w-16" />

    <h2 className="mt-8 text-6xl font-black leading-tight">

      Ready To Run Your
      <br />

      Entire Business
      <br />

      On One Platform?

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-orange-100">

      Join businesses using KoniqTech to manage
      sales, operations, dispatch, AI automation,
      billing and customer communication from
      one modern cloud platform.

    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-6">

      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-100"
      >
        Start Free Trial

        <ArrowRight className="h-5 w-5" />

      </Link>

      <Link
        href="/demo"
        className="rounded-2xl border border-white/40 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
      >
        Schedule Demo
      </Link>

    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-8 text-orange-100">

      <span>✓ No Setup Fees</span>

      <span>✓ Cancel Anytime</span>

      <span>✓ Free Trial</span>

      <span>✓ Enterprise Ready</span>

    </div>

  </div>

</section>



    </main>
  )
}




function EnterpriseCard({
  icon: Icon,
  title,
  description
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-5 rounded-3xl bg-white/10 p-6">
      <div className="rounded-2xl bg-orange-500 p-4">
        <Icon className="h-6 w-6 text-white" />
      </div>

      <div>
        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <p className="mt-1 text-slate-300">
          {description}
        </p>
      </div>
    </div>
  )
}


function WorkflowCard({
  icon: Icon,
  title
}: {
  icon: any
  title: string
}) {

  return (

    <div className="rounded-3xl bg-slate-800 p-8 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500">

        <Icon className="h-8 w-8 text-white" />

      </div>

      <h3 className="mt-6 text-xl font-bold text-white">

        {title}

      </h3>

    </div>

  )

}


function OperationsMetric({
  value,
  label
}: {
  value: string
  label: string
}) {

  return (

    <div className="rounded-3xl bg-white p-8 text-center">

      <div className="text-5xl font-black text-orange-500">

        {value}

      </div>

      <p className="mt-4 text-lg font-semibold text-slate-700">

        {label}

      </p>

    </div>

  )

}


function AiWorkflowStep({
  icon: Icon,
  title
}: {
  icon: any
  title: string
}) {
  return (
    <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">

        <Icon className="h-8 w-8 text-orange-500" />

      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">

        {title}

      </h3>

    </div>
  )
}

function AiActivity({
  text
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

      <Cpu className="h-6 w-6 text-orange-400" />

      <span className="text-slate-200">

        {text}

      </span>

    </div>
  )
}


function MobileTask({
  icon: Icon,
  title
}: {
  icon: any
  title: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border p-4">

      <div className="rounded-xl bg-orange-100 p-3">

        <Icon className="h-5 w-5 text-orange-500" />

      </div>

      <span className="font-medium text-slate-700">

        {title}

      </span>

    </div>
  )
}


function ApiCard({
  icon: Icon,
  title,
  value
}:{
  icon:any
  title:string
  value:string
}){

  return(

    <div className="flex items-center gap-5 rounded-3xl bg-slate-700 p-6">

      <div className="rounded-2xl bg-orange-500 p-4">

        <Icon className="h-7 w-7 text-white"/>

      </div>

      <div>

        <h3 className="text-xl font-bold text-white">

          {title}

        </h3>

        <p className="mt-1 text-slate-300">

          {value}

        </p>

      </div>

    </div>

  )

}

function MarketplaceCard({
  title
}:{
  title:string
}){

  return(

    <div className="rounded-3xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <Code2 className="mx-auto h-10 w-10 text-orange-500"/>

      <h3 className="mt-6 text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-4 leading-7 text-slate-600">

        Ready-to-use extensions that help you
        customize and scale your business.

      </p>

    </div>

  )

}


function EnterpriseStat({
  icon: Icon,
  value,
  label
}: {
  icon: any
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-5 rounded-3xl bg-slate-800 p-8">

      <div className="rounded-2xl bg-orange-500 p-4">

        <Icon className="h-8 w-8 text-white" />

      </div>

      <div>

        <div className="text-3xl font-black text-white">

          {value}

        </div>

        <div className="mt-1 text-slate-300">

          {label}

        </div>

      </div>

    </div>
  )
}