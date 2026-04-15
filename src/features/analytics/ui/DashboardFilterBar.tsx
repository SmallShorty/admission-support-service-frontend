import { FC } from "react";
import { Flex, HStack, Text, Button, Input } from "@chakra-ui/react";
import { AnalyticsPeriod } from "../model/types";

interface DashboardFilterBarProps {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  agentId: string;
  onAgentIdChange: (agentId: string) => void;
  lastUpdated: string;
}

const PERIODS: AnalyticsPeriod[] = ["day", "week", "month"];

const periodLabels: Record<AnalyticsPeriod, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
};

export const DashboardFilterBar: FC<DashboardFilterBarProps> = ({
  period,
  onPeriodChange,
  agentId,
  onAgentIdChange,
  lastUpdated,
}) => {
  const formattedLastUpdated = new Date(lastUpdated).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Flex
      gap="4"
      align="center"
      justify="space-between"
      mb="6"
      flexWrap="wrap"
    >
      {/* Period selector */}
      <HStack gap="2">
        {PERIODS.map((p) => (
          <Button
            key={p}
            onClick={() => onPeriodChange(p)}
            colorPalette={period === p ? "teal" : "gray"}
            variant={period === p ? "solid" : "outline"}
            size="sm"
          >
            {periodLabels[p]}
          </Button>
        ))}
      </HStack>

      {/* Operator search */}
      <Input
        w={{ base: "full", md: "200px" }}
        placeholder="ID оператора..."
        value={agentId}
        onChange={(e) => onAgentIdChange(e.target.value)}
        size="sm"
      />

      {/* Last updated */}
      <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
        Обновлено: {formattedLastUpdated}
      </Text>
    </Flex>
  );
};
