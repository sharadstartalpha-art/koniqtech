import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Wrench,
  Fan,
  ClipboardCheck,
  Users,
  BarChart3,
  
  ShieldCheck,
  Truck,
  Boxes,
  UserRound,
  Package,
 
  FileCheck,
  Thermometer,
Brain,
  Bot,
  Cpu,
  Workflow,
  Smartphone,
  Calendar,
  MessageSquare,
  Mic,
  Bell,
  Plug,
  MapPinned,
  Camera,
  CreditCard,
  Cloud

} from "lucide-react"

export const metadata: Metadata = {
  title: "HVAC CRM Software | KoniqTech",
  description:
    "HVAC CRM software for residential and commercial contractors. Manage service agreements, preventive maintenance, dispatch, technicians, equipment history, invoicing and AI-powered scheduling."
}

const stats = [
  {
    value: "10K+",
    label: "Service Visits"
  },
  {
    value: "97%",
    label: "On-Time Dispatch"
  },
  {
    value: "24/7",
    label: "Emergency Scheduling"
  },
  {
    value: "AI",
    label: "Smart Diagnostics"
  }
]

const benefits = [
  {
    icon: Fan,
    title: "Equipment Management",
    description:
      "Track HVAC equipment, warranties, serial numbers and complete service history."
  },
  {
    icon: ClipboardCheck,
    title: "Preventive Maintenance",
    description:
      "Automate recurring maintenance visits and annual service agreements."
  },
  {
    icon: Users,
    title: "Technician Dispatch",
    description:
      "Assign technicians using intelligent scheduling and real-time availability."
  },
  {
    icon: Wrench,
    title: "Service Operations",
    description:
      "Manage repairs, installations, emergency calls and maintenance from one platform."
  }
]


const workflowSteps = [
  {
    step: "01",
    title: "Lead Capture",
    description:
      "Capture leads from website forms, phone calls, referrals and marketing campaigns. Automatically assign opportunities to your sales team."
  },
  {
    step: "02",
    title: "Schedule Visit",
    description:
      "Book appointments using technician availability, customer preferences, service zones and emergency priorities."
  },
  {
    step: "03",
    title: "Equipment Inspection",
    description:
      "Inspect HVAC equipment, record diagnostics, upload photos and review complete equipment service history."
  },
  {
    step: "04",
    title: "Estimate & Approval",
    description:
      "Generate professional estimates, recommend repairs or replacements and collect customer approvals digitally."
  },
  {
    step: "05",
    title: "Technician Dispatch",
    description:
      "Dispatch technicians, assign work orders, monitor travel status and optimize daily schedules."
  },
  {
    step: "06",
    title: "Service & Maintenance",
    description:
      "Complete repairs, installations and preventive maintenance while recording parts, labor and technician notes."
  },
  {
    step: "07",
    title: "Invoice & Payment",
    description:
      "Generate invoices, accept online payments and automatically update customer account history."
  }
]

const workflowBenefits = [
  "Lead Management",
  "Smart Scheduling",
  "Equipment History",
  "Preventive Maintenance",
  "Service Agreements",
  "Technician Dispatch",
  "Digital Work Orders",
  "Online Payments"
]



const hvacFeatures = [
  {
    icon: Fan,
    title: "Equipment History",
    description:
      "Track every HVAC unit throughout its lifecycle including installations, repairs, maintenance history and warranty information.",
    features: [
      "Serial Numbers",
      "Installation History",
      "Warranty Tracking",
      "Repair Timeline",
      "Maintenance Records"
    ]
  },
  {
    icon: ClipboardCheck,
    title: "Preventive Maintenance",
    description:
      "Automate recurring maintenance visits, seasonal inspections and customer reminders.",
    features: [
      "Recurring Visits",
      "Maintenance Plans",
      "Seasonal Service",
      "Inspection Checklists",
      "Automatic Reminders"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Service Agreements",
    description:
      "Manage service contracts, renewals, covered equipment and customer entitlements.",
    features: [
      "Contract Management",
      "Renewals",
      "Coverage Tracking",
      "Billing",
      "Customer Notifications"
    ]
  },
  {
    icon: Truck,
    title: "Dispatch Management",
    description:
      "Dispatch technicians efficiently based on skills, availability and location.",
    features: [
      "Smart Dispatch",
      "GPS Routing",
      "Live Technician Status",
      "Emergency Jobs",
      "Travel Optimization"
    ]
  },
  {
    icon: Boxes,
    title: "Inventory Management",
    description:
      "Track warehouse inventory, technician truck stock and supplier purchases.",
    features: [
      "Warehouse Inventory",
      "Truck Stock",
      "Purchase Orders",
      "Suppliers",
      "Low Stock Alerts"
    ]
  },
  {
    icon: UserRound,
    title: "Customer Portal",
    description:
      "Allow customers to review service history, invoices, maintenance schedules and upcoming appointments.",
    features: [
      "Service History",
      "Invoices",
      "Appointments",
      "Online Payments",
      "Documents"
    ]
  }
]

const operations = [
  {
    icon: Wrench,
    title: "Repair Management"
  },
  {
    icon: Thermometer,
    title: "Equipment Diagnostics"
  },
  {
    icon: Package,
    title: "Parts Tracking"
  },
  {
    icon: FileCheck,
    title: "Digital Work Orders"
  }
]



const aiFeatures = [
  {
    icon: Bot,
    title: "AI HVAC Assistant",
    description:
      "Help office staff answer customer questions, schedule appointments and manage daily operations."
  },
  {
    icon: Brain,
    title: "AI Diagnostics",
    description:
      "Analyze equipment history and technician notes to recommend likely repair solutions."
  },
  {
    icon: Cpu,
    title: "Predictive Maintenance",
    description:
      "Identify equipment that may require maintenance before costly failures occur."
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automatically assign technicians, send reminders and update customers throughout every service call."
  }
]

const mobileFeatures = [
  "Today's Schedule",
  "GPS Navigation",
  "Equipment History",
  "Customer Information",
  "Photo Uploads",
  "Video Inspection",
  "Digital Signatures",
  "Offline Mode",
  "Parts Usage",
  "Invoice Creation",
  "Payment Collection",
  "Real-Time Updates"
]

const integrations = [
  "Google Calendar",
  "Google Maps",
  "QuickBooks",
  "PayPal",
  "Stripe",
  "OpenAI",
  "Twilio",
  "Resend",
  "AWS S3",
  "Cloudflare R2"
]

const hvacFaq = [
  {
    question: "Can KoniqTech manage residential and commercial HVAC businesses?",
    answer:
      "Yes. KoniqTech supports both residential and commercial HVAC companies with dispatching, maintenance plans, installations, equipment tracking and invoicing."
  },
  {
    question: "Can I manage recurring maintenance agreements?",
    answer:
      "Yes. You can create preventive maintenance plans, automate recurring visits and manage service agreement renewals."
  },
  {
    question: "Does the platform track equipment history?",
    answer:
      "Yes. Every HVAC unit maintains a complete history including installations, repairs, maintenance records, warranties and technician notes."
  },
  {
    question: "Can technicians use the mobile app offline?",
    answer:
      "Yes. Technicians can continue working while offline and synchronize data once connectivity is restored."
  },
  {
    question: "Can customers pay online?",
    answer:
      "Yes. Customers can review invoices and make secure online payments through supported payment providers."
  },
  {
    question: "Does KoniqTech include AI features?",
    answer:
      "Yes. AI assists with scheduling, diagnostics, customer communication and workflow automation."
  }
]

const trustItems = [
  "Cloud-Based Platform",
  "AI-Powered Scheduling",
  "Preventive Maintenance",
  "Secure Customer Data",
  "Role-Based Access",
  "Mobile Workforce",
  "Continuous Updates",
  "Dedicated Support"
]


export default function HVACPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-orange-600">

                <Sparkles className="h-4 w-4" />

                HVAC CRM Software

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Built For

                <span className="block text-orange-500">

                  Modern HVAC Contractors

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Manage service calls,
                maintenance contracts,
                technicians,
                dispatch,
                installations,
                equipment history,
                AI automation
                and customer communication
                from one connected platform.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold transition hover:bg-slate-50"
                >

                  Book Demo

                </Link>

              </div>

            </div>

            {/* Dashboard */}

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    HVAC Dashboard

                  </h3>

                  <BarChart3 className="h-8 w-8 text-orange-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Today's Calls"
                    value="42"
                  />

                  <DashboardMetric
                    title="Active Technicians"
                    value="18"
                  />

                  <DashboardMetric
                    title="Open Work Orders"
                    value="31"
                  />

                  <DashboardMetric
                    title="Monthly Revenue"
                    value="$184K"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}


         <section className="pb-28">

          <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => (

              <StatCard
                key={item.label}
                value={item.value}
                label={item.label}
              />

            ))}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* WHY HVAC */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-500">

              Why HVAC Companies Choose KoniqTech

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything Your HVAC Business
              Needs In One Platform

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Replace spreadsheets,
              paper work orders,
              manual scheduling
              and disconnected software
              with one AI-powered platform
              designed specifically
              for HVAC companies.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {benefits.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-orange-100 p-4">

                    <Icon className="h-8 w-8 text-orange-500" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>



     {/* ====================================================== */}
{/* HVAC WORKFLOW */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        HVAC Workflow

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Complete HVAC Service Workflow

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        From the first customer inquiry to the
        final invoice, KoniqTech keeps your office,
        dispatchers and technicians working together
        with one connected workflow.

      </p>

    </div>

    <div className="mt-24 space-y-8">

      {workflowSteps.map((step, index) => (

        <WorkflowCard
          key={step.step}
          step={step.step}
          title={step.title}
          description={step.description}
          last={index === workflowSteps.length - 1}
        />

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* CONNECTED PLATFORM */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Connected Platform

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          Everything Works
          Together

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Customer information,
          equipment history,
          maintenance plans,
          dispatch,
          technicians,
          invoices and payments
          stay synchronized automatically.

        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        {workflowBenefits.map((item) => (

          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-slate-800 p-5"
          >

            <CheckCircle2 className="h-5 w-5 text-green-400" />

            <span className="text-slate-200">

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* HVAC FEATURES */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        HVAC Features

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Everything Needed
        <br />

        To Run Your HVAC Business

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        From service agreements to technician
        dispatch and equipment history,
        KoniqTech keeps every operation connected.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {hvacFeatures.map((feature)=>{

        const Icon = feature.icon

        return(

          <FeatureCard
            key={feature.title}
            icon={<Icon className="h-8 w-8 text-orange-500" />}
            title={feature.title}
            description={feature.description}
            items={feature.features}
          />

        )

      })}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* HVAC OPERATIONS */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          Operations Management

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Manage Every
          HVAC Operation

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Dispatch technicians,
          manage parts,
          monitor repairs,
          track equipment,
          and automate preventive maintenance
          from one dashboard.

        </p>

        <div className="mt-10 space-y-5">

          {operations.map((item)=>{

            const Icon = item.icon

            return(

              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
              >

                <div className="rounded-xl bg-orange-100 p-3">

                  <Icon className="h-6 w-6 text-orange-500"/>

                </div>

                <span className="text-lg font-semibold">

                  {item.title}

                </span>

              </div>

            )

          })}

        </div>

      </div>

      <div className="rounded-[40px] bg-slate-900 p-10 text-white">

        <h3 className="text-3xl font-bold">

          HVAC Operations

        </h3>

        <div className="mt-10 space-y-5">

          <OperationRow
            title="Today's Calls"
            value="42"
          />

          <OperationRow
            title="Technicians Available"
            value="18"
          />

          <OperationRow
            title="Maintenance Plans"
            value="256"
          />

          <OperationRow
            title="Equipment Installed"
            value="1,248"
          />

          <OperationRow
            title="Monthly Revenue"
            value="$184K"
          />

        </div>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* AI PLATFORM */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Artificial Intelligence

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          AI Built For
          <br/>

          HVAC Companies

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Automate scheduling,
          improve diagnostics,
          assist technicians and
          deliver a better customer
          experience using built-in AI.

        </p>

        <div className="mt-12 space-y-6">

          {aiFeatures.map((feature)=>{

            const Icon = feature.icon

            return(

              <div
                key={feature.title}
                className="rounded-3xl bg-slate-800 p-6"
              >

                <div className="flex gap-5">

                  <div className="rounded-2xl bg-orange-500 p-4">

                    <Icon className="h-7 w-7 text-white"/>

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-white">

                      {feature.title}

                    </h3>

                    <p className="mt-3 leading-8 text-slate-300">

                      {feature.description}

                    </p>

                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </div>

      <div className="rounded-[40px] bg-slate-800 p-10">

        <h3 className="text-3xl font-bold text-white">

          AI Automation Center

        </h3>

        <div className="mt-10 space-y-5">

          <AutomationRow
            title="AI Diagnostics"
            icon={Brain}
          />

          <AutomationRow
            title="Schedule Technician"
            icon={Calendar}
          />

          <AutomationRow
            title="Customer Updates"
            icon={MessageSquare}
          />

          <AutomationRow
            title="Voice Assistant"
            icon={Mic}
          />

          <AutomationRow
            title="Smart Notifications"
            icon={Bell}
          />

        </div>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* MOBILE APP */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div className="rounded-[40px] border bg-slate-50 p-10 shadow-lg">

        <Smartphone className="h-14 w-14 text-orange-500"/>

        <h3 className="mt-8 text-3xl font-bold">

          HVAC Technician App

        </h3>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          {mobileFeatures.map((feature)=>(

            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
            >

              <CheckCircle2 className="h-5 w-5 text-green-600"/>

              <span>{feature}</span>

            </div>

          ))}

        </div>

      </div>

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          Mobile Workforce

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Everything Your
          Technician Needs

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Access customer records,
          equipment history,
          navigation,
          work orders,
          inspections,
          invoices and payments
          from any supported mobile device.

        </p>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* INTEGRATIONS */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Integrations

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Connect Your
        Favorite Tools

      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

        Integrate with accounting,
        communication,
        AI and cloud services
        to simplify your daily operations.

      </p>

    </div>

    <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      {integrations.map((item)=>(

        <div
          key={item}
          className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
        >

          <Plug className="mx-auto h-10 w-10 text-orange-500"/>

          <h3 className="mt-5 text-xl font-bold">

            {item}

          </h3>

        </div>

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* FAQ */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-5xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Frequently Asked Questions

      </p>

      <h2 className="mt-4 text-5xl font-black">

        HVAC CRM Questions

      </h2>

    </div>

    <div className="mt-20 space-y-6">

      {hvacFaq.map((faq)=>(

        <FaqCard
          key={faq.question}
          question={faq.question}
          answer={faq.answer}
        />

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* TRUST */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          Built For HVAC Businesses

        </p>

        <h2 className="mt-4 text-5xl font-black">

          One Platform
          <br/>

          Built For Growth

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          KoniqTech combines CRM,
          dispatch,
          maintenance,
          AI,
          customer management
          and business automation
          into one connected platform.

        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        {trustItems.map((item)=>(

          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-sm"
          >

            <CheckCircle2 className="h-5 w-5 text-green-600"/>

            <span className="font-medium">

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* PRICING CTA */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-6xl px-6">

    <div className="rounded-[40px] bg-slate-800 p-14">

      <div className="grid items-center gap-12 lg:grid-cols-2">

        <div>

          <p className="font-semibold uppercase tracking-widest text-orange-400">

            Simple Pricing

          </p>

          <h2 className="mt-4 text-5xl font-black text-white">

            Grow Your HVAC
            <br/>

            Business Faster

          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Start with the plan that fits
            your business today and upgrade
            whenever your team grows.

          </p>

        </div>

        <div className="space-y-4">

          <Link
            href="/pricing"
            className="flex h-14 items-center justify-center rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
          >

            View Pricing

          </Link>

          <Link
            href="/demo"
            className="flex h-14 items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
          >

            Book Demo

          </Link>

          <Link
            href="/register"
            className="flex h-14 items-center justify-center rounded-2xl bg-green-600 font-semibold text-white transition hover:bg-green-700"
          >

            Start Free Trial

          </Link>

        </div>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* FINAL CTA */}
{/* ====================================================== */}

<section className="bg-gradient-to-r from-orange-500 to-orange-600 py-28">

  <div className="mx-auto max-w-5xl px-6 text-center text-white">

    <Sparkles className="mx-auto h-16 w-16"/>

    <h2 className="mt-8 text-6xl font-black leading-tight">

      Ready To Modernize
      <br/>

      Your HVAC Business?

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-orange-100">

      Manage service requests,
      technicians,
      maintenance contracts,
      equipment,
      AI automation,
      dispatch and invoicing
      from one intelligent platform.

    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-6">

      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-100"
      >

        Start Free Trial

        <ArrowRight className="h-5 w-5"/>

      </Link>

      <Link
        href="/demo"
        className="rounded-2xl border border-white/40 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
      >

        Schedule Demo

      </Link>

    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-8 text-orange-100">

      <span>✓ AI Powered</span>

      <span>✓ Preventive Maintenance</span>

      <span>✓ Mobile Workforce</span>

      <span>✓ Built For HVAC Contractors</span>

    </div>

  </div>

</section>



    </main>
  )
}

function StatCard({
  value,
  label
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-[32px] border bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-black text-orange-500">

        {value}

      </div>

      <p className="mt-4 text-lg font-semibold text-slate-700">

        {label}

      </p>

    </div>
  )
}

function DashboardMetric({
  title,
  value
}: {
  title: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-800 px-6 py-5">

      <span className="text-slate-300">

        {title}

      </span>

      <span className="text-2xl font-bold text-orange-400">

        {value}

      </span>

    </div>
  )
}

function WorkflowCard({
  step,
  title,
  description,
  last
}: {
  step: string
  title: string
  description: string
  last: boolean
}) {

  return (

    <div className="relative flex gap-8">

      <div className="flex flex-col items-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-xl font-black text-white">

          {step}

        </div>

        {!last && (

          <div className="mt-2 h-full w-1 rounded-full bg-orange-200" />

        )}

      </div>

      <div className="flex-1 rounded-[32px] border bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

        <h3 className="text-3xl font-bold text-slate-900">

          {title}

        </h3>

        <p className="mt-5 text-lg leading-8 text-slate-600">

          {description}

        </p>

      </div>

    </div>

  )

}


function FeatureCard({
  icon,
  title,
  description,
  items
}:{
  icon:React.ReactNode
  title:string
  description:string
  items:string[]
}){

  return(

    <div className="rounded-[36px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center gap-5">

        <div className="rounded-2xl bg-orange-100 p-4">

          {icon}

        </div>

        <h3 className="text-3xl font-bold">

          {title}

        </h3>

      </div>

      <p className="mt-6 leading-8 text-slate-600">

        {description}

      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        {items.map((item)=>(

          <div
            key={item}
            className="flex items-center gap-3"
          >

            <CheckCircle2 className="h-5 w-5 text-green-600"/>

            <span>{item}</span>

          </div>

        ))}

      </div>

    </div>

  )

}

function OperationRow({
  title,
  value
}:{
  title:string
  value:string
}){

  return(

    <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-5">

      <span className="text-slate-300">

        {title}

      </span>

      <span className="text-2xl font-bold text-orange-400">

        {value}

      </span>

    </div>

  )

}

function AutomationRow({
  title,
  icon: Icon
}:{
  title:string
  icon:any
}){

  return(

    <div className="flex items-center gap-4 rounded-2xl bg-slate-700 p-5">

      <div className="rounded-xl bg-orange-500 p-3">

        <Icon className="h-5 w-5 text-white"/>

      </div>

      <span className="text-lg font-semibold text-white">

        {title}

      </span>

    </div>

  )

}


function FaqCard({
  question,
  answer
}:{
  question:string
  answer:string
}){

  return(

    <div className="rounded-[32px] border bg-slate-50 p-8">

      <h3 className="text-2xl font-bold text-slate-900">

        {question}

      </h3>

      <p className="mt-5 text-lg leading-8 text-slate-600">

        {answer}

      </p>

    </div>

  )

}