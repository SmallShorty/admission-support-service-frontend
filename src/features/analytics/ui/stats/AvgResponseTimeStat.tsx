import { FC, useMemo } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { SectionCard } from "@shared/components/ui/section-card";
import { Line } from "react-chartjs-2";
import { Clock } from "lucide-react";
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
  const trendColor = avgRT.trend === null ? "fg.muted" : isImproving ? "teal.600" : "red.600";
  const trendColorDark = avgRT.trend === null ? "fg.muted" : isImproving ? "teal.300" : "red.300";
  const trendBg = isImproving ? "teal.100" : "red.100";
  const trendBgDark = isImproving ? "teal.900" : "red.900";
  const trendArrow = avgRT.trend === null ? "" : isImproving ? "↘" : "↗";

  return (
    <SectionCard
      icon={<Clock size={18} />}
      title="Среднее время ответа"
      description="Average Response Time"
      colorScheme="blue"
      tooltip="Среднее время ответа (ART) — измеряет среднее время от взятия заявки оператором до первого ответа абитуриенту. Чем ниже показатель, тем быстрее команда реагирует на обращения. Рассчитывается по всем закрытым заявкам за выбранный период."
      flex="1"
    >
      <VStack align="stretch" gap="3">
        <Flex align="center" justify="space-between" gap="3">
          <Text fontSize="3xl" fontWeight="bold" lineHeight="1">
            {formatSeconds(avgRT.value)}
          </Text>
          {avgRT.trend !== null && (
            <Box px="2" py="0.5" borderRadius="full" bg={trendBg} _dark={{ bg: trendBgDark }}>
              <Text fontSize="xs" fontWeight="semibold" color={trendColor} _dark={{ color: trendColorDark }}>
                {trendArrow} {Math.abs(avgRT.trend).toFixed(1)}с
              </Text>
            </Box>
          )}
        </Flex>

        {hourlyActivity.length > 0 && (
          <Box h="64px" w="full">
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </VStack>
    </SectionCard>
  );
};
