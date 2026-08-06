"use client";

import {
  Building2,
  Database,
  Users,
  Briefcase,
  Receipt,
  DollarSign,
  Bot,
  HardDrive,
  TrendingUp,
  Activity,
} from "lucide-react";

interface StatisticsCardsProps {
  statistics: {
    organizations: number;
    records: number;
    customers: number;
    jobs: number;
    invoices: number;
    revenue: number;
    aiConversations: number;
    storage: string;
    generatedToday: number;
    activeGenerators: number;
  };
}

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export default function StatisticsCards({
  statistics,
}: StatisticsCardsProps) {
  const cards: StatCard[] = [
    {
      title: "Organizations",
      value: statistics.organizations.toLocaleString(),
      subtitle: "Demo organizations",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Records",
      value: statistics.records.toLocaleString(),
      subtitle: "Generated records",
      icon: Database,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Customers",
      value: statistics.customers.toLocaleString(),
      subtitle: "Customer records",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Jobs",
      value: statistics.jobs.toLocaleString(),
      subtitle: "Service jobs",
      icon: Briefcase,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Invoices",
      value: statistics.invoices.toLocaleString(),
      subtitle: "Invoices created",
      icon: Receipt,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      title: "Revenue",
      value: `$${statistics.revenue.toLocaleString()}`,
      subtitle: "Demo revenue",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "AI Conversations",
      value: statistics.aiConversations.toLocaleString(),
      subtitle: "Generated chats",
      icon: Bot,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Storage",
      value: statistics.storage,
      subtitle: "Database size",
      icon: HardDrive,
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
    {
      title: "Generated Today",
      value: statistics.generatedToday.toLocaleString(),
      subtitle: "Today's records",
      icon: TrendingUp,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      title: "Generators",
      value: statistics.activeGenerators.toString(),
      subtitle: "Available modules",
      icon: Activity,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${card.bg}`}
              >
                <Icon
                  className={`h-6 w-6 ${card.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}