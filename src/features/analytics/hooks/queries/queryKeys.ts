import { AnalyticsPeriod } from "../../model/types";

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: (period?: AnalyticsPeriod, agentId?: string) =>
    [...analyticsKeys.all, "dashboard", { period, agentId }] as const,
};
