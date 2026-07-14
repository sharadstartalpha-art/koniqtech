import type { Metadata } from "next"
import Link from "next/link"

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Globe,
  Server,
  ShieldCheck,
  Sparkles
} from "lucide-react"

export const metadata: Metadata = {
  title: "System Status | KoniqTech",
  description:
    "View the live operational status of KoniqTech services including API uptime, AI platform, infrastructure, authentication, payments and integrations."
}

const stats = [
  {
    value: "99.99%",
    label: "Platform Uptime",
    color: "text-green-600"
  },
  {
    value: "32ms",
    label: "Average API Response",
    color: "text-blue-600"
  },
  {
    value: "24/7",
    label: "Monitoring",
    color: "text-orange-600"
  },
  {
    value: "0",
    label: "Critical Incidents",
    color: "text-green-600"
  }
]

const services = [
  {
    icon: Globe,
    title: "Website",
    status: "Operational",
    color: "bg-green-500"
  },
  {
    icon: Server,
    title: "API Services",
    status: "Operational",
    color: "bg-green-500"
  },
  {
    icon: Database,
    title: "Database",
    status: "Operational",
    color: "bg-green-500"
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    status: "Operational",
    color: "bg-green-500"
  },
  {
    icon: Sparkles,
    title: "AI Platform",
    status: "Operational",
    color: "bg-green-500"
  },
  {
    icon: Activity,
    title: "Monitoring",
    status: "Operational",
    color: "bg-green-500"
  }
]

const incidents = [
  {
    date: "Today",
    title: "All Services Operational",
    description:
      "No incidents have been reported across the KoniqTech platform.",
    color: "bg-green-500"
  },
  {
    date: "7 Days",
    title: "Zero Critical Incidents",
    description:
      "No service interruptions affecting customers.",
    color: "bg-blue-500"
  },
  {
    date: "30 Days",
    title: "99.99% Availability",
    description:
      "Infrastructure maintained excellent uptime across all regions.",
    color: "bg-green-500"
  }
]

const maintenance = [
  {
    service: "Platform Updates",
    schedule: "First Sunday of every month",
    duration: "30 Minutes",
    impact: "Minimal"
  },
  {
    service: "Database Optimization",
    schedule: "Monthly",
    duration: "20 Minutes",
    impact: "None"
  },
  {
    service: "Security Updates",
    schedule: "As Required",
    duration: "Rolling Deployment",
    impact: "No Downtime"
  },
  {
    service: "AI Model Improvements",
    schedule: "Weekly",
    duration: "Background",
    impact: "None"
  }
]


const infrastructure = [
  {
    title: "Application Servers",
    status: "Healthy",
    uptime: "99.99%",
    color: "green"
  },
  {
    title: "Database Cluster",
    status: "Healthy",
    uptime: "99.99%",
    color: "green"
  },
  {
    title: "Cloud Storage",
    status: "Healthy",
    uptime: "100%",
    color: "green"
  },
  {
    title: "Background Workers",
    status: "Healthy",
    uptime: "99.98%",
    color: "green"
  },
  {
    title: "CDN Network",
    status: "Healthy",
    uptime: "100%",
    color: "green"
  },
  {
    title: "Authentication",
    status: "Healthy",
    uptime: "99.99%",
    color: "green"
  }
]

const apiHealth = [
  {
    endpoint: "Authentication API",
    latency: "22 ms",
    status: "Operational"
  },
  {
    endpoint: "CRM API",
    latency: "27 ms",
    status: "Operational"
  },
  {
    endpoint: "AI Platform",
    latency: "39 ms",
    status: "Operational"
  },
  {
    endpoint: "Billing API",
    latency: "31 ms",
    status: "Operational"
  },
  {
    endpoint: "Notifications",
    latency: "25 ms",
    status: "Operational"
  },
  {
    endpoint: "File Storage",
    latency: "29 ms",
    status: "Operational"
  }
]

const aiServices = [
  {
    title: "AI Quote Generator",
    status: "Online"
  },
  {
    title: "AI Dispatch",
    status: "Online"
  },
  {
    title: "Voice AI",
    status: "Online"
  },
  {
    title: "AI Email Writer",
    status: "Online"
  },
  {
    title: "Sales AI",
    status: "Online"
  },
  {
    title: "Reporting AI",
    status: "Online"
  }
]

const regions = [
  {
    region: "North America",
    response: "28 ms"
  },
  {
    region: "Europe",
    response: "34 ms"
  },
  {
    region: "Asia Pacific",
    response: "42 ms"
  },
  {
    region: "Global Average",
    response: "32 ms"
  }
]

const faqs = [
  {
    question: "How often is the status page updated?",
    answer:
      "Our monitoring platform checks services continuously. Status updates are reflected automatically whenever service conditions change."
  },
  {
    question: "How do I report an outage?",
    answer:
      "If you experience an issue not listed here, please contact our support team at info@koniqtech.com."
  },
  {
    question: "Does scheduled maintenance affect customers?",
    answer:
      "Most maintenance is performed using rolling deployments with little or no customer impact."
  },
  {
    question: "Are AI services monitored separately?",
    answer:
      "Yes. AI infrastructure, API performance and AI workers are monitored independently from the CRM platform."
  },
  {
    question: "Where can I receive maintenance notifications?",
    answer:
      "Customers receive advance email notifications for planned maintenance whenever customer action may be required."
  },
  {
    question: "What uptime does KoniqTech target?",
    answer:
      "We continuously work toward enterprise-grade availability with redundant infrastructure and proactive monitoring."
  }
]

const trustItems = [
  "24/7 Infrastructure Monitoring",
  "Automatic Incident Detection",
  "Enterprise Cloud Infrastructure",
  "Encrypted Platform Communication",
  "AI Service Health Monitoring",
  "Disaster Recovery Procedures"
]




export default function StatusPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2 text-green-700">

                <Activity className="h-4 w-4" />

                Live System Status

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Platform

                <span className="block text-green-600">

                  Status Dashboard

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Monitor the real-time health of the
                KoniqTech platform including APIs,
                AI services,
                authentication,
                infrastructure,
                billing
                and integrations.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/contact"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Contact Support

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Live Status

                  </h3>

                  <Activity className="h-8 w-8 text-green-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <StatusRow
                    title="API Services"
                    value="Operational"
                  />

                  <StatusRow
                    title="AI Platform"
                    value="Operational"
                  />

                  <StatusRow
                    title="Authentication"
                    value="Operational"
                  />

                  <StatusRow
                    title="Payments"
                    value="Operational"
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
                color={item.color}
              />

            ))}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* PLATFORM STATUS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Platform Overview

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Current Operational Status

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Every major KoniqTech service is monitored
              continuously to ensure reliable performance,
              security and availability.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => {

              const Icon = service.icon

              return (

                <div
                  key={service.title}
                  className="rounded-[32px] bg-white p-10 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div className="rounded-2xl bg-blue-100 p-4">

                      <Icon className="h-8 w-8 text-blue-600" />

                    </div>

                    <span
                      className={`h-4 w-4 rounded-full ${service.color}`}
                    />

                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-slate-900">

                    {service.title}

                  </h3>

                  <p className="mt-4 flex items-center gap-2 font-semibold text-green-600">

                    <CheckCircle2 className="h-5 w-5" />

                    {service.status}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>

           {/* ====================================================== */}
      {/* SERVICE HISTORY */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Service History

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Reliable Platform Performance

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              We continuously monitor every component of
              KoniqTech to maintain enterprise-grade reliability,
              availability and performance.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">

            <HistoryCard
              title="24 Hours"
              uptime="100%"
              description="All core services remained fully operational."
              color="text-green-600"
            />

            <HistoryCard
              title="7 Days"
              uptime="99.99%"
              description="Excellent stability across all infrastructure."
              color="text-blue-600"
            />

            <HistoryCard
              title="30 Days"
              uptime="99.99%"
              description="Enterprise-grade uptime maintained."
              color="text-orange-600"
            />

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* INCIDENT TIMELINE */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Incident Timeline

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Recent Platform Activity

            </h2>

          </div>

          <div className="mt-20 space-y-8">

            {incidents.map((item) => (

              <div
                key={item.title}
                className="rounded-[32px] border bg-white p-10 shadow-sm"
              >

                <div className="flex flex-col gap-6 md:flex-row md:items-center">

                  <div
                    className={`h-5 w-5 rounded-full ${item.color}`}
                  />

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center justify-between gap-4">

                      <h3 className="text-2xl font-bold text-slate-900">

                        {item.title}

                      </h3>

                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">

                        {item.date}

                      </span>

                    </div>

                    <p className="mt-5 leading-8 text-slate-600">

                      {item.description}

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* SCHEDULED MAINTENANCE */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Scheduled Maintenance

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Planned Improvements

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Maintenance is carefully planned during
              low-traffic periods to minimize customer impact.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {maintenance.map((item) => (

              <MaintenanceCard
                key={item.service}
                {...item}
              />

            ))}

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* INFRASTRUCTURE */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Infrastructure Monitoring

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Enterprise Infrastructure

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Every layer of the KoniqTech platform is monitored
              continuously to ensure maximum availability.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {infrastructure.map((item)=>(

              <InfrastructureCard
                key={item.title}
                {...item}
              />

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* API HEALTH */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              API Health

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Live API Performance

            </h2>

          </div>

          <div className="mt-20 rounded-[40px] border bg-white shadow-sm overflow-hidden">

            {apiHealth.map((item)=>(

              <ApiRow
                key={item.endpoint}
                {...item}
              />

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* AI SERVICES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              AI Platform

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              AI Services Status

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {aiServices.map((service)=>(

              <AIStatusCard
                key={service.title}
                {...service}
              />

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* RESPONSE TIMES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 via-green-600 to-orange-500 p-12 text-white">

            <h2 className="text-5xl font-black">

              Global Response Times

            </h2>

            <p className="mt-8 text-xl leading-9 text-blue-100">

              Fast response times ensure a smooth CRM experience
              for customers around the world.

            </p>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              {regions.map((item)=>(

                <ResponseCard
                  key={item.region}
                  {...item}
                />

              ))}

            </div>

          </div>

        </div>

      </section>

             {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Status Page FAQ

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Everything you need to know about
              platform availability,
              monitoring,
              maintenance
              and service reliability.

            </p>

          </div>

          <div className="mt-20 space-y-8">

            {faqs.map((faq) => (

              <FaqCard
                key={faq.question}
                {...faq}
              />

            ))}

          </div>

        </div>

      </section>



            {/* ====================================================== */}
      {/* TRUST */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-50 via-white to-green-50 p-12">

            <div className="text-center">

              <ShieldCheck className="mx-auto h-16 w-16 text-green-600" />

              <h2 className="mt-8 text-5xl font-black text-slate-900">

                Built For Enterprise Reliability

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

                KoniqTech combines modern cloud infrastructure,
                AI monitoring
                and proactive security
                to keep your business running smoothly.

              </p>

            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {trustItems.map((item) => (

                <TrustCard
                  key={item}
                  title={item}
                />

              ))}

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* SUPPORT CTA */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-white p-14 text-center shadow-xl">

            <Clock3 className="mx-auto h-16 w-16 text-orange-500" />

            <h2 className="mt-8 text-5xl font-black text-slate-900">

              Need Help?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              If you're experiencing issues or have questions
              about platform availability,
              our support team is ready to help.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/contact"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Contact Support

              </Link>

              <Link
                href="/demo"
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >

                Book Demo

              </Link>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 via-green-600 to-orange-500 px-10 py-24 text-center text-white shadow-xl">

            <Activity className="mx-auto h-16 w-16 text-white" />

            <h2 className="mt-8 text-5xl font-black">

              Build Your Business On
              Reliable Infrastructure

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

              Join roofing,
              HVAC,
              plumbing
              and landscaping companies using
              KoniqTech's secure,
              AI-powered field service platform.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
              >

                Start Free Trial

              </Link>

              <Link
                href="/pricing"
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >

                View Pricing

              </Link>

            </div>

          </div>

        </div>

      </section>


    </main>
  )
}

function StatCard({
  value,
  label,
  color
}: {
  value: string
  label: string
  color: string
}) {
  return (
    <div className="rounded-[32px] border bg-white p-8 text-center shadow-sm">

      <div className={`text-5xl font-black ${color}`}>

        {value}

      </div>

      <p className="mt-4 text-lg font-semibold text-slate-700">

        {label}

      </p>

    </div>
  )
}

function StatusRow({
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

      <span className="flex items-center gap-2 font-bold text-green-400">

        <CheckCircle2 className="h-5 w-5" />

        {value}

      </span>

    </div>
  )
}


function HistoryCard({
  title,
  uptime,
  description,
  color
}:{
  title:string
  uptime:string
  description:string
  color:string
}){
  return(

    <div className="rounded-[32px] border bg-white p-10 text-center shadow-sm">

      <Clock3 className="mx-auto h-12 w-12 text-blue-600"/>

      <h3 className="mt-8 text-2xl font-bold text-slate-900">

        {title}

      </h3>

      <div className={`mt-6 text-5xl font-black ${color}`}>

        {uptime}

      </div>

      <p className="mt-6 leading-8 text-slate-600">

        {description}

      </p>

    </div>

  )
}

function MaintenanceCard({
  service,
  schedule,
  duration,
  impact
}:{
  service:string
  schedule:string
  duration:string
  impact:string
}){
  return(

    <div className="rounded-[32px] border bg-white p-10 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-orange-100 p-4">

          <Clock3 className="h-8 w-8 text-orange-600"/>

        </div>

        <h3 className="text-2xl font-bold text-slate-900">

          {service}

        </h3>

      </div>

      <div className="mt-8 space-y-4">

        <InfoRow
          label="Schedule"
          value={schedule}
        />

        <InfoRow
          label="Duration"
          value={duration}
        />

        <InfoRow
          label="Customer Impact"
          value={impact}
        />

      </div>

    </div>

  )
}

function InfoRow({
  label,
  value
}:{
  label:string
  value:string
}){
  return(

    <div className="flex justify-between rounded-2xl bg-slate-50 px-5 py-4">

      <span className="font-medium text-slate-600">

        {label}

      </span>

      <span className="font-semibold text-slate-900">

        {value}

      </span>

    </div>

  )
}


function InfrastructureCard({
  title,
  status,
  uptime
}:{
  title:string
  status:string
  uptime:string
}){
  return(

    <div className="rounded-[32px] bg-white p-10 shadow-sm">

      <Server className="h-12 w-12 text-blue-600"/>

      <h3 className="mt-8 text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-5 font-semibold text-green-600">

        {status}

      </p>

      <p className="mt-3 text-slate-600">

        Uptime: {uptime}

      </p>

    </div>

  )
}

function ApiRow({
  endpoint,
  latency,
  status
}:{
  endpoint:string
  latency:string
  status:string
}){
  return(

    <div className="flex flex-col gap-4 border-b p-8 md:flex-row md:items-center md:justify-between">

      <div>

        <h3 className="text-xl font-bold text-slate-900">

          {endpoint}

        </h3>

      </div>

      <div className="flex items-center gap-10">

        <span className="font-semibold text-blue-600">

          {latency}

        </span>

        <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">

          {status}

        </span>

      </div>

    </div>

  )
}

function AIStatusCard({
  title,
  status
}:{
  title:string
  status:string
}){
  return(

    <div className="rounded-[32px] bg-white p-10 text-center shadow-sm">

      <Sparkles className="mx-auto h-12 w-12 text-orange-500"/>

      <h3 className="mt-8 text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-6 font-semibold text-green-600">

        {status}

      </p>

    </div>

  )
}

function ResponseCard({
  region,
  response
}:{
  region:string
  response:string
}){
  return(

    <div className="rounded-[32px] bg-white/10 p-8 text-center backdrop-blur">

      <Globe className="mx-auto h-10 w-10 text-white"/>

      <h3 className="mt-6 text-xl font-bold">

        {region}

      </h3>

      <div className="mt-6 text-5xl font-black">

        {response}

      </div>

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

    <div className="rounded-[32px] border bg-white p-10 shadow-sm">

      <h3 className="text-2xl font-bold text-slate-900">

        {question}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {answer}

      </p>

    </div>

  )
}

function TrustCard({
  title
}:{
  title:string
}){
  return(

    <div className="flex items-center gap-4 rounded-[28px] bg-white p-8 shadow-sm">

      <div className="rounded-2xl bg-green-100 p-3">

        <CheckCircle2 className="h-6 w-6 text-green-600"/>

      </div>

      <p className="font-semibold text-slate-800">

        {title}

      </p>

    </div>

  )
}