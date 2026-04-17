import { FC, useMemo } from "react";
import { Box, Flex, Text, VStack, IconButton } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { Line } from "react-chartjs-2";
import { Clock, Info } from "lucide-react";
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

export const AvgResponseTimeStat: FC<AvgResponseTimeStatProps> = ({
  avgRT,
  hourlyActivity,
}) => {
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => ({
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
  }), [hourlyActivity, colorMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
  };

  const isImproving = avgRT.trend !== null && avgRT.trend < 0;
  const trendColor = avgRT.trend === null ? "fg.muted" : isImproving ? "teal.500" : "red.500";
  const trendArrow = avgRT.trend === null ? "" : isImproving ? "↘" : "↗";

  return (
    <Panel p="4" flex="1">
      <VStack align="stretch" gap="3">
        <Flex justify="space-between" align="flex-start">
          <Flex align="center" gap="3">
            <Flex
              align="center"
              justify="center"
              w="9"
              h="9"
              borderRadius="lg"
              bg="blue.100"
              _dark={{ bg: "blue.900" }}
              flexShrink={0}
            >
              <Clock size={18} color={colorMode === "dark" ? "#90CDF4" : "#2B6CB0"} />
            </Flex>
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" lineHeight="1.2">
                Среднее время ответа
              </Text>
              <Text fontSize="xs" color="fg.subtle">Average Response Time (ART)</Text>
            </Box>
          </Flex>
          <IconButton variant="ghost" size="xs" aria-label="Информация" color="fg.subtle">
            <Info size={14} />
          </IconButton>
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {formatSeconds(avgRT.value)}
        </Text>

        {avgRT.trend !== null && (
          <Text fontSize="sm" color={trendColor}>
            {trendArrow} {Math.abs(avgRT.trend).toFixed(1)}с за период
          </Text>
        )}

        {hourlyActivity.length > 0 && (
          <Box h="60px" w="full">
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </VStack>
    </Panel>
  );
};
