import Link from "next/link"

export const dynamic = "force-dynamic"

const templates = [
  {
    id: "roofing",
    name: "Roofing Estimate",
    description:
      "Residential and commercial roofing projects.",
    color: "bg-orange-100",
    icon: "🏠",
  },
  {
    id: "hvac",
    name: "HVAC Installation",
    description:
      "Heating, cooling and ventilation systems.",
    color: "bg-blue-100",
    icon: "❄️",
  },
  {
    id: "electrical",
    name: "Electrical Service",
    description:
      "Electrical repairs, upgrades and installations.",
    color: "bg-yellow-100",
    icon: "⚡",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description:
      "Repairs, pipe replacement and new installations.",
    color: "bg-cyan-100",
    icon: "🚰",
  },
  {
    id: "painting",
    name: "Painting",
    description:
      "Interior and exterior painting estimates.",
    color: "bg-pink-100",
    icon: "🎨",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description:
      "Residential and commercial cleaning services.",
    color: "bg-green-100",
    icon: "🧹",
  },
]

export default function QuoteTemplatesPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Quote Templates
          </h1>

          <p className="text-slate-500 mt-2">
            Start a professional quote using a predefined template.
          </p>

        </div>

        <Link
          href="/quotes/create"
          className="
            px-6
            py-3
            rounded-xl
            bg-orange-600
            text-white
            hover:bg-orange-700
          "
        >
          Blank Quote
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {templates.map((template) => (

          <div
            key={template.id}
            className="
              bg-white
              border
              rounded-3xl
              p-7
              hover:shadow-lg
              transition
            "
          >

            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                text-3xl
                mb-6
                ${template.color}
              `}
            >
              {template.icon}
            </div>

            <h2 className="text-2xl font-bold">
              {template.name}
            </h2>

            <p className="text-slate-500 mt-3 mb-8">
              {template.description}
            </p>

            <Link
              href={`/quotes/create?template=${template.id}`}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-orange-600
                hover:bg-orange-700
                text-white
                px-5
                py-3
                font-medium
              "
            >
              Use Template
            </Link>

          </div>

        ))}

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-4">
          Coming Soon
        </h2>

        <ul className="space-y-3 text-slate-600">

          <li>• Save your own custom templates</li>

          <li>• Company branding and logo</li>

          <li>• Default line items and pricing</li>

          <li>• Terms & Conditions library</li>

          <li>• Auto-filled labor and materials</li>

          <li>• AI-generated quote templates</li>

        </ul>

      </div>

    </div>
  )
}