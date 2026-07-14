import type { Metadata } from "next"
import Link from "next/link"

import {
  AlertTriangle,
  ArrowRight,
  Home,
  Search,
  BookOpen,
  Phone,
  Sparkles
} from "lucide-react"

export const metadata: Metadata = {
  title: "404 - Page Not Found | KoniqTech",
  description:
    "The page you are looking for could not be found."
}

const quickLinks = [
  {
    title: "Features",
    href: "/features",
    icon: Sparkles,
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    title: "AI Platform",
    href: "/ai-platform",
    icon: Search,
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    title: "Industries",
    href: "/industries",
    icon: Home,
    color: "text-orange-600",
    bg: "bg-orange-100"
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Phone,
    color: "text-red-600",
    bg: "bg-red-100"
  }
]

export default function NotFound() {
  return (
    <main className="bg-white">

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-24">

          <div className="w-full text-center">

            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-red-100">

              <AlertTriangle className="h-14 w-14 text-red-600" />

            </div>

            <p className="mt-10 text-lg font-bold uppercase tracking-[0.3em] text-blue-600">

              Error 404

            </p>

            <h1 className="mt-6 text-6xl font-black text-slate-900 md:text-8xl">

              Page Not Found

            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              The page you're looking for doesn't exist,
              may have been moved,
              or the URL may be incorrect.

            </p>

            <div className="mt-14 flex flex-wrap justify-center gap-5">

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >
                <Home className="h-5 w-5" />
                Back To Home
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Book Demo
                <ArrowRight className="h-5 w-5" />
              </Link>

            </div>

            <div className="mt-24">

              <h2 className="text-4xl font-black text-slate-900">

                Popular Pages

              </h2>

              <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

                {quickLinks.map((item) => {

                  const Icon = item.icon

                  return (

                    <Link
                      key={item.title}
                      href={item.href}
                      className="rounded-[32px] border bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                    >

                      <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg}`}
                      >

                        <Icon className={`h-8 w-8 ${item.color}`} />

                      </div>

                      <h3 className="mt-6 text-2xl font-bold text-slate-900">

                        {item.title}

                      </h3>

                    </Link>

                  )

                })}

              </div>

            </div>

            <div className="mt-24 rounded-[40px] bg-gradient-to-r from-blue-600 via-green-600 to-orange-500 px-10 py-20 text-white">

              <BookOpen className="mx-auto h-16 w-16" />

              <h2 className="mt-8 text-5xl font-black">

                Need Help?

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

                Our team is ready to help you find the right page,
                answer your questions,
                or schedule a personalized product demonstration.

              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-5">

                <Link
                  href="/contact"
                  className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >
                  Contact Us
                </Link>

                <Link
                  href="/docs"
                  className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >
                  Documentation
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}