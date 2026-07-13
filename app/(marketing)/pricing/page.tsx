import type { Metadata } from "next"
import PricingClient from "./PricingClient"

export const metadata: Metadata = {
  title: "Pricing | KoniqTech",
  description:
    "Simple pricing for Roofing, HVAC, Plumbing and Landscaping businesses. AI-powered CRM with Scheduling, Dispatch, Billing and Automation."
}

export default function PricingPage() {
  return <PricingClient />
}