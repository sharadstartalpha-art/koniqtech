import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock3,
  User,
  BookOpen,
  Sparkles,
  CheckCircle2
} from "lucide-react"

type BlogPost = {
  slug: string
  category: string
  title: string
  description: string
  author: string
  published: string
  readTime: string
  heroColor: string
}

const blogPosts: BlogPost[] = [
  {
    slug: "ai-transforming-field-service-businesses",
    category: "Artificial Intelligence",
    title: "How AI Is Transforming Field Service Businesses",
    description:
      "Discover how artificial intelligence is changing dispatch, scheduling, customer communication and business operations.",
    author: "KoniqTech Editorial Team",
    published: "January 2026",
    readTime: "8 min read",
    heroColor: "from-purple-600 to-blue-600"
  },
  {
    slug: "roofing-crm-guide",
    category: "Roofing",
    title: "Choosing The Right Roofing CRM",
    description:
      "A complete guide to selecting CRM software for roofing contractors.",
    author: "KoniqTech Editorial Team",
    published: "January 2026",
    readTime: "6 min read",
    heroColor: "from-orange-500 to-red-500"
  },
  {
    slug: "hvac-dispatch-best-practices",
    category: "HVAC",
    title: "HVAC Dispatch Best Practices",
    description:
      "Improve technician utilization with intelligent dispatch workflows.",
    author: "KoniqTech Editorial Team",
    published: "January 2026",
    readTime: "7 min read",
    heroColor: "from-blue-600 to-cyan-600"
  },
  {
    slug: "plumbing-business-growth",
    category: "Plumbing",
    title: "Growing A Modern Plumbing Business",
    description:
      "Modern growth strategies for plumbing companies.",
    author: "KoniqTech Editorial Team",
    published: "January 2026",
    readTime: "9 min read",
    heroColor: "from-cyan-600 to-blue-700"
  },
  {
    slug: "landscaping-scheduling-guide",
    category: "Landscaping",
    title: "Landscaping Scheduling Made Easy",
    description:
      "Optimize recurring jobs, crews and seasonal scheduling.",
    author: "KoniqTech Editorial Team",
    published: "January 2026",
    readTime: "5 min read",
    heroColor: "from-green-600 to-emerald-600"
  },
  {
    slug: "crm-implementation-checklist",
    category: "CRM",
    title: "CRM Implementation Checklist",
    description:
      "Everything you need before moving your business to a CRM.",
    author: "KoniqTech Editorial Team",
    published: "January 2026",
    readTime: "10 min read",
    heroColor: "from-indigo-600 to-blue-700"
  }
]

type Props = {
  params: Promise<{
    slug: string
  }>
}


const tableOfContents = [
  "Introduction",
  "Why This Matters",
  "Common Challenges",
  "Modern Solution",
  "How KoniqTech Helps",
  "Key Takeaways"
]

const articleSections = [
  {
    title: "Introduction",
    content: [
      "Field service businesses are changing rapidly. Customers expect faster response times, technicians need better mobile tools and office teams require complete visibility across every job.",
      "Traditional spreadsheets and disconnected software often create delays, duplicate work and poor communication between office staff and field technicians."
    ]
  },
  {
    title: "Why This Matters",
    content: [
      "Whether you're managing a roofing company, HVAC business, plumbing contractor or landscaping crew, operational efficiency directly impacts profitability.",
      "Automating repetitive work allows teams to spend more time serving customers instead of handling paperwork."
    ]
  },
  {
    title: "Common Challenges",
    content: [
      "Many businesses still struggle with manual scheduling, missed appointments, paper invoices, delayed estimates and poor communication between technicians and office staff.",
      "These problems often reduce customer satisfaction while increasing operational costs."
    ]
  },
  {
    title: "Modern Solution",
    content: [
      "Modern CRM platforms combine scheduling, dispatching, customer management, AI automation and reporting into one centralized cloud platform.",
      "This provides real-time visibility across every customer, technician and project."
    ]
  },
  {
    title: "How KoniqTech Helps",
    content: [
      "KoniqTech combines CRM, AI, dispatching, mobile apps, reporting and customer communication into one intelligent operating system built specifically for field service businesses.",
      "Teams can automate repetitive work while improving customer experiences and increasing productivity."
    ]
  }
]

const takeaways = [
  "Centralize customer information",
  "Automate scheduling & dispatch",
  "Improve technician productivity",
  "Reduce manual paperwork",
  "Deliver faster customer service",
  "Scale your business efficiently"
]


const readingBenefits = [
  "Weekly AI insights",
  "CRM implementation guides",
  "Business growth strategies",
  "Industry best practices",
  "Field service automation",
  "Product updates"
]

const faqs = [
  {
    question: "Are these articles free to read?",
    answer:
      "Yes. Every article published on the KoniqTech Blog is completely free and available to help field service businesses learn modern CRM, AI and operational best practices."
  },
  {
    question: "How often is the blog updated?",
    answer:
      "We regularly publish new educational articles covering CRM implementation, AI automation, dispatching, scheduling, customer management and business growth."
  },
  {
    question: "Who writes these articles?",
    answer:
      "Articles are created by the KoniqTech Editorial Team based on real-world field service workflows, software best practices and industry research."
  },
  {
    question: "Can I share articles with my team?",
    answer:
      "Absolutely. We encourage business owners, office staff and technicians to use these articles as learning resources."
  },
  {
    question: "Will more industries be added?",
    answer:
      "Yes. We continuously expand our educational content as KoniqTech grows into additional field service industries."
  },
  {
    question: "Where can I request new topics?",
    answer:
      "Contact the KoniqTech team through our Contact page and we'll consider your suggestions for future articles."
  }
]



export async function generateMetadata({
  params
}: Props): Promise<Metadata> {

  const { slug } = await params

  const post =
    blogPosts.find(p => p.slug === slug)

  if (!post) {

    return {
      title: "Article Not Found | KoniqTech"
    }

  }

  return {

    title: `${post.title} | KoniqTech Blog`,

    description: post.description

  }

}

export default async function BlogArticlePage({
  params
}: Props) {

  const { slug } = await params

  const post =
    blogPosts.find(p => p.slug === slug)

  if (!post) {

    notFound()

  }

  return (

    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section
        className={`
        bg-gradient-to-r
        ${post.heroColor}
        py-28
        text-white
        `}
      >

        <div className="mx-auto max-w-5xl px-6">

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 transition hover:bg-white/20"
          >

            <ArrowLeft className="h-4 w-4" />

            Back To Blog

          </Link>

          <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2">

            <Sparkles className="h-4 w-4" />

            {post.category}

          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">

            {post.title}

          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/90">

            {post.description}

          </p>

          <div className="mt-12 flex flex-wrap gap-8">

            <AuthorInfo
              icon={<User className="h-5 w-5" />}
              label="Author"
              value={post.author}
            />

            <AuthorInfo
              icon={<Calendar className="h-5 w-5" />}
              label="Published"
              value={post.published}
            />

            <AuthorInfo
              icon={<Clock3 className="h-5 w-5" />}
              label="Reading Time"
              value={post.readTime}
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* ARTICLE HEADER */}
      {/* ====================================================== */}

      <section className="py-24">

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-[40px] border bg-white p-12 shadow-xl">

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-orange-100 p-5">

                <BookOpen className="h-10 w-10 text-orange-600" />

              </div>

              <div>

                <h2 className="text-3xl font-black text-slate-900">

                  Article Overview

                </h2>

                <p className="mt-3 text-lg text-slate-600">

                  Practical insights for modern field service businesses.

                </p>

              </div>

            </div>

            <div className="mt-10 rounded-[32px] bg-slate-50 p-8">

              <p className="text-lg leading-9 text-slate-700">

                This article explores practical strategies that help
                roofing,
                HVAC,
                plumbing,
                landscaping
                and field service companies improve operations,
                increase productivity
                and deliver outstanding customer experiences using
                modern CRM technology and artificial intelligence.

              </p>

            </div>

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* FEATURED IMAGE */}
      {/* ====================================================== */}

      <section>

        <div className="mx-auto max-w-7xl px-6">

          <div
            className={`
            rounded-[40px]
            bg-gradient-to-r
            ${post.heroColor}
            p-20
            text-center
            text-white
            shadow-2xl
            `}
          >

            <BookOpen className="mx-auto h-20 w-20 text-orange-300" />

            <h2 className="mt-8 text-5xl font-black">

              {post.title}

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/90">

              Practical insights, modern workflows and AI strategies
              for today's field service businesses.

            </p>

          </div>

        </div>

      </section>

              {/* ====================================================== */}
      {/* TABLE OF CONTENTS */}
      {/* ====================================================== */}

      <section className="py-24">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">

          <aside>

            <div className="sticky top-28 rounded-[36px] border bg-white p-8 shadow-sm">

              <h3 className="text-2xl font-black text-slate-900">

                Table Of Contents

              </h3>

              <div className="mt-8 space-y-5">

                {tableOfContents.map((item, index) => (

                  <div
                    key={item}
                    className="flex items-center gap-4"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">

                      {index + 1}

                    </div>

                    <span className="font-medium text-slate-700">

                      {item}

                    </span>

                  </div>

                ))}

              </div>

              <div className="mt-10 rounded-2xl bg-green-50 p-6">

                <p className="font-semibold text-green-700">

                  Reading Time

                </p>

                <p className="mt-2 text-3xl font-black text-green-600">

                  {post.readTime}

                </p>

              </div>

            </div>

          </aside>


                    <div className="lg:col-span-2">

            <div className="rounded-[40px] border bg-white p-12 shadow-sm">

              {articleSections.map((section) => (

                <article
                  key={section.title}
                  className="mb-16 last:mb-0"
                >

                  <h2 className="text-4xl font-black text-slate-900">

                    {section.title}

                  </h2>

                  <div className="mt-8 space-y-6">

                    {section.content.map((paragraph) => (

                      <p
                        key={paragraph}
                        className="text-xl leading-9 text-slate-600"
                      >

                        {paragraph}

                      </p>

                    ))}

                  </div>

                </article>

              ))}

              <div className="rounded-[36px] bg-blue-600 p-10 text-white">

                <h3 className="text-3xl font-black">

                  Expert Insight

                </h3>

                <p className="mt-6 text-xl leading-9 text-blue-100">

                  Businesses that embrace automation and centralized CRM
                  platforms are better positioned to deliver faster service,
                  improve customer satisfaction and scale operations
                  efficiently.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* KEY TAKEAWAYS */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-slate-50 p-12">

            <h2 className="text-center text-5xl font-black text-slate-900">

              Key Takeaways

            </h2>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {takeaways.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm"
                >

                  <CheckCircle2 className="h-6 w-6 text-green-600" />

                  <span className="font-semibold text-slate-700">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>



            {/* ====================================================== */}
      {/* RELATED ARTICLES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Continue Reading

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Related Articles

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Explore more practical guides designed to help modern
              field service businesses improve productivity,
              customer satisfaction and profitability.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {blogPosts
              .filter(article => article.slug !== post.slug)
              .slice(0, 3)
              .map(article => (

                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group rounded-[36px] bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div
                    className={`
                      rounded-3xl
                      bg-gradient-to-r
                      ${article.heroColor}
                      p-8
                      text-white
                    `}
                  >

                    <BookOpen className="h-10 w-10 text-orange-300" />

                    <div className="mt-6 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">

                      {article.category}

                    </div>

                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-slate-900 transition group-hover:text-blue-600">

                    {article.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {article.description}

                  </p>

                  <div className="mt-8 flex items-center justify-between">

                    <span className="text-slate-500">

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
      {/* ARTICLE NAVIGATION */}
      {/* ====================================================== */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-2">

            <Link
              href="/blog"
              className="rounded-[36px] border bg-white p-10 transition hover:-translate-y-1 hover:shadow-xl"
            >

              <ArrowLeft className="h-8 w-8 text-blue-600" />

              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-blue-600">

                Previous

              </p>

              <h3 className="mt-3 text-3xl font-bold text-slate-900">

                Back To Blog

              </h3>

              <p className="mt-4 leading-8 text-slate-600">

                Browse all CRM,
                AI,
                dispatch
                and business growth articles.

              </p>

            </Link>

            <Link
              href="/demo"
              className="rounded-[36px] border bg-white p-10 text-right transition hover:-translate-y-1 hover:shadow-xl"
            >

              <ArrowRight className="ml-auto h-8 w-8 text-orange-500" />

              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-orange-600">

                Next Step

              </p>

              <h3 className="mt-3 text-3xl font-bold text-slate-900">

                Book A Live Demo

              </h3>

              <p className="mt-4 leading-8 text-slate-600">

                See KoniqTech in action with a personalized product demonstration.

              </p>

            </Link>

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* NEWSLETTER */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white shadow-xl">

            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div>

                <p className="font-semibold uppercase tracking-widest text-blue-200">

                  Newsletter

                </p>

                <h2 className="mt-4 text-5xl font-black">

                  Stay Updated
                  Every Week

                </h2>

                <p className="mt-8 text-xl leading-9 text-blue-100">

                  Receive practical CRM,
                  AI
                  and business growth articles directly in your inbox.

                </p>

                <div className="mt-10 grid gap-4">

                  {readingBenefits.map(item => (

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

              </div>

              <div>

                <div className="rounded-[32px] bg-white p-8">

                  <h3 className="text-3xl font-black text-slate-900">

                    Subscribe

                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">

                    Join thousands of professionals learning modern field service management.

                  </p>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-8 w-full rounded-2xl border px-5 py-4 outline-none focus:border-blue-500"
                  />

                  <button
                    className="mt-5 w-full rounded-2xl bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                  >

                    Subscribe Now

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



            {/* ====================================================== */}
      {/* BLOG CTA */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-green-600 to-blue-600 px-10 py-24 text-center text-white shadow-xl">

            <BookOpen className="mx-auto h-16 w-16" />

            <h2 className="mt-8 text-5xl font-black">

              Ready To Grow
              Your Business?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-50">

              Discover how KoniqTech helps Roofing,
              HVAC,
              Plumbing
              and Landscaping companies automate operations,
              improve customer service
              and increase profitability.

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

                Book Demo

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

              Questions About
              Our Blog

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Everything you need to know about our educational resources,
              articles and industry guides.

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

            Built On Practical
            Industry Experience

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            Every guide is designed to provide practical,
            actionable knowledge that helps modern field service
            businesses become more productive,
            profitable
            and customer-focused.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Industry Expertise

              </h3>

              <p className="mt-4 text-blue-100">

                Practical content built specifically for field service businesses.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Actionable Advice

              </h3>

              <p className="mt-4 text-blue-100">

                Learn strategies you can implement immediately.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                AI & CRM Innovation

              </h3>

              <p className="mt-4 text-blue-100">

                Stay ahead with modern technology and automation.

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

              Put These Ideas
              Into Action

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-50">

              Transform your roofing,
              HVAC,
              plumbing
              or landscaping business using KoniqTech's
              AI-powered CRM,
              intelligent automation,
              dispatching,
              reporting
              and customer management platform.

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

function AuthorInfo({
  icon,
  label,
  value
}:{
  icon: React.ReactNode
  label: string
  value: string
}){

  return(

    <div className="flex items-center gap-4">

      <div className="rounded-2xl bg-white/10 p-3">

        {icon}

      </div>

      <div>

        <p className="text-sm uppercase tracking-wider text-white/70">

          {label}

        </p>

        <p className="font-semibold">

          {value}

        </p>

      </div>

    </div>

  )

}