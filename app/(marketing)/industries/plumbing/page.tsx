import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Wrench,
  Droplets,
  ClipboardCheck,
  Users,
  BarChart3,
  Brain,
  Bot,
  Cpu,
  Workflow,
  Smartphone,
  Calendar,
  MessageSquare,
  Mic,
  Bell,
  Plug
} from "lucide-react"

export const metadata: Metadata = {
  title: "Plumbing CRM Software | KoniqTech",
  description:
    "Modern Plumbing CRM software for residential and commercial plumbing contractors. Manage service calls, technicians, dispatch, estimates, invoices, maintenance plans and AI automation from one platform."
}

const stats = [
  {
    value: "18K+",
    label: "Service Calls"
  },
  {
    value: "99%",
    label: "Response Rate"
  },
  {
    value: "24/7",
    label: "Emergency Dispatch"
  },
  {
    value: "AI",
    label: "Smart Scheduling"
  }
]

const benefits = [
  {
    icon: Droplets,
    title: "Plumbing Service Management",
    description:
      "Manage repairs, leak detection, drain cleaning, installations and emergency plumbing services."
  },
  {
    icon: ClipboardCheck,
    title: "Maintenance Plans",
    description:
      "Offer recurring plumbing maintenance plans with automatic reminders and renewals."
  },
  {
    icon: Users,
    title: "Technician Dispatch",
    description:
      "Dispatch plumbers using intelligent scheduling, GPS routing and real-time technician tracking."
  },
  {
    icon: Wrench,
    title: "Work Order Management",
    description:
      "Create digital work orders, attach photos, capture signatures and generate invoices instantly."
  }
]


const workflowSteps = [
  {
    step: "01",
    title: "Lead Capture",
    description:
      "Capture plumbing service requests from phone calls, website forms, Google Ads, referrals and emergency requests."
  },
  {
    step: "02",
    title: "Inspection",
    description:
      "Inspect leaks, drainage systems, pipes, fixtures and plumbing infrastructure while documenting photos and notes."
  },
  {
    step: "03",
    title: "Estimate",
    description:
      "Generate professional estimates with labor, materials, taxes and optional repair recommendations."
  },
  {
    step: "04",
    title: "Dispatch",
    description:
      "Automatically assign the nearest qualified plumber using GPS routing, availability and workload."
  },
  {
    step: "05",
    title: "Repair & Installation",
    description:
      "Track repairs, replacements, installations and emergency plumbing work with digital work orders."
  },
  {
    step: "06",
    title: "Invoice & Payment",
    description:
      "Generate invoices immediately after work completion and collect online or on-site payments."
  }
]

const workflowBenefits = [
  "Emergency Dispatch",
  "Digital Estimates",
  "Leak Detection",
  "GPS Technician Tracking",
  "Inventory Management",
  "Photo Documentation",
  "Digital Signatures",
  "Online Payments"
]

   const plumbingFeatures = [
  {
    icon: Droplets,
    title: "Leak Detection",
    description:
      "Track leak inspections, water damage reports, repair history and technician findings from one centralized dashboard."
  },
  {
    icon: Wrench,
    title: "Pipe Repair & Replacement",
    description:
      "Manage residential and commercial pipe repairs, replacements and emergency restoration projects."
  },
  {
    icon: ClipboardCheck,
    title: "Drain Cleaning",
    description:
      "Schedule drain cleaning services, sewer inspections and recurring maintenance appointments."
  },
  {
    icon: BarChart3,
    title: "Inventory Management",
    description:
      "Track pipes, fittings, valves, fixtures, water heaters and every part used on plumbing jobs."
  },
  {
    icon: Users,
    title: "Customer Portal",
    description:
      "Customers can approve estimates, review invoices, request service and track technician arrival."
  },
  {
    icon: CheckCircle2,
    title: "Digital Work Orders",
    description:
      "Complete inspections, capture signatures, upload photos and close jobs directly from the field."
  }
]

const operations = [
  {
    title: "Emergency Calls",
    value: "12"
  },
  {
    title: "Today's Jobs",
    value: "47"
  },
  {
    title: "Active Technicians",
    value: "21"
  },
  {
    title: "Invoices Sent",
    value: "38"
  },
  {
    title: "Customer Satisfaction",
    value: "98%"
  },
  {
    title: "Average Response",
    value: "26 min"
  }
]


const aiFeatures = [
  {
    icon: Bot,
    title: "AI Plumbing Assistant",
    description:
      "Answer customer questions, schedule service calls and assist office staff using AI-powered conversations."
  },
  {
    icon: Brain,
    title: "Smart Diagnostics",
    description:
      "Analyze previous repairs, technician notes and plumbing history to recommend likely repair solutions."
  },
  {
    icon: Cpu,
    title: "Predictive Maintenance",
    description:
      "Identify plumbing systems that require maintenance before costly failures occur."
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automatically dispatch technicians, send reminders, generate invoices and keep customers updated."
  }
]

const mobileFeatures = [
  "Today's Schedule",
  "GPS Navigation",
  "Customer Details",
  "Digital Work Orders",
  "Leak Inspection Photos",
  "Video Uploads",
  "Parts Used",
  "Offline Mode",
  "Digital Signature",
  "Invoice Generation",
  "Payment Collection",
  "Real-Time Sync"
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

const plumbingFaq = [
  {
    question: "Can KoniqTech manage residential and commercial plumbing companies?",
    answer:
      "Yes. KoniqTech is designed for both residential and commercial plumbing contractors, supporting service calls, emergency repairs, maintenance plans, installations and large commercial projects."
  },
  {
    question: "Can technicians use the mobile app on-site?",
    answer:
      "Yes. Technicians can access work orders, customer information, plumbing history, upload photos, collect signatures and generate invoices directly from the mobile app."
  },
  {
    question: "Does KoniqTech support emergency plumbing dispatch?",
    answer:
      "Yes. Emergency jobs can be prioritized automatically and assigned to the nearest available technician using GPS-based dispatch."
  },
  {
    question: "Can customers approve estimates online?",
    answer:
      "Yes. Customers can review estimates, approve work, pay invoices and track service appointments through the customer portal."
  },
  {
    question: "Does KoniqTech include AI features?",
    answer:
      "Yes. AI helps with scheduling, dispatching, customer communication, predictive maintenance and workflow automation."
  },
  {
    question: "Can I track plumbing inventory?",
    answer:
      "Yes. Pipes, fittings, valves, fixtures, water heaters and all inventory items can be managed in real time."
  }
]

const trustItems = [
  "24/7 Emergency Dispatch",
  "AI Scheduling",
  "Customer Portal",
  "Secure Cloud Platform",
  "Role-Based Access",
  "Real-Time Technician Tracking",
  "Automatic Backups",
  "Enterprise Support"
]


export default function PlumbingPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-5 py-2 text-cyan-700">

                <Sparkles className="h-4 w-4" />

                Plumbing CRM Software

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Built For

                <span className="block text-cyan-600">

                  Modern Plumbing Companies

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Manage service calls,
                dispatch,
                technicians,
                estimates,
                maintenance,
                invoices,
                AI scheduling
                and customer communication
                from one intelligent platform.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-8 py-4 font-semibold text-white transition hover:bg-cyan-700"
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

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Plumbing Dashboard

                  </h3>

                  <BarChart3 className="h-8 w-8 text-cyan-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Today's Jobs"
                    value="46"
                  />

                  <DashboardMetric
                    title="Active Plumbers"
                    value="22"
                  />

                  <DashboardMetric
                    title="Emergency Calls"
                    value="7"
                  />

                  <DashboardMetric
                    title="Monthly Revenue"
                    value="$236K"
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
      {/* WHY PLUMBING */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-cyan-600">

              Why Plumbing Companies Choose KoniqTech

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything Your Plumbing Business
              Needs In One Platform

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Replace spreadsheets,
              paperwork,
              manual scheduling
              and disconnected systems
              with one AI-powered operating platform
              built specifically for plumbing contractors.

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

                  <div className="w-fit rounded-2xl bg-cyan-100 p-4">

                    <Icon className="h-8 w-8 text-cyan-600" />

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
{/* PLUMBING WORKFLOW */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-cyan-600">

        Plumbing Workflow

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Complete Plumbing Service Workflow

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        From the customer's first call
        to the final payment,
        KoniqTech keeps office staff,
        dispatchers and plumbers connected
        throughout every service job.

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

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-cyan-400">

          Connected Platform

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          Every Plumbing Job
          <br />

          Connected Together

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Customer records,
          inspections,
          estimates,
          dispatch,
          inventory,
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
{/* PLUMBING FEATURES */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-cyan-600">

        Complete Plumbing Platform

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Everything A Plumbing Company
        Needs

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        From emergency repairs
        to scheduled maintenance,
        KoniqTech helps plumbing companies
        manage every customer,
        technician,
        inventory item
        and invoice from one platform.

      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {plumbingFeatures.map((feature)=>{

        const Icon = feature.icon

        return(

          <FeatureCard
            key={feature.title}
            icon={<Icon className="h-8 w-8 text-cyan-600"/>}
            title={feature.title}
            description={feature.description}
          />

        )

      })}

    </div>

  </div>

</section>

  {/* ====================================================== */}
{/* OPERATIONS DASHBOARD */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-cyan-600">

          Live Operations

        </p>

        <h2 className="mt-4 text-5xl font-black text-slate-900">

          Manage Every Plumbing
          Operation In Real Time

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Office staff,
          dispatchers
          and technicians always stay
          synchronized with live updates,
          GPS tracking,
          work orders,
          invoices
          and customer communications.

        </p>

        <div className="mt-10 space-y-5">

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Real-Time Technician Tracking</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Digital Job Updates</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Customer Notifications</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Instant Invoice Generation</span>

          </div>

        </div>

      </div>

      <div className="rounded-[36px] bg-slate-900 p-10">

        <h3 className="text-3xl font-bold text-white">

          Operations Dashboard

        </h3>

        <div className="mt-10 space-y-5">

          {operations.map((item)=>(

            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl bg-slate-800 px-6 py-5"
            >

              <span className="text-slate-300">

                {item.title}

              </span>

              <span className="text-2xl font-bold text-cyan-400">

                {item.value}

              </span>

            </div>

          ))}

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

        <p className="font-semibold uppercase tracking-widest text-cyan-400">

          Artificial Intelligence

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          AI Built For
          <br/>

          Plumbing Companies

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Automate dispatching,
          improve technician productivity,
          predict maintenance,
          communicate with customers
          and simplify daily operations.

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

                  <div className="rounded-2xl bg-cyan-600 p-4">

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
            title="Automatic Dispatch"
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

        <Smartphone className="h-14 w-14 text-cyan-600"/>

        <h3 className="mt-8 text-3xl font-bold">

          Plumbing Technician App

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

        <p className="font-semibold uppercase tracking-widest text-cyan-600">

          Mobile Workforce

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Everything Your
          Plumbers Need

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Access work orders,
          navigation,
          customer information,
          plumbing history,
          invoices,
          estimates and payments
          directly from the mobile app.

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

      <p className="font-semibold uppercase tracking-widest text-cyan-600">

        Integrations

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Connect Your
        Favorite Tools

      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

        Integrate accounting,
        communication,
        cloud storage,
        AI services
        and payment providers
        into one connected platform.

      </p>

    </div>

    <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      {integrations.map((item)=>(

        <div
          key={item}
          className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
        >

          <Plug className="mx-auto h-10 w-10 text-cyan-600"/>

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

      <p className="font-semibold uppercase tracking-widest text-cyan-600">

        Frequently Asked Questions

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Plumbing CRM Questions

      </h2>

    </div>

    <div className="mt-20 space-y-6">

      {plumbingFaq.map((faq)=>(

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

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-cyan-600">

          Trusted Plumbing Platform

        </p>

        <h2 className="mt-4 text-5xl font-black text-slate-900">

          Built To Help
          Plumbing Companies Grow

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Replace paperwork,
          spreadsheets,
          disconnected software
          and manual scheduling
          with one AI-powered platform
          built specifically for plumbing contractors.

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

      <div className="grid gap-12 lg:grid-cols-2 items-center">

        <div>

          <p className="font-semibold uppercase tracking-widest text-cyan-400">

            Simple Pricing

          </p>

          <h2 className="mt-4 text-5xl font-black text-white">

            Modern Software
            For Modern Plumbers

          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Start with a free trial,
            scale as your company grows
            and manage every plumbing operation
            from one connected platform.

          </p>

        </div>

        <div className="space-y-4">

          <Link
            href="/pricing"
            className="flex h-14 items-center justify-center rounded-2xl bg-cyan-600 font-semibold text-white transition hover:bg-cyan-700"
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

<section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-28">

  <div className="mx-auto max-w-5xl px-6 text-center text-white">

    <Sparkles className="mx-auto h-16 w-16"/>

    <h2 className="mt-8 text-6xl font-black leading-tight">

      Ready To Grow
      <br/>

      Your Plumbing Business?

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-cyan-100">

      Manage technicians,
      service requests,
      maintenance plans,
      inventory,
      invoices,
      customer communication
      and AI automation
      from one intelligent CRM.

    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-6">

      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-cyan-700 transition hover:bg-cyan-50"
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

    <div className="mt-10 flex flex-wrap justify-center gap-8 text-cyan-100">

      <span>✓ AI Powered</span>

      <span>✓ Emergency Dispatch</span>

      <span>✓ Mobile Workforce</span>

      <span>✓ Built For Plumbing Contractors</span>

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

      <div className="text-5xl font-black text-cyan-600">

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

      <span className="text-2xl font-bold text-cyan-400">

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

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-600 text-xl font-black text-white">

          {step}

        </div>

        {!last && (

          <div className="mt-2 h-full w-1 rounded-full bg-cyan-200" />

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
  description
}:{
  icon:React.ReactNode
  title:string
  description:string
}){

  return(

    <div className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="w-fit rounded-2xl bg-cyan-100 p-4">

        {icon}

      </div>

      <h3 className="mt-8 text-3xl font-bold text-slate-900">

        {title}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {description}

      </p>

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

      <div className="rounded-xl bg-cyan-600 p-3">

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