import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../api/analyticsApi";
import { analyticsKeys } from "./queryKeys";
import { AnalyticsPeriod } from "../../model/types";

export const useAnalytics = (period?: AnalyticsPeriod, agentId?: string) => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(period, agentId),
    queryFn: () => analyticsApi.getAnalytics(period, agentId),
    staleTime: 2 * 60 * 1000,
  });
};
