import { coreApi } from "@/shared/axiosInstance";
import { AnalyticsResponse, AnalyticsPeriod } from "../model/types";

export const analyticsApi = {
  getAnalytics: async (
    period?: AnalyticsPeriod,
    agentId?: string
  ): Promise<AnalyticsResponse> => {
    const { data } = await coreApi.get<AnalyticsResponse>("/analytics", {
      params: { period, agentId },
    });
    return data;
  },
};
