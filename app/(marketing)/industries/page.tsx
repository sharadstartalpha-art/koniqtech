import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  Home,
  Thermometer,
  Droplets,
  Trees,
  
  ShieldCheck,
  Brain,
  Truck,
  BarChart3,
  
  Bot,
  Smartphone,
  Workflow,
  Plug,
  Calendar,
  CreditCard,
  Mail,
  MessageSquare,
  Cloud,
  Cpu,
  CheckCircle2
} from "lucide-react"

export const metadata = {
  title: "Industry Solutions | KoniqTech",
  description:
    "Purpose-built CRM software for Roofing, HVAC, Plumbing and Landscaping businesses with scheduling, dispatch, AI automation and customer management."
}

const industries = [
  {
    icon: Home,
    title: "Roofing CRM",
    href: "/industries/roofing",
    description:
      "Manage inspections, estimates, insurance claims, crews and roofing projects.",
    features: [
      "Roof Measurements",
      "Insurance Workflow",
      "Material Tracking",
      "Crew Scheduling"
    ]
  },
  {
    icon: Thermometer,
    title: "HVAC CRM",
    href: "/industries/hvac",
    description:
      "Run installation, maintenance and repair operations from one platform.",
    features: [
      "Equipment Tracking",
      "Maintenance Plans",
      "Service Agreements",
      "Dispatch"
    ]
  },
  {
    icon: Droplets,
    title: "Plumbing CRM",
    href: "/industries/plumbing",
    description:
      "Handle emergency service calls, technicians, estimates and invoicing.",
    features: [
      "Emergency Dispatch",
      "Parts Tracking",
      "Job History",
      "Digital Signatures"
    ]
  },
  {
    icon: Trees,
    title: "Landscaping CRM",
    href: "/industries/landscaping",
    description:
      "Manage recurring maintenance, crews, equipment and seasonal schedules.",
    features: [
      "Recurring Services",
      "Route Planning",
      "Crew Management",
      "Property Tracking"
    ]
  }
]

const stats = [
  {
    value: "4",
    label: "Industry Solutions"
  },
  {
    value: "100+",
    label: "Business Features"
  },
  {
    value: "AI",
    label: "Automation Platform"
  },
  {
    value: "24×7",
    label: "Cloud Access"
  }
]


const industrySections = [
  {
    icon: Home,
    title: "Roofing CRM",
    href: "/industries/roofing",
    subtitle: "Complete Roofing Business Management",
    description:
      "From inspections to insurance claims and final invoicing, KoniqTech streamlines every stage of your roofing projects.",
    imageLabel: "Roofing Dashboard",
    features: [
      "Roof Measurements",
      "Insurance Claims",
      "Material Estimation",
      "Crew Scheduling",
      "Project Timeline",
      "Progress Photos",
      "Digital Contracts",
      "Customer Portal"
    ]
  },
  {
    icon: Thermometer,
    title: "HVAC CRM",
    href: "/industries/hvac",
    subtitle: "HVAC Installation & Service Platform",
    description:
      "Manage service agreements, preventive maintenance, installations and emergency repairs from one platform.",
    imageLabel: "HVAC Dashboard",
    features: [
      "Equipment Tracking",
      "Maintenance Plans",
      "Warranty Management",
      "Recurring Service",
      "Technician Dispatch",
      "Parts Inventory",
      "Customer History",
      "Invoices"
    ]
  },
  {
    icon: Droplets,
    title: "Plumbing CRM",
    href: "/industries/plumbing",
    subtitle: "Modern Plumbing Operations",
    description:
      "Handle emergency service calls, technician dispatching, estimates and customer communication efficiently.",
    imageLabel: "Plumbing Dashboard",
    features: [
      "Emergency Dispatch",
      "Parts Tracking",
      "Job Scheduling",
      "Photo Documentation",
      "Digital Signatures",
      "Payments",
      "Customer Notifications",
      "Technician GPS"
    ]
  },
  {
    icon: Trees,
    title: "Landscaping CRM",
    href: "/industries/landscaping",
    subtitle: "Landscaping & Lawn Care Management",
    description:
      "Manage recurring maintenance, seasonal services, crews and equipment across multiple properties.",
    imageLabel: "Landscaping Dashboard",
    features: [
      "Recurring Visits",
      "Seasonal Scheduling",
      "Route Optimization",
      "Crew Assignment",
      "Property Records",
      "Equipment Tracking",
      "Mobile App",
      "Customer Portal"
    ]
  }
]



const sharedFeatures = [
  {
    icon: Workflow,
    title: "Business Operations",
    description:
      "Everything required to run daily field service operations.",
    features: [
      "Lead Management",
      "Customers",
      "Scheduling",
      "Dispatch",
      "Job Management",
      "Invoices"
    ]
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "AI built into every stage of your workflow.",
    features: [
      "AI Assistant",
      "AI Quotes",
      "Voice AI",
      "Predictive Analytics",
      "Business Insights",
      "Automation"
    ]
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "Connect your favorite business tools.",
    features: [
      "Google Calendar",
      "PayPal",
      "Stripe",
      "Resend",
      "Twilio",
      "OpenAI"
    ]
  },
  {
    icon: Smartphone,
    title: "Field Mobility",
    description:
      "Keep technicians productive from anywhere.",
    features: [
      "Mobile App",
      "GPS",
      "Offline Mode",
      "Photo Uploads",
      "Digital Signature",
      "Payments"
    ]
  }
]

const aiCapabilities = [
  "Business Assistant",
  "AI Quote Generator",
  "Voice Receptionist",
  "Customer Messaging",
  "Predictive Scheduling",
  "Revenue Forecasting",
  "Knowledge Search",
  "Workflow Automation"
]

const integrationLogos = [
  "Google Calendar",
  "PayPal",
  "Stripe",
  "OpenAI",
  "Resend",
  "Twilio",
  "Cloudflare R2",
  "AWS S3"
]

const mobileCapabilities = [
  "Today's Jobs",
  "GPS Navigation",
  "Technician Tracking",
  "Offline Access",
  "Photo & Video Capture",
  "Customer Signatures",
  "Invoice Generation",
  "Payment Collection"
]


const comparisonData = [
  {
    feature: "Lead Management",
    roofing: true,
    hvac: true,
    plumbing: true,
    landscaping: true
  },
  {
    feature: "Dispatch",
    roofing: true,
    hvac: true,
    plumbing: true,
    landscaping: true
  },
  {
    feature: "Recurring Services",
    roofing: false,
    hvac: true,
    plumbing: false,
    landscaping: true
  },
  {
    feature: "Insurance Workflow",
    roofing: true,
    hvac: false,
    plumbing: false,
    landscaping: false
  },
  {
    feature: "Equipment Tracking",
    roofing: false,
    hvac: true,
    plumbing:true,
    landscaping:true
  },
  {
    feature: "Route Optimization",
    roofing:true,
    hvac:true,
    plumbing:true,
    landscaping:true
  },
  {
    feature:"Customer Portal",
    roofing:true,
    hvac:true,
    plumbing:true,
    landscaping:true
  },
  {
    feature:"AI Assistant",
    roofing:true,
    hvac:true,
    plumbing:true,
    landscaping:true
  }
]

const successMetrics = [
  {
    value:"40%",
    label:"Less Administrative Work"
  },
  {
    value:"3×",
    label:"Faster Scheduling"
  },
  {
    value:"96%",
    label:"Average Job Completion"
  },
  {
    value:"24/7",
    label:"Business Visibility"
  }
]

const industryFaq = [
  {
    question:"Can I switch industries later?",
    answer:
      "Yes. KoniqTech uses one core platform with industry-specific workflows, making it easier to expand into additional service categories."
  },
  {
    question:"Can one company manage multiple services?",
    answer:
      "Yes. Businesses offering roofing, HVAC, plumbing or landscaping can manage all services from the same organization."
  },
  {
    question:"Does every industry include AI features?",
    answer:
      "Yes. AI capabilities such as automation, business insights and AI-assisted workflows are available across all industry solutions."
  },
  {
    question:"Is the mobile app available for every industry?",
    answer:
      "Yes. Field technicians can access schedules, customer information, navigation and job updates from supported mobile devices."
  }
]



const relatedResources = [
  {
    title: "Features",
    description:
      "Explore CRM, AI, scheduling, dispatch and automation capabilities.",
    href: "/features"
  },
  {
    title: "Pricing",
    description:
      "Compare plans and choose the right subscription for your business.",
    href: "/pricing"
  },
  {
    title: "AI Platform",
    description:
      "Discover how artificial intelligence helps automate your business.",
    href: "/ai"
  },
  {
    title: "Book Demo",
    description:
      "Schedule a personalized walkthrough with our team.",
    href: "/demo"
  }
]

const contactHighlights = [
  "Industry-Specific Demo",
  "Implementation Guidance",
  "Migration Planning",
  "AI Workflow Consultation",
  "Pricing Consultation",
  "Technical Questions"
]




export default function IndustriesPage() {

  return (

    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-4xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-orange-600">

              <Sparkles className="h-4 w-4" />

              Industry Solutions

            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

              Built Specifically

              <span className="block text-orange-500">

                For Service Businesses

              </span>

            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Every industry works differently.
              KoniqTech provides specialized workflows,
              AI automation, scheduling and reporting
              designed for your business.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-6">

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

          {/* Stats */}

          <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

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
      {/* INDUSTRY CARDS */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-2">

            {industries.map((industry)=>(

              <IndustryCard
                key={industry.title}
                {...industry}
              />

            ))}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* WHY INDUSTRY CRM */}
      {/* ====================================================== */}

      <section className="bg-slate-900 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-400">

              Why KoniqTech?

            </p>

            <h2 className="mt-4 text-5xl font-black text-white">

              Generic CRM
              <br />

              Isn't Enough

            </h2>

          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-2">

            <div className="rounded-[36px] bg-slate-800 p-10">

              <h3 className="text-3xl font-bold text-red-300">

                Generic CRM

              </h3>

              <div className="mt-8 space-y-5">

                {[
                  "No Dispatch System",
                  "No Technician Mobile App",
                  "No Industry Workflows",
                  "Limited Scheduling",
                  "No AI Automation",
                  "No Inventory Tracking"
                ].map((item)=>(

                  <div
                    key={item}
                    className="flex items-center gap-3 text-slate-300"
                  >

                    <span className="text-red-400 text-xl">

                      ✕

                    </span>

                    {item}

                  </div>

                ))}

              </div>

            </div>

            <div className="rounded-[36px] bg-orange-500 p-10 text-white">

              <h3 className="text-3xl font-bold">

                KoniqTech

              </h3>

              <div className="mt-8 space-y-5">

                {[
                  "Built For Contractors",
                  "Industry Workflows",
                  "Dispatch & Scheduling",
                  "AI Automation",
                  "Inventory & Fleet",
                  "Customer Portal"
                ].map((item)=>(

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <CheckCircle2 className="h-5 w-5"/>

                    {item}

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
{/* INDUSTRY OVERVIEW */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    {industrySections.map((industry,index)=>{

      const Icon = industry.icon

      return(

        <div
          key={industry.title}
          className={`
          grid
          items-center
          gap-20
          py-20
          lg:grid-cols-2
          ${
            index % 2 === 1
              ? "lg:[&>*:first-child]:order-2"
              : ""
          }
          `}
        >

          {/* Content */}

          <div>

            <div className="inline-flex items-center gap-3 rounded-full bg-orange-100 px-5 py-2 text-orange-600">

              <Icon className="h-5 w-5"/>

              {industry.title}

            </div>

            <h2 className="mt-8 text-5xl font-black text-slate-900">

              {industry.subtitle}

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              {industry.description}

            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">

              {industry.features.map((feature)=>(

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600"/>

                  <span>{feature}</span>

                </div>

              ))}

            </div>

            <Link
              href={industry.href}
              className="mt-12 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
            >

              Explore {industry.title}

              <ArrowRight className="h-5 w-5"/>

            </Link>

          </div>

          {/* Dashboard Preview */}

          <div className="rounded-[40px] border bg-slate-50 p-8 shadow-xl">

            <div className="rounded-3xl bg-slate-900 p-8 text-white">

              <div className="flex items-center justify-between">

                <h3 className="text-2xl font-bold">

                  {industry.imageLabel}

                </h3>

                <Sparkles className="h-6 w-6 text-orange-400"/>

              </div>

              <div className="mt-10 space-y-5">

                <DashboardMetric
                  title="Jobs Scheduled"
                  value="148"
                />

                <DashboardMetric
                  title="Completion Rate"
                  value="96%"
                />

                <DashboardMetric
                  title="Customer Rating"
                  value="4.9★"
                />

                <DashboardMetric
                  title="Revenue This Month"
                  value="$84K"
                />

              </div>

            </div>

          </div>

        </div>

      )

    })}

  </div>

</section>


{/* ====================================================== */}
{/* INDUSTRY CTA */}
{/* ====================================================== */}

<section className="bg-orange-500 py-24">

  <div className="mx-auto max-w-5xl px-6 text-center text-white">

    <h2 className="text-5xl font-black">

      Every Industry Has Different Challenges

    </h2>

    <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

      That's why KoniqTech includes specialized workflows,
      AI automation, reporting and scheduling designed
      specifically for your trade—not generic business software.

    </p>

  </div>

</section>




{/* ====================================================== */}
{/* SHARED PLATFORM */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        One Powerful Platform

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Shared Features
        <br />

        Across Every Industry

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Every KoniqTech solution includes the same
        enterprise-grade platform while adding
        specialized workflows for your trade.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-2">

      {sharedFeatures.map((item)=>{

        const Icon=item.icon

        return(

          <div
            key={item.title}
            className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-100 p-4">

                <Icon className="h-8 w-8 text-orange-500"/>

              </div>

              <h3 className="text-3xl font-bold">

                {item.title}

              </h3>

            </div>

            <p className="mt-6 leading-8 text-slate-600">

              {item.description}

            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {item.features.map((feature)=>(

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600"/>

                  {feature}

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>




{/* ====================================================== */}
{/* AI PLATFORM */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Artificial Intelligence

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          AI Built Into
          <br />

          Every Industry

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          AI helps your office staff, technicians
          and managers complete more work with
          less manual effort.

        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">

          {aiCapabilities.map((item)=>(

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-400"/>

              <span className="text-slate-200">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[40px] bg-slate-800 p-10">

        <div className="space-y-5">

          <AiFeatureCard
            icon={Bot}
            title="AI Assistant"
          />

          <AiFeatureCard
            icon={Cpu}
            title="Business Insights"
          />

          <AiFeatureCard
            icon={Workflow}
            title="Workflow Automation"
          />

          <AiFeatureCard
            icon={Brain}
            title="Predictive Intelligence"
          />

        </div>

      </div>

    </div>

  </div>

</section>



{/* ====================================================== */}
{/* INTEGRATIONS */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Integrations

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Connect Your
        Favorite Tools

      </h2>

    </div>

    <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {integrationLogos.map((item)=>(

        <div
          key={item}
          className="rounded-3xl border bg-slate-50 p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
        >

          <Plug className="mx-auto h-10 w-10 text-orange-500"/>

          <h3 className="mt-6 text-xl font-bold">

            {item}

          </h3>

        </div>

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* MOBILE */}
{/* ====================================================== */}

<section className="bg-gradient-to-r from-orange-500 to-orange-600 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div className="text-white">

        <p className="font-semibold uppercase tracking-widest text-orange-100">

          Mobile Platform

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Field Teams
          Stay Connected

        </h2>

        <p className="mt-8 text-xl leading-9 text-orange-100">

          Whether technicians are on a roof,
          repairing HVAC equipment or working
          at a customer's property, everything
          stays synchronized.

        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          {mobileCapabilities.map((item)=>(

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5"/>

              {item}

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[40px] bg-white p-8 shadow-2xl">

        <div className="rounded-3xl bg-slate-900 p-8 text-white">

          <Smartphone className="h-12 w-12 text-orange-400"/>

          <h3 className="mt-6 text-3xl font-bold">

            Technician Mobile App

          </h3>

          <div className="mt-8 space-y-4">

            <MobileRow title="Today's Schedule" />

            <MobileRow title="Customer Details" />

            <MobileRow title="GPS Navigation" />

            <MobileRow title="Upload Photos" />

            <MobileRow title="Collect Payments" />

            <MobileRow title="Offline Mode" />

          </div>

        </div>

      </div>

    </div>

  </div>

</section>



{/* ====================================================== */}
{/* INDUSTRY COMPARISON */}
{/* ====================================================== */}

<section className="bg-white py-28">

<div className="mx-auto max-w-7xl px-6">

<div className="text-center">

<p className="font-semibold uppercase tracking-widest text-orange-500">

Compare Industries

</p>

<h2 className="mt-4 text-5xl font-black">

Choose The Solution
<br/>

That Fits Your Business

</h2>

</div>

<div className="mt-20 overflow-x-auto rounded-[36px] border shadow-sm">

<table className="min-w-full bg-white">

<thead className="bg-slate-900 text-white">

<tr>

<th className="px-8 py-5 text-left">

Feature

</th>

<th className="px-6 py-5">

Roofing

</th>

<th className="px-6 py-5">

HVAC

</th>

<th className="px-6 py-5">

Plumbing

</th>

<th className="px-6 py-5">

Landscaping

</th>

</tr>

</thead>

<tbody>

{comparisonData.map((row)=>(

<tr
key={row.feature}
className="border-t"
>

<td className="px-8 py-5 font-semibold">

{row.feature}

</td>

<CompareCell value={row.roofing}/>

<CompareCell value={row.hvac}/>

<CompareCell value={row.plumbing}/>

<CompareCell value={row.landscaping}/>

</tr>

))}

</tbody>

</table>

</div>

</div>

</section>


{/* ====================================================== */}
{/* RESULTS */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

<div className="mx-auto max-w-7xl px-6">

<div className="text-center">

<p className="font-semibold uppercase tracking-widest text-orange-500">

Business Results

</p>

<h2 className="mt-4 text-5xl font-black">

Designed To Improve
<br/>

Daily Operations

</h2>

</div>

<div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

{successMetrics.map((metric)=>(

<ResultCard
key={metric.label}
value={metric.value}
label={metric.label}
/>

))}

</div>

</div>

</section>


{/* ====================================================== */}
{/* FAQ */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

<div className="mx-auto max-w-5xl px-6">

<div className="text-center">

<p className="font-semibold uppercase tracking-widest text-orange-400">

Frequently Asked Questions

</p>

<h2 className="mt-4 text-5xl font-black text-white">

Industry Questions

</h2>

</div>

<div className="mt-20 space-y-6">

{industryFaq.map((faq)=>(

<div
key={faq.question}
className="rounded-3xl bg-slate-800 p-8"
>

<h3 className="text-2xl font-bold text-white">

{faq.question}

</h3>

<p className="mt-5 leading-8 text-slate-300">

{faq.answer}

</p>

</div>

))}

</div>

</div>

</section>


{/* ====================================================== */}
{/* CONTACT SALES */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-16 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          Talk To Our Team

        </p>

        <h2 className="mt-4 text-5xl font-black text-slate-900">

          Need Help Choosing
          <br />

          The Right Industry Solution?

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          We'll help you determine which
          KoniqTech solution best matches your
          business processes and future growth.

        </p>

        <div className="mt-10 space-y-4">

          {contactHighlights.map((item)=>(

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2
                className="h-5 w-5 text-green-600"
              />

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[36px] bg-white p-10 shadow-xl">

        <h3 className="text-3xl font-bold">

          Start Today

        </h3>

        <p className="mt-5 leading-8 text-slate-600">

          Whether you're a roofing contractor,
          HVAC company, plumbing business or
          landscaping service, our team can help
          you get started quickly.

        </p>

        <div className="mt-10 space-y-4">

          <Link
            href="/demo"
            className="
            flex
            h-14
            items-center
            justify-center
            rounded-2xl
            bg-orange-500
            font-semibold
            text-white
            transition
            hover:bg-orange-600
            "
          >

            Schedule Demo

          </Link>

          <Link
            href="/contact"
            className="
            flex
            h-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-600
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            "
          >

            Contact Sales

          </Link>

          <Link
            href="/register"
            className="
            flex
            h-14
            items-center
            justify-center
            rounded-2xl
            bg-green-600
            font-semibold
            text-white
            transition
            hover:bg-green-700
            "
          >

            Start Free Trial

          </Link>

        </div>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* RELATED RESOURCES */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Learn More

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Explore More
        <br />

        About KoniqTech

      </h2>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      {relatedResources.map((resource)=>(

        <Link
          key={resource.title}
          href={resource.href}
          className="
          rounded-[32px]
          border
          bg-slate-50
          p-8
          shadow-sm
          transition
          hover:-translate-y-2
          hover:shadow-xl
          "
        >

          <h3 className="text-2xl font-bold text-slate-900">

            {resource.title}

          </h3>

          <p className="mt-5 leading-8 text-slate-600">

            {resource.description}

          </p>

          <div className="mt-8 inline-flex items-center gap-2 font-semibold text-orange-600">

            Explore

            <ArrowRight className="h-5 w-5"/>

          </div>

        </Link>

      ))}

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

      Build A Better
      <br />

      Service Business

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-orange-100">

      KoniqTech brings together CRM,
      scheduling, dispatch, AI,
      invoicing and customer management
      in one modern cloud platform built
      specifically for field service businesses.

    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-6">

      <Link
        href="/register"
        className="
        inline-flex
        items-center
        gap-2
        rounded-2xl
        bg-white
        px-8
        py-4
        font-semibold
        text-orange-600
        transition
        hover:bg-orange-100
        "
      >

        Start Free Trial

        <ArrowRight className="h-5 w-5"/>

      </Link>

      <Link
        href="/demo"
        className="
        rounded-2xl
        border
        border-white/40
        px-8
        py-4
        font-semibold
        text-white
        transition
        hover:bg-white/10
        "
      >

        Book Demo

      </Link>

    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-8 text-orange-100">

      <span>✓ Free Trial</span>

      <span>✓ Cloud Platform</span>

      <span>✓ AI Powered</span>

      <span>✓ Built For Contractors</span>

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

    <div className="rounded-[30px] border bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-black text-orange-500">

        {value}

      </div>

      <p className="mt-4 text-lg font-semibold text-slate-700">

        {label}

      </p>

    </div>

  )

}

function IndustryCard({
  icon:Icon,
  title,
  description,
  features,
  href
}:any){

  return(

    <div className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center gap-5">

        <div className="rounded-2xl bg-orange-100 p-4">

          <Icon className="h-8 w-8 text-orange-500"/>

        </div>

        <h3 className="text-3xl font-bold text-slate-900">

          {title}

        </h3>

      </div>

      <p className="mt-6 leading-8 text-slate-600">

        {description}

      </p>

      <div className="mt-8 space-y-3">

        {features.map((feature:string)=>(

          <div
            key={feature}
            className="flex items-center gap-3"
          >

            <CheckCircle2 className="h-5 w-5 text-green-600"/>

            <span>{feature}</span>

          </div>

        ))}

      </div>

      <Link
        href={href}
        className="mt-10 inline-flex items-center gap-2 font-semibold text-orange-600 transition hover:text-orange-700"
      >

        Learn More

        <ArrowRight className="h-5 w-5"/>

      </Link>

    </div>

  )

}

function DashboardMetric({
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


function AiFeatureCard({
  icon: Icon,
  title
}:{
  icon:any
  title:string
}){

  return(

    <div className="flex items-center gap-5 rounded-3xl bg-slate-700 p-6">

      <div className="rounded-2xl bg-orange-500 p-4">

        <Icon className="h-7 w-7 text-white"/>

      </div>

      <h3 className="text-xl font-bold text-white">

        {title}

      </h3>

    </div>

  )

}

function MobileRow({
  title
}:{
  title:string
}){

  return(

    <div className="flex items-center gap-3 rounded-2xl bg-slate-800 p-4">

      <CheckCircle2 className="h-5 w-5 text-green-400"/>

      <span className="text-slate-200">

        {title}

      </span>

    </div>

  )

}


function CompareCell({
value
}:{
value:boolean
}){

return(

<td className="text-center">

{value ? (

<CheckCircle2
className="mx-auto h-6 w-6 text-green-600"
/>

):(

<span className="text-slate-300 text-2xl">

—

</span>

)}

</td>

)

}

function ResultCard({
value,
label
}:{
value:string
label:string
}){

return(

<div className="rounded-[32px] bg-white p-10 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg">

<div className="text-5xl font-black text-orange-500">

{value}

</div>

<p className="mt-5 text-lg font-semibold text-slate-700">

{label}

</p>

</div>

)

}