
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [mobileIndustryOpen, setMobileIndustryOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false)
        setMobileIndustryOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [mobileOpen])

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setMobileIndustryOpen(false)
  }

  const mobileLinkClass =
    "block w-full py-3 text-base font-medium text-slate-200 " +
    "transition-colors hover:text-orange-400"

  const industryLinks = [
    { href: "/industries/roofing", label: "Roofing CRM" },
    { href: "/industries/hvac", label: "HVAC CRM" },
    { href: "/industries/plumbing", label: "Plumbing CRM" },
    { href: "/industries/landscaping", label: "Landscaping CRM" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="KoniqTech home"
          >
            <img
              src="/logo.png"
              alt="KoniqTech"
              className="h-10 w-10 object-contain"
            />

            <div>
              <h2 className="text-xl font-bold text-white">
                KoniqTech
              </h2>
              <p className="text-xs text-slate-400">
                Field Service CRM
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            <Link
              href="/features"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Features
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIndustryOpen(true)}
              onMouseLeave={() => setIndustryOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIndustryOpen((open) => !open)}
                aria-expanded={industryOpen}
                className="flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
              >
                Industries
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    industryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-0 top-full z-[60] pt-3 ${
                  industryOpen ? "visible opacity-100" : "invisible opacity-0"
                } transition-opacity duration-200`}
              >
                <div className="w-72 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-4 text-slate-200 transition-colors hover:bg-slate-800 hover:text-orange-400"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/ai-platform"
              className="text-slate-300 transition-colors hover:text-white"
            >
              AI
            </Link>

            <Link
              href="/integrations"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Integrations
            </Link>

            <Link
              href="/pricing"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className="text-slate-300 transition-colors hover:text-white"
            >
              About
            </Link>

            <Link
              href="/docs"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Docs
            </Link>

            <Link
              href="/contact"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/login"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white transition-colors hover:bg-orange-600"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="rounded-lg p-2 text-white transition-colors hover:bg-slate-800 lg:hidden"
          >
            <Menu size={27} />
          </button>
        </div>
      </header>

      {/* Mobile navigation: outside the sticky header */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-[100] lg:hidden"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 h-full w-full bg-black/70"
          />

          {/* Full-height drawer */}
          <aside className="absolute inset-y-0 right-0 flex h-[100dvh] w-[min(340px,88vw)] flex-col border-l border-slate-800 bg-slate-950 text-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-6">
              <span className="text-lg font-semibold">Menu</span>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
                className="rounded-lg p-2 text-white transition-colors hover:bg-slate-800"
              >
                <X size={27} />
              </button>
            </div>

            {/* Scrollable navigation links */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              <Link
                href="/features"
                onClick={closeMobileMenu}
                className={mobileLinkClass}
              >
                Features
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileIndustryOpen((open) => !open)
                }
                aria-expanded={mobileIndustryOpen}
                className={`${mobileLinkClass} flex items-center justify-between text-left`}
              >
                Industries
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    mobileIndustryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileIndustryOpen && (
                <div className="mb-3 ml-3 border-l border-slate-700 pl-4">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block py-3 text-sm text-slate-400 transition-colors hover:text-orange-400"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {[
                { href: "/ai-platform", label: "AI" },
                { href: "/integrations", label: "Integrations" },
                { href: "/pricing", label: "Pricing" },
                { href: "/about", label: "About" },
                { href: "/docs", label: "Docs" },
                { href: "/contact", label: "Contact" },
                { href: "/help", label: "Help" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Fixed action area at the bottom */}
            <div className="shrink-0 space-y-3 border-t border-slate-800 bg-slate-950 px-6 py-5 pb-[max(20px,env(safe-area-inset-bottom))]">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="block rounded-xl border border-slate-700 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="block rounded-xl bg-orange-500 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Start Free
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
