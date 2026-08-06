import { LucideIcon } from "lucide-react";

export interface StatisticsCard {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: string;
  industry: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
}

export interface GeneratorCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  defaultCount: number;
  color: string;
}

export interface GenerationHistoryItem {
  id: string;
  module: string;
  records: number;
  startedAt: string;
  completedAt: string;
  status: "Pending" | "Running" | "Completed" | "Failed";
}

export interface ProgressItem {
  module: string;
  current: number;
  total: number;
}

export interface DemoStatistics {
  organizations: number;
  records: number;
  generatedToday: number;
  storage: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: LucideIcon;
}

export interface GeneratorRequest {
  organizationId: string;
  templateId: string;
  module: string;
  count: number;
}

export interface GeneratorResult {
  success: boolean;
  message: string;
  recordsCreated: number;
}