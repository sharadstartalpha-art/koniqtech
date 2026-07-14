import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Newspaper,
  TrendingUp,
  Brain,
  Wrench,
  Building2,
  BarChart3,
  Users,
  CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
  title: "KoniqTech Blog | CRM, AI & Field Service Insights",
  description:
    "Explore expert articles on CRM, AI automation, dispatch, scheduling, field service management and business growth for Roofing, HVAC, Plumbing and Landscaping companies."
}

const stats = [
  {
    value: "100+",
    label: "Expert Articles"
  },
  {
    value: "4",
    label: "Industries"
  },
  {
    value: "AI",
    label: "Automation Tips"
  },
  {
    value: "Weekly",
    label: "New Content"
  }
]

const categories = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Learn how AI can automate dispatching, quoting, reporting and customer communication.",
    color: "bg-purple-100 text-purple-600",
    posts: "18 Articles"
  },
  {
    icon: Building2,
    title: "CRM & Sales",
    description:
      "Grow your business with better lead management, follow-ups and customer retention.",
    color: "bg-blue-100 text-blue-600",
    posts: "24 Articles"
  },
  {
    icon: Wrench,
    title: "Field Service",
    description:
      "Best practices for technicians, scheduling, dispatch and operational efficiency.",
    color: "bg-green-100 text-green-600",
    posts: "31 Articles"
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description:
      "Marketing, pricing, profitability and scaling strategies for service businesses.",
    color: "bg-orange-100 text-orange-600",
    posts: "27 Articles"
  }
]


const latestArticles = [
  {
    slug: "ai-transforming-field-service-businesses",
    category: "Artificial Intelligence",
    title: "How AI Is Transforming Field Service Businesses",
    excerpt:
      "Discover how artificial intelligence is improving scheduling, dispatch, customer service and operational efficiency.",
    readTime: "8 min read",
    color: "bg-purple-100 text-purple-700"
  },
  {
    slug: "roofing-crm-guide",
    category: "Roofing",
    title: "Choosing The Right Roofing CRM",
    excerpt:
      "Learn the essential features every roofing contractor should look for before investing in CRM software.",
    readTime: "6 min read",
    color: "bg-orange-100 text-orange-700"
  },
  {
    slug: "hvac-dispatch-best-practices",
    category: "HVAC",
    title: "HVAC Dispatch Best Practices",
    excerpt:
      "Improve technician utilization, reduce travel time and increase customer satisfaction.",
    readTime: "7 min read",
    color: "bg-blue-100 text-blue-700"
  },
  {
    slug: "plumbing-business-growth",
    category: "Plumbing",
    title: "Growing A Modern Plumbing Business",
    excerpt:
      "Practical strategies for attracting customers, increasing revenue and streamlining operations.",
    readTime: "9 min read",
    color: "bg-cyan-100 text-cyan-700"
  },
  {
    slug: "landscaping-scheduling-guide",
    category: "Landscaping",
    title: "Landscaping Scheduling Made Easy",
    excerpt:
      "Automate recurring maintenance, optimize routes and reduce missed appointments.",
    readTime: "5 min read",
    color: "bg-green-100 text-green-700"
  },
  {
    slug: "crm-implementation-checklist",
    category: "CRM",
    title: "CRM Implementation Checklist",
    excerpt:
      "A step-by-step guide for successfully moving your business to a modern CRM platform.",
    readTime: "10 min read",
    color: "bg-indigo-100 text-indigo-700"
  }
]

const popularPosts = [
  "Top 10 CRM Features Every Contractor Needs",
  "How AI Saves Hours Every Week",
  "Dispatch Optimization Guide",
  "Increasing Customer Retention",
  "Digital Invoices Best Practices"
]

const newsletterBenefits = [
  "Weekly CRM tips",
  "AI automation guides",
  "Industry best practices",
  "Business growth strategies",
  "Product updates",
  "Exclusive resources"
]

const topics = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Learn how AI automates dispatching, customer communication, quoting, scheduling and reporting.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Users,
    title: "CRM Best Practices",
    description:
      "Improve lead management, customer relationships, sales pipelines and business organization.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Wrench,
    title: "Field Operations",
    description:
      "Discover smarter technician scheduling, dispatch optimization and workforce management.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description:
      "Increase revenue with better pricing, marketing, automation and customer retention strategies.",
    color: "bg-orange-100 text-orange-600"
  }
]

const resources = [
  {
    title: "CRM Buying Guides",
    description:
      "Compare features and choose the right CRM for your business."
  },
  {
    title: "Implementation Checklists",
    description:
      "Step-by-step resources for moving from spreadsheets to KoniqTech."
  },
  {
    title: "Industry Templates",
    description:
      "Ready-to-use workflows, estimates, invoices and operational templates."
  },
  {
    title: "AI Automation Guides",
    description:
      "Learn practical ways to use AI throughout your business."
  }
]

const readingBenefits = [
  "Practical business advice",
  "Industry-specific workflows",
  "CRM implementation guides",
  "Artificial Intelligence tutorials",
  "Sales & marketing strategies",
  "Scheduling best practices",
  "Customer retention tips",
  "Productivity improvements"
]

const faqs = [
  {
    question: "Who is the KoniqTech Blog for?",
    answer:
      "Our blog is written for roofing, HVAC, plumbing, landscaping and other field service business owners, managers, dispatchers and technicians looking to improve operations and grow their businesses."
  },
  {
    question: "How often do you publish new articles?",
    answer:
      "We regularly publish new content covering CRM best practices, AI automation, dispatching, customer service, scheduling and business growth."
  },
  {
    question: "Are the resources free?",
    answer:
      "Yes. All articles, guides and educational resources on the KoniqTech Blog are available free of charge."
  },
  {
    question: "Will the blog include product tutorials?",
    answer:
      "Yes. We publish tutorials, feature updates, implementation guides and workflow examples to help customers get the most from KoniqTech."
  },
  {
    question: "Can I request an article topic?",
    answer:
      "Absolutely. We'd love to hear what topics would help your business. Contact us with your suggestions."
  },
  {
    question: "Can I share these articles with my team?",
    answer:
      "Yes. Our educational articles are intended to help entire field service teams learn modern CRM and AI best practices."
  }
]


export default function BlogPage() {

  return (

    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-blue-700">

                <Sparkles className="h-4 w-4" />

                KoniqTech Blog

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Insights For

                <span className="block text-orange-500">

                  Modern Service Businesses

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Discover practical guides, AI insights,
                CRM best practices and business strategies
                for Roofing,
                HVAC,
                Plumbing,
                Landscaping
                and field service companies.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="#featured-post"
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Read Featured Article

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Book Demo

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Knowledge Hub

                  </h3>

                  <BarChart3 className="h-8 w-8 text-orange-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Articles"
                    value="100+"
                  />

                  <DashboardMetric
                    title="Categories"
                    value="12"
                  />

                  <DashboardMetric
                    title="Industries"
                    value="4"
                  />

                  <DashboardMetric
                    title="Weekly Updates"
                    value="Yes"
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
      {/* FEATURED ARTICLE */}
      {/* ====================================================== */}

      <section
        id="featured-post"
        className="bg-slate-50 py-28"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-white p-12 shadow-xl">

            <div className="grid gap-16 lg:grid-cols-2">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-600">

                  <Newspaper className="h-4 w-4" />

                  Featured Article

                </div>

                <h2 className="mt-8 text-5xl font-black text-slate-900">

                  How AI Is Transforming
                  Field Service Businesses

                </h2>

                <p className="mt-8 text-xl leading-9 text-slate-600">

                  Discover how artificial intelligence is helping service
                  companies automate scheduling, dispatch, customer
                  communication, reporting and everyday operations.

                </p>

                <Link
                  href="/blog/ai-transforming-field-service-businesses"
                  className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Read Article

                  <ArrowRight className="h-5 w-5" />

                </Link>

              </div>

              <div className="rounded-[36px] bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">

                <BookOpen className="h-12 w-12 text-orange-300" />

                <h3 className="mt-8 text-3xl font-bold">

                  Learn From Industry Experts

                </h3>

                <p className="mt-6 text-lg leading-8 text-blue-100">

                  Every article is written to help business owners,
                  managers and technicians improve productivity,
                  customer satisfaction and profitability.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* BLOG CATEGORIES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Explore Categories

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Topics That Help
              Your Business Grow

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {categories.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className={`w-fit rounded-2xl p-4 ${item.color}`}>

                    <Icon className="h-8 w-8" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                  <div className="mt-6 inline-flex rounded-full bg-slate-100 px-5 py-2 font-semibold text-slate-700">

                    {item.posts}

                  </div>

                </div>

              )

            })}

          </div>

        </div>

      </section>
      
            {/* ====================================================== */}
      {/* LATEST ARTICLES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Latest Articles

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Fresh Insights
              Every Week

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Stay updated with practical advice, AI innovations,
              CRM strategies and business growth content.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {latestArticles.map((article) => (

              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-[36px] bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${article.color}`}
                >

                  {article.category}

                </span>

                <h3 className="mt-8 text-2xl font-bold text-slate-900 transition group-hover:text-blue-600">

                  {article.title}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {article.excerpt}

                </p>

                <div className="mt-8 flex items-center justify-between">

                  <span className="font-medium text-slate-500">

                    {article.readTime}

                  </span>

                  <span className="inline-flex items-center gap-2 font-semibold text-blue-600">

                    Read More

                    <ArrowRight className="h-4 w-4" />

                  </span>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* POPULAR + NEWSLETTER */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-10 lg:grid-cols-2">

            <div className="rounded-[40px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Popular Reads

              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">

                Our most-read resources for contractors and service businesses.

              </p>

              <div className="mt-10 space-y-5">

                {popularPosts.map((post, index) => (

                  <Link
                    key={post}
                    href="/blog"
                    className="flex items-center gap-5 rounded-2xl border p-5 transition hover:border-blue-200 hover:bg-blue-50"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">

                      {index + 1}

                    </div>

                    <span className="font-semibold text-slate-700">

                      {post}

                    </span>

                  </Link>

                ))}

              </div>

            </div>

            <div className="rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white shadow-xl">

              <h2 className="text-4xl font-black">

                Subscribe To Our Newsletter

              </h2>

              <p className="mt-6 text-lg leading-8 text-blue-100">

                Receive practical CRM tips, AI insights and business growth
                strategies directly in your inbox.

              </p>

              <div className="mt-10 space-y-4">

                {newsletterBenefits.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <CheckCircle2 className="h-5 w-5 text-green-300" />

                    <span>

                      {item}

                    </span>

                  </div>

                ))}

              </div>

              <form className="mt-10">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder:text-blue-100 outline-none"
                />

                <button
                  className="mt-5 w-full rounded-2xl bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Subscribe

                </button>

              </form>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* TOPICS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Topics We Cover

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Content Designed
              For Service Businesses

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Every article focuses on helping business owners,
              office staff,
              dispatchers
              and technicians work more efficiently.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {topics.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className={`w-fit rounded-2xl p-4 ${item.color}`}>

                    <Icon className="h-8 w-8" />

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
      {/* RESOURCES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-green-600">

                Free Resources

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Learn Faster
                Grow Smarter

              </h2>

              <div className="mt-12 space-y-6">

                {resources.map((resource) => (

                  <div
                    key={resource.title}
                    className="rounded-[32px] border bg-white p-8 shadow-sm"
                  >

                    <h3 className="text-2xl font-bold text-slate-900">

                      {resource.title}

                    </h3>

                    <p className="mt-4 leading-8 text-slate-600">

                      {resource.description}

                    </p>

                  </div>

                ))}

              </div>

            </div>

            <div>

              <p className="font-semibold uppercase tracking-widest text-orange-600">

                Why Read Our Blog?

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Practical Knowledge
                You Can Use

              </h2>

              <div className="mt-12 grid gap-5">

                {readingBenefits.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl bg-slate-50 p-6"
                  >

                    <CheckCircle2 className="h-6 w-6 text-green-600" />

                    <span className="text-lg font-medium text-slate-700">

                      {item}

                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* BLOG CTA */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-10 py-20 text-center text-white shadow-xl">

            <BookOpen className="mx-auto h-14 w-14" />

            <h2 className="mt-8 text-5xl font-black">

              Continue Learning
              With KoniqTech

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

              Explore our growing collection of CRM,
              AI,
              dispatch,
              scheduling
              and business growth articles built specifically
              for field service companies.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/demo"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Book Demo

              </Link>

              <Link
                href="/register"
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >

                Start Free Trial

              </Link>

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

              Blog Questions
              Answered

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Learn more about our articles,
              educational resources
              and how the KoniqTech Blog helps service businesses succeed.

            </p>

          </div>

          <div className="mt-20 space-y-8">

            {faqs.map((faq) => (

              <div
                key={faq.question}
                className="rounded-[32px] border bg-white p-10 shadow-sm"
              >

                <h3 className="text-2xl font-bold text-slate-900">

                  {faq.question}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {faq.answer}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>



              {/* ====================================================== */}
      {/* TRUST */}
      {/* ====================================================== */}

      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-28 text-white">

        <div className="mx-auto max-w-6xl px-6 text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-blue-200">

            Trusted Knowledge

          </p>

          <h2 className="mt-6 text-5xl font-black">

            Practical Insights
            From Industry Experts

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            Every article is created to help service businesses improve
            efficiency, embrace AI, streamline operations and deliver
            exceptional customer experiences.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Industry Focused

              </h3>

              <p className="mt-4 text-blue-100">

                Content created specifically for field service businesses.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Actionable Advice

              </h3>

              <p className="mt-4 text-blue-100">

                Practical strategies you can apply immediately.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                AI & CRM Expertise

              </h3>

              <p className="mt-4 text-blue-100">

                Learn modern technologies that help businesses grow.

              </p>

            </div>

          </div>

        </div>

      </section>


              {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-green-600 to-blue-600 px-10 py-24 text-center text-white shadow-xl">

            <BookOpen className="mx-auto h-16 w-16" />

            <h2 className="mt-8 text-5xl font-black">

              Ready To Transform
              Your Business?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-50">

              Put these ideas into practice with KoniqTech.
              Manage customers,
              automate operations,
              schedule technicians
              and grow your business using one AI-powered platform.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
              >

                Start Free Trial

              </Link>

              <Link
                href="/demo"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Book Live Demo

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