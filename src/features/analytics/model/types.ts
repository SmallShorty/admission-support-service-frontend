export { AdmissionIntentCategory } from "@/features/tickets/model/types";

export type AnalyticsPeriod = "day" | "week" | "month";
export type AnalyticsScope = "GLOBAL" | "OPERATOR";
export type TrendDirection = "up" | "down" | "flat";

export interface Trend {
  percentage: number;
  direction: TrendDirection;
}

export interface AnalyticsMeta {
  scope: AnalyticsScope;
  agentId: string | null;
  period: AnalyticsPeriod;
  lastUpdated: string;
}

export interface AnalyticsRequests {
  total: number;
  trend: Trend | null;
  open: number;
  resolved: number;
}

export interface MetricValue {
  value: number | null;
  trend: number | null;
}

export interface AnalyticsPerformance {
  avgRT: MetricValue;
  csat: MetricValue;
  isSlaBreached: boolean;
}

export interface HourlyActivityEntry {
  hour: string;
  incoming: number;
  resolved: number;
  messages: number;
  efficiency: number;
}

export interface HourlyVolumeEntry {
  label: string;
  count: number;
  incoming: number;
  completed: number;
}

export interface CategoryStatEntry {
  category: AdmissionIntentCategory;
  count: number;
  percentage: number;
}

export interface AnalyticsCharts {
  hourlyActivity: HourlyActivityEntry[];
  hourlyTicketVolume: HourlyVolumeEntry[];
  categoryStats: CategoryStatEntry[];
}

export interface AnalyticsResponse {
  meta: AnalyticsMeta;
  requests: AnalyticsRequests;
  performance: AnalyticsPerformance;
  charts: AnalyticsCharts;
}
