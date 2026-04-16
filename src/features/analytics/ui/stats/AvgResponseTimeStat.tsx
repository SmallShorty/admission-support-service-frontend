import { FC, useMemo } from "react";
import { Box, Flex, Text, Badge, VStack } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { MetricValue, HourlyActivityEntry } from "../../model/types";
import { useColorMode } from "@/shared/components/ui/color-mode";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface AvgResponseTimeStatProps {
  avgRT: MetricValue;
  hourlyActivity: HourlyActivityEntry[];
}

const formatSeconds = (seconds: number | null): string => {
  if (seconds === null) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}м ${secs}с`;
};

const getTrendLabel = (trend: number | null): string => {
  if (trend === null) return "";
  if (trend > 0) return `+${trend.toFixed(1)}с`;
  return `${trend.toFixed(1)}с`;
};

export const AvgResponseTimeStat: FC<AvgResponseTimeStatProps> = ({
  avgRT,
  hourlyActivity,
}) => {
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => {
    return {
      labels: hourlyActivity.map((h) => h.hour),
      datasets: [
        {
          label: "Разрешено",
          data: hourlyActivity.map((h) => h.resolved),
          borderColor: colorMode === "dark" ? "#4FCCC9" : "#0AAEA4",
          backgroundColor: "transparent",
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };
  }, [hourlyActivity, colorMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
  };

  const trendColorPalette =
    avgRT.trend === null
      ? "gray"
      : avgRT.trend < 0
        ? "teal"
        : "red";

  return (
    <Panel p="4">
      <VStack align="stretch" gap="3">
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
            Среднее время ответа
          </Text>
          {avgRT.trend !== null && (
            <Badge colorPalette={trendColorPalette} variant="subtle" size="sm">
              {getTrendLabel(avgRT.trend)}
            </Badge>
          )}
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {formatSeconds(avgRT.value)}
        </Text>

        {hourlyActivity.length > 0 && (
          <Box h="60px" w="full">
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </VStack>
    </Panel>
  );
};
