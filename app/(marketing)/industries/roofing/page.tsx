import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  CheckCircle2,
  Home,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Users,
  Hammer,
  Ruler,
  Package,
  Shield,
  UserRound,
  Camera,
  ClipboardCheck,
  FileText,
  Boxes,
  Truck,
  Brain,
  Bot,
  Smartphone,
  Workflow,
  Cpu,
  MessageSquare,
  Calendar,
  Plug,
  Cloud,
  CreditCard,
  MapPinned,
  
  Mic,
  Bell
} from "lucide-react"

export const metadata: Metadata = {
  title: "Roofing CRM Software | KoniqTech",
  description:
    "Roofing CRM software for residential and commercial contractors. Manage leads, inspections, estimates, crews, insurance claims, materials, scheduling and invoicing from one platform."
}

const stats = [
  {
    value: "500+",
    label: "Projects Managed"
  },
  {
    value: "95%",
    label: "On-Time Completion"
  },
  {
    value: "AI",
    label: "Estimate Automation"
  },
  {
    value: "24×7",
    label: "Cloud Platform"
  }
]

const benefits = [
  {
    icon: Home,
    title: "Roof Inspections",
    description:
      "Capture inspections, photos and roof measurements directly from the field."
  },
  {
    icon: Users,
    title: "Crew Management",
    description:
      "Assign crews, schedule work and monitor project progress in real time."
  },
  {
    icon: ShieldCheck,
    title: "Insurance Claims",
    description:
      "Track insurance documentation, approvals and customer communication."
  },
  {
    icon: Hammer,
    title: "Project Execution",
    description:
      "Manage materials, change orders, punch lists and final invoicing."
  }
]

const workflowSteps = [
  {
    step: "01",
    title: "Lead Capture",
    description:
      "Capture leads from your website, phone calls, referrals and marketing campaigns. Assign them automatically to your sales team."
  },
  {
    step: "02",
    title: "Roof Inspection",
    description:
      "Schedule inspections, capture property details, upload photos and record roof conditions directly from the field."
  },
  {
    step: "03",
    title: "Measurements & Estimate",
    description:
      "Generate roof measurements, calculate materials, prepare professional estimates and send digital proposals."
  },
  {
    step: "04",
    title: "Insurance Claim",
    description:
      "Track insurance claims, documentation, adjuster meetings and customer approvals from one place."
  },
  {
    step: "05",
    title: "Crew Scheduling",
    description:
      "Assign crews, equipment and vehicles while monitoring availability and project timelines."
  },
  {
    step: "06",
    title: "Project Execution",
    description:
      "Track project progress, daily updates, materials used, photos and customer communication."
  },
  {
    step: "07",
    title: "Invoice & Payment",
    description:
      "Generate invoices, collect online payments and maintain complete financial records."
  }
]

const workflowBenefits = [
  "Lead Qualification",
  "Inspection Scheduling",
  "Roof Measurements",
  "Insurance Tracking",
  "Crew Assignment",
  "Material Management",
  "Customer Updates",
  "Digital Invoices"
]


const roofingFeatures = [
  {
    icon: Ruler,
    title: "Roof Measurements",
    description:
      "Measure roof dimensions, calculate pitch, estimate waste and generate accurate material requirements.",
    features: [
      "Roof Area",
      "Pitch Calculator",
      "Waste Calculation",
      "Material Estimation",
      "Measurement History"
    ]
  },
  {
    icon: Package,
    title: "Material Management",
    description:
      "Track inventory, purchase orders, deliveries and supplier information across every project.",
    features: [
      "Inventory",
      "Purchase Orders",
      "Suppliers",
      "Material Usage",
      "Stock Alerts"
    ]
  },
  {
    icon: Shield,
    title: "Insurance Claims",
    description:
      "Organize documentation, photos, approvals and claim progress in one secure workspace.",
    features: [
      "Claim Tracking",
      "Adjuster Notes",
      "Document Storage",
      "Customer Updates",
      "Approval Status"
    ]
  },
  {
    icon: Users,
    title: "Crew Management",
    description:
      "Schedule crews, assign supervisors, monitor attendance and track project productivity.",
    features: [
      "Crew Assignment",
      "Schedules",
      "Attendance",
      "GPS Tracking",
      "Productivity"
    ]
  },
  {
    icon: UserRound,
    title: "Customer Portal",
    description:
      "Give homeowners visibility into estimates, project progress, invoices and payments.",
    features: [
      "Estimates",
      "Contracts",
      "Photos",
      "Invoices",
      "Online Payments"
    ]
  },
  {
    icon: Camera,
    title: "Project Documentation",
    description:
      "Capture before-and-after photos, inspection reports and completion records directly from the job site.",
    features: [
      "Photo Gallery",
      "Inspection Reports",
      "Videos",
      "Documents",
      "Completion Notes"
    ]
  }
]

const projectManagement = [
  {
    icon: ClipboardCheck,
    title: "Project Tracking"
  },
  {
    icon: FileText,
    title: "Digital Contracts"
  },
  {
    icon: Boxes,
    title: "Warehouse Inventory"
  },
  {
    icon: Truck,
    title: "Fleet Scheduling"
  }
]


const aiFeatures = [
  {
    icon: Bot,
    title: "AI Roofing Assistant",
    description:
      "Answer questions, recommend next actions and help office staff complete daily tasks."
  },
  {
    icon: Brain,
    title: "AI Estimate Generator",
    description:
      "Prepare professional roofing estimates using project information and historical pricing."
  },
  {
    icon: Cpu,
    title: "Predictive Scheduling",
    description:
      "Optimize crew assignments based on workload, availability and project timelines."
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automatically notify customers, assign tasks and move projects through each stage."
  }
]

const mobileFeatures = [
  "Today's Schedule",
  "Customer Information",
  "GPS Navigation",
  "Inspection Forms",
  "Photo Uploads",
  "Videos",
  "Offline Access",
  "Digital Signatures",
  "Material Usage",
  "Invoice Creation",
  "Payment Collection",
  "Real-Time Updates"
]

const integrations = [
  "Google Calendar",
  "PayPal",
  "Stripe",
  "QuickBooks",
  "OpenAI",
  "Twilio",
  "Resend",
  "Cloudflare R2",
  "AWS S3",
  "Google Maps"
]
  

   const roofingFaq = [
  {
    question: "Can KoniqTech manage residential and commercial roofing projects?",
    answer:
      "Yes. KoniqTech is designed to support both residential and commercial roofing businesses with project tracking, crew management and customer communication."
  },
  {
    question: "Can I manage insurance claims?",
    answer:
      "Yes. Track claim status, upload documents, store inspection photos and keep customer records organized throughout the claim process."
  },
  {
    question: "Can technicians upload photos from the job site?",
    answer:
      "Yes. Field teams can capture photos, videos and notes directly from supported mobile devices."
  },
  {
    question: "Does KoniqTech support online estimates and invoices?",
    answer:
      "Yes. Generate professional estimates, convert them into jobs and send invoices with online payment options."
  },
  {
    question: "Can customers track project progress?",
    answer:
      "Yes. The customer portal allows clients to review estimates, project updates, documents and invoices."
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. New customers can start with a free trial to evaluate the platform before subscribing."
  }
]

const trustItems = [
  "Cloud-Based Platform",
  "Multi-Tenant Architecture",
  "Role-Based Access",
  "AI-Powered Automation",
  "Secure Data Storage",
  "Mobile Workforce",
  "Continuous Product Updates",
  "Dedicated Customer Support"
]



export default function RoofingPage() {

  return (

    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50"/>

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-orange-600">

                <Sparkles className="h-4 w-4"/>

                Roofing CRM Software

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Built For

                <span className="block text-orange-500">

                  Modern Roofing Companies

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Manage roofing inspections,
                estimates, insurance claims,
                crews, scheduling, materials,
                customer communication and
                invoicing from one powerful
                cloud platform.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5"/>

                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold transition hover:bg-slate-50"
                >

                  Book Demo

                </Link>

              </div>

            </div>

            {/* Dashboard Preview */}

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Roofing Dashboard

                  </h3>

                  <BarChart3 className="h-8 w-8 text-orange-400"/>

                </div>

                <div className="mt-10 space-y-5">

                  <MetricRow
                    title="Active Projects"
                    value="86"
                  />

                  <MetricRow
                    title="Pending Estimates"
                    value="24"
                  />

                  <MetricRow
                    title="Insurance Claims"
                    value="18"
                  />

                  <MetricRow
                    title="Monthly Revenue"
                    value="$148K"
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

            {stats.map((item)=>(

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
      {/* WHY ROOFERS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-500">

              Why Roofing Companies Choose KoniqTech

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything Your Roofing Business
              Needs In One Platform

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Replace disconnected spreadsheets,
              generic CRMs and manual processes
              with software designed specifically
              for roofing contractors.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {benefits.map((item)=>{

              const Icon = item.icon

              return(

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="rounded-2xl bg-orange-100 p-4 w-fit">

                    <Icon className="h-8 w-8 text-orange-500"/>

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
{/* ROOFING WORKFLOW */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Roofing Workflow

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Manage Every Roofing Project
        <br />

        From First Call To Final Payment

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        KoniqTech provides a structured workflow
        that keeps your sales team, office staff,
        project managers and field crews working
        together efficiently.

      </p>

    </div>

    <div className="mt-24 space-y-8">

      {workflowSteps.map((step,index)=>(

        <WorkflowCard
          key={step.step}
          {...step}
          last={index===workflowSteps.length-1}
        />

      ))}

    </div>

  </div>

</section>

      {/* ====================================================== */}
{/* WORKFLOW BENEFITS */}
{/* ====================================================== */}

    <section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Complete Process

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          One Connected
          <br />

          Roofing Platform

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Every stage of your roofing business
          shares the same customer information,
          project history and financial records,
          eliminating duplicate work.

        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        {workflowBenefits.map((item)=>(

          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-slate-800 p-5"
          >

            <CheckCircle2 className="h-5 w-5 text-green-400"/>

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
{/* ROOFING FEATURES */}
{/* ====================================================== */}

    <section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Roofing Features

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Everything Required
        <br/>

        To Run A Roofing Company

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        From roof inspections to customer payments,
        every workflow is connected inside one platform.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {roofingFeatures.map((feature)=>{

        const Icon = feature.icon

        return(

          <FeatureCard
            key={feature.title}
            icon={<Icon className="h-8 w-8 text-orange-500"/>}
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
{/* PROJECT MANAGEMENT */}
{/* ====================================================== */}

     <section className="bg-slate-50 py-28">

<div className="mx-auto max-w-7xl px-6">

<div className="grid items-center gap-20 lg:grid-cols-2">

<div>

<p className="font-semibold uppercase tracking-widest text-orange-500">

Project Management

</p>

<h2 className="mt-4 text-5xl font-black">

Keep Every Roofing
<br/>

Project Organized

</h2>

<p className="mt-8 text-xl leading-9 text-slate-600">

Manage crews, suppliers,
equipment, inspections,
change orders and customer
communication from one dashboard.

</p>

<div className="mt-10 space-y-5">

{projectManagement.map((item)=>{

const Icon=item.icon

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

Roofing Operations

</h3>

<div className="mt-10 space-y-5">

<OperationRow
title="Open Projects"
value="84"
/>

<OperationRow
title="Crews Working"
value="18"
/>

<OperationRow
title="Materials Ordered"
value="132"
/>

<OperationRow
title="Invoices Pending"
value="14"
/>

<OperationRow
title="Completed Jobs"
value="246"
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

Roofing Companies

</h2>

<p className="mt-8 text-xl leading-9 text-slate-300">

Reduce manual work by using AI
to generate estimates,
automate customer communication,
optimize scheduling and
improve operational efficiency.

</p>

<div className="mt-12 grid gap-6">

{aiFeatures.map((feature)=>{

const Icon=feature.icon

return(

<div
key={feature.title}
className="rounded-3xl bg-slate-800 p-6"
>

<div className="flex items-start gap-5">

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
title="Generate Estimate"
icon={Brain}
/>

<AutomationRow
title="Schedule Crew"
icon={Calendar}
/>

<AutomationRow
title="Send Customer Update"
icon={MessageSquare}
/>

<AutomationRow
title="Voice Assistant"
icon={Mic}
/>

<AutomationRow
title="Project Notifications"
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

Technician Mobile App

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

Field Mobility

</p>

<h2 className="mt-4 text-5xl font-black">

Everything Your Crew
<br/>

Needs On Site

</h2>

<p className="mt-8 text-xl leading-9 text-slate-600">

Roofers can access customer details,
navigate to job sites,
capture inspection photos,
record materials,
collect signatures and
accept payments directly from the field.

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
Business Tools

</h2>

<p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

KoniqTech integrates with popular
business applications so your team
can work from one connected platform.

</p>

</div>

<div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

{integrations.map((integration)=>(

<div
key={integration}
className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
>

<Plug className="mx-auto h-10 w-10 text-orange-500"/>

<h3 className="mt-5 text-xl font-bold">

{integration}

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

        Roofing CRM Questions

      </h2>

    </div>

    <div className="mt-20 space-y-6">

      {roofingFaq.map((faq)=>(

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
{/* WHY CONTRACTORS TRUST KONIQTECH */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          Built For Roofing Businesses

        </p>

        <h2 className="mt-4 text-5xl font-black">

          A Platform Designed
          <br/>

          For Long-Term Growth

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          KoniqTech combines CRM, project management,
          AI automation, scheduling and customer
          communication into one connected platform
          built specifically for field service companies.

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

          <p className="font-semibold uppercase tracking-widest text-orange-400">

            Simple Pricing

          </p>

          <h2 className="mt-4 text-5xl font-black text-white">

            Start Growing
            <br/>

            Your Roofing Business

          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Choose the plan that matches your
            business today and upgrade whenever
            your company grows.

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

      Ready To Transform
      <br/>

      Your Roofing Business?

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-orange-100">

      Manage leads, inspections, crews,
      estimates, insurance claims,
      scheduling, invoicing and customer
      communication from one modern platform.

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

      <span>✓ Mobile Workforce</span>

      <span>✓ Secure Cloud Platform</span>

      <span>✓ Built For Roofing Companies</span>

    </div>

  </div>

    </section>



    </main>

  )

}

function StatCard({
  value,
  label
}:{
  value:string
  label:string
}){

  return(

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

function MetricRow({
  title,
  value
}:{
  title:string
  value:string
}){

  return(

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
}:{
  step:string
  title:string
  description:string
  last:boolean
}){

  return(

    <div className="relative flex gap-8">

      <div className="flex flex-col items-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-xl font-black text-white">

          {step}

        </div>

        {!last && (

          <div className="mt-2 h-full w-1 rounded-full bg-orange-200"/>

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

<span>

{item}

</span>

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
icon:Icon
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