import Link from "next/link"
import { Menu, ArrowRight, CheckCircle, Brain, Users, Calendar, FileText, Wrench } from "lucide-react"
import FAQAccordion from "@/components/Marketing/FAQAccordion"
import Testimonials from "@/components/Marketing/Testimonials"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-10 h-10" alt="logo" />
            <div>
              <div className="text-2xl font-bold">Koniqtech</div>
              <div className="text-slate-400 text-sm">AI CRM Platform</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Login</Link>
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl">
              Start Free
            </Link>
          </nav>

          <button className="lg:hidden">
            <Menu />
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-slate-800 text-orange-400">
            AI CRM For Home Service Businesses
          </span>

          <h1 className="text-6xl lg:text-8xl font-bold mt-8 leading-tight">
            Grow Your
            <span className="block text-orange-500">Service Business</span>
          </h1>

          <p className="text-slate-300 text-xl mt-8 max-w-2xl">
            Manage leads, customers, dispatch, jobs, invoices, technicians and AI automation from one platform.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl flex items-center gap-2">
              Start Free Trial <ArrowRight size={18} />
            </Link>

            <Link href="/contact" className="border border-slate-700 px-8 py-4 rounded-xl">
              Book Demo
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="grid grid-cols-2 gap-4">
            <Stat title="Leads" value="241" />
            <Stat title="Revenue" value="$82K" />
            <Stat title="Jobs" value="43" />
            <Stat title="Customers" value="112" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold text-center mb-16">Everything Included</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature icon={<Users />} title="Lead Management" />
          <Feature icon={<Calendar />} title="Dispatch Board" />
          <Feature icon={<Brain />} title="AI Automation" />
          <Feature icon={<FileText />} title="Quotes & Invoices" />
          <Feature icon={<Wrench />} title="Field Service" />
          <Feature icon={<CheckCircle />} title="Multi Tenant SaaS" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-slate-900 rounded-3xl p-10">
          <h2 className="text-5xl font-bold text-center">Pricing</h2>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Pricing title="Starter" price="$199" />
            <Pricing title="Growth AI" price="$299" />
            <Pricing title="Enterprise" price="Custom" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold text-center mb-12">Contact Us</h2>

        <div className="bg-slate-900 rounded-3xl p-8 space-y-4">
          <input className="w-full h-14 rounded-xl bg-slate-800 px-4" placeholder="Name" />
          <input className="w-full h-14 rounded-xl bg-slate-800 px-4" placeholder="Email" />
          <textarea className="w-full rounded-xl bg-slate-800 p-4 h-40" placeholder="Message" />
          <button className="bg-orange-500 px-8 py-4 rounded-xl">Send Message</button>
        </div>
      </section>

<section
className="
max-w-7xl
mx-auto
px-6
py-24
"
>

<Testimonials/>

</section>


<section
className="
max-w-4xl
mx-auto
px-6
pb-24
"
>

<h2 className="
text-5xl
font-bold
text-center
text-white
mb-12
">

Frequently Asked Questions

</h2>

<FAQAccordion/>

</section>



      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl">Koniqtech</h3>
            <p className="text-slate-400 mt-3">AI CRM Platform</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <div className="space-y-2 text-slate-400">
              <Link href="/features">Features</Link><br />
              <Link href="/pricing">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <div className="space-y-2 text-slate-400">
              <Link href="/about">About</Link><br />
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-slate-400">
              <Link href="/privacy-policy">Privacy Policy</Link><br />
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6">
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-slate-400 mt-2">{title}</div>
    </div>
  )
}

function Feature({ icon, title }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
      {icon}
      <h3 className="text-2xl font-semibold mt-4">{title}</h3>
    </div>
  )
}

function Pricing({ title, price }: any) {
  return (
    <div className="bg-slate-800 rounded-3xl p-8">
      <h3 className="text-3xl font-bold">{title}</h3>
      <div className="text-5xl font-bold mt-4">{price}</div>
    </div>
  )
}
