import { FC, useState, useCallback, useMemo } from "react";
import { Box, Center, Spinner, Text, Grid, VStack } from "@chakra-ui/react";
import { useAnalytics } from "../hooks/queries/useAnalytics";
import { AnalyticsPeriod } from "../model/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { DashboardFilterBar } from "./DashboardFilterBar";
import { AvgResponseTimeStat } from "./stats/AvgResponseTimeStat";
import { SlaStatusStat } from "./stats/SlaStatusStat";
import { TotalRequestsStat } from "./stats/TotalRequestsStat";
import { CustomerSatisfactionStat } from "./stats/CustomerSatisfactionStat";
import { HourlyActivityChart } from "./charts/HourlyActivityChart";
import { TicketVolumeChart } from "./charts/TicketVolumeChart";
import { CategoryDistributionChart } from "./charts/CategoryDistributionChart";

export const AnalyticsDashboard: FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("week");
  const [agentId, setAgentId] = useState("");
  const debouncedAgentId = useDebounce(agentId, 500);

  const { data, isLoading, isError } = useAnalytics(
    period,
    debouncedAgentId || undefined
  );

  const handlePeriodChange = useCallback((newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod);
  }, []);

  const handleAgentIdChange = useCallback((newAgentId: string) => {
    setAgentId(newAgentId);
  }, []);

  if (isLoading) {
    return (
      <Center h="full" minH="600px">
        <Spinner size="lg" color="teal.500" />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Center h="full" minH="600px">
        <VStack gap="2">
          <Text fontSize="lg" fontWeight="semibold" color="red.500">
            Ошибка при загрузке данных
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Попробуйте обновить страницу
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: "4", md: "6" }}>
      {/* Filter Bar */}
      <DashboardFilterBar
        period={period}
        onPeriodChange={handlePeriodChange}
        agentId={agentId}
        onAgentIdChange={handleAgentIdChange}
        lastUpdated={data.meta.lastUpdated}
      />

      {/* Stats Grid - 2x2 responsive */}
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap="4"
        mb="6"
      >
        <AvgResponseTimeStat
          avgRT={data.performance.avgRT}
          hourlyActivity={data.charts.hourlyActivity}
        />
        <SlaStatusStat
          avgRT={data.performance.avgRT}
          isSlaBreached={data.performance.isSlaBreached}
        />
        <TotalRequestsStat requests={data.requests} />
        <CustomerSatisfactionStat csat={data.performance.csat} />
      </Grid>

      {/* Charts Grid */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap="4"
        mb="6"
      >
        <HourlyActivityChart data={data.charts.hourlyActivity} />
        <CategoryDistributionChart data={data.charts.categoryStats} />
      </Grid>

      {/* Ticket Volume Chart - Full Width */}
      <TicketVolumeChart data={data.charts.hourlyTicketVolume} />
    </Box>
  );
};
