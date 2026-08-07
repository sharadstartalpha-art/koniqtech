"use client";

import { useMemo, useState } from "react";
import {
  Settings2,
  Search,
  Building2,
  Sparkles,
  Truck,
  Bot,
  Map,
  Boxes,
  DollarSign,
  FileText,
  Phone,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

type Plan = "Starter" | "Professional" | "Enterprise";

interface Organization {
  id: string;
  name: string;
  plan: Plan;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  starter: boolean;
  professional: boolean;
  enterprise: boolean;
}

const organizations: Organization[] = [
  {
    id: "1",
    name: "Starter Roofing Demo",
    plan: "Starter",
  },
  {
    id: "2",
    name: "Professional HVAC Demo",
    plan: "Professional",
  },
  {
    id: "3",
    name: "Enterprise Plumbing Demo",
    plan: "Enterprise",
  },
];

const features: Feature[] = [
  {
    id: "ai",
    name: "AI Assistant",
    description: "OpenAI powered assistant",
    icon: Bot,
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    id: "automation",
    name: "Automation",
    description: "Workflow automation",
    icon: Sparkles,
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Inventory management",
    icon: Boxes,
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    id: "fleet",
    name: "Fleet",
    description: "Vehicle tracking",
    icon: Truck,
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    id: "route-ai",
    name: "Route AI",
    description: "AI optimized routing",
    icon: Map,
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    id: "reports",
    name: "Advanced Reports",
    description: "Business analytics",
    icon: BarChart3,
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    id: "finance",
    name: "Finance",
    description: "Accounting & Payroll",
    icon: DollarSign,
    starter:false,
    professional:false,
    enterprise:true,
  },
  {
    id:"voice",
    name:"Voice Agent",
    description:"AI phone assistant",
    icon:Phone,
    starter:false,
    professional:false,
    enterprise:true,
  },
  {
    id:"documents",
    name:"Documents",
    description:"Contracts & Files",
    icon:FileText,
    starter:true,
    professional:true,
    enterprise:true,
  },
  {
    id:"security",
    name:"Advanced Security",
    description:"Audit & MFA",
    icon:ShieldCheck,
    starter:false,
    professional:true,
    enterprise:true,
  },
];

export default function FeatureFlagsPage() {

  const [search,setSearch]=useState("");

  const filtered = useMemo(() => {

    return features.filter(f =>
      (
        f.name +
        f.description
      )
      .toLowerCase()
      .includes(search.toLowerCase())
    );

  },[search]);

  return (

    <div className="space-y-8">

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-orange-500 p-3 text-white">

            <Settings2 className="h-7 w-7"/>

          </div>

          <div>

            <h1 className="text-3xl font-bold">
              Feature Manager
            </h1>

            <p className="mt-2 text-slate-600">
              Control feature availability for Starter,
              Professional and Enterprise plans.
            </p>

          </div>

        </div>

        <div className="relative mt-8">

          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search feature..."
            className="w-full rounded-xl border py-3 pl-12 pr-4"
          />

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Test Organization
        </h2>

        <select className="w-full rounded-xl border p-3">

          {organizations.map(org=>(
            <option key={org.id}>
              {org.name} ({org.plan})
            </option>
          ))}

        </select>

      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm text-slate-600">

              <th className="px-6 py-4">
                Feature
              </th>

              <th className="text-center">
                Starter
              </th>

              <th className="text-center">
                Professional
              </th>

              <th className="text-center">
                Enterprise
              </th>

              <th className="text-center">
                Override
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map(feature=>{

              const Icon=feature.icon;

              return(

                <tr
                  key={feature.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-4">

                      <div className="rounded-lg bg-slate-100 p-2">

                        <Icon className="h-5 w-5"/>

                      </div>

                      <div>

                        <p className="font-semibold">
                          {feature.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {feature.description}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      defaultChecked={feature.starter}
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      defaultChecked={feature.professional}
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      defaultChecked={feature.enterprise}
                    />
                  </td>

                  <td className="text-center">

                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                      Override
                    </button>

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

      <div className="flex justify-end gap-4">

        <button className="rounded-lg bg-orange-500 px-5 py-3 text-white hover:bg-orange-600">
          Reset Defaults
        </button>

        <button className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700">
          Save Changes
        </button>

      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

        <div className="flex items-center gap-3">

          <Building2 className="h-6 w-6 text-blue-600"/>

          <div>

            <h3 className="font-semibold text-blue-900">
              Recommended Usage
            </h3>

            <p className="mt-2 text-sm text-blue-700">
              Use this page to preview feature visibility for
              Starter, Professional and Enterprise plans.
              Organization overrides should be used only for
              support, beta access or temporary testing.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}