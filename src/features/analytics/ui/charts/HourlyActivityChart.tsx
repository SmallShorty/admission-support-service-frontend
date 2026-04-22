import { FC, useMemo } from "react";
import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { SectionCard } from "@shared/components/ui/section-card";
import { Chart } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";
import { HourlyActivityEntry } from "../../model/types";
import { useColorMode } from "@/shared/components/ui/color-mode";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
);

interface HourlyActivityChartProps {
  data: HourlyActivityEntry[];
}

export const HourlyActivityChart: FC<HourlyActivityChartProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const peakEntry = useMemo(
    () => data.reduce((max, d) => (d.incoming > max.incoming ? d : max), data[0] ?? { hour: "—", incoming: 0, efficiency: 0 }),
    [data],
  );

  const avgEfficiency = useMemo(() => {
    if (!data.length) return 0;
    return Math.round(data.reduce((sum, d) => sum + d.efficiency, 0) / data.length);
  }, [data]);

  const totalResolved = useMemo(() => data.reduce((sum, d) => sum + d.resolved, 0), [data]);

  const chartData = useMemo(() => ({
    labels: data.map((d) => d.hour),
    datasets: [
      {
        type: "bar" as const,
        label: "Входящие",
        data: data.map((d) => d.incoming),
        backgroundColor: isDark ? "rgba(79,204,201,0.4)" : "rgba(10,174,164,0.25)",
        borderColor: isDark ? "#4FCCC9" : "#0AAEA4",
        borderWidth: 1,
        borderRadius: 3,
        yAxisID: "y",
      },
      {
        type: "bar" as const,
        label: "Разрешено",
        data: data.map((d) => d.resolved),
        backgroundColor: isDark ? "rgba(134,239,172,0.4)" : "rgba(34,197,94,0.25)",
        borderColor: isDark ? "#86EFAC" : "#16A34A",
        borderWidth: 1,
        borderRadius: 3,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Эффективность %",
        data: data.map((d) => d.efficiency),
        borderColor: isDark ? "#FBD38D" : "#D97706",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: isDark ? "#FBD38D" : "#D97706",
        yAxisID: "y2",
      },
    ],
  }), [data, isDark]);

  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "#718096" : "#A0AEC0";

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: { boxWidth: 12, padding: 16, color: tickColor, font: { size: 12 } },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 11 }, stepSize: 5 },
        title: { display: true, text: "Тикеты", color: tickColor, font: { size: 11 } },
      },
      y2: {
        beginAtZero: true,
        max: 100,
        position: "right" as const,
        grid: { display: false },
        ticks: {
          color: isDark ? "#FBD38D" : "#D97706",
          font: { size: 11 },
          callback: (v: number | string) => `${v}%`,
        },
        title: {
          display: true,
          text: "Эффективность",
          color: isDark ? "#FBD38D" : "#D97706",
          font: { size: 11 },
        },
      },
    },
  }), [gridColor, tickColor, isDark]);

  return (
    <SectionCard
      icon={<TrendingUp size={18} />}
      title="Активность по часам"
      description="Нагрузка и скорость обработки"
      colorScheme="blue"
      tooltip="Активность по часам — распределение входящих заявок и скорость их обработки по часам суток. Столбцы показывают входящие и разрешённые обращения, линия — эффективность (отношение разрешённых к входящим в %). Помогает определить оптимальное расписание смен."
      gridColumn={{ base: "1 / -1", lg: "1 / 2" }}
    >
      <Grid templateColumns="repeat(3, 1fr)" gap="3" mb="4">
        <Box>
          <Text fontSize="xs" color="fg.muted" mb="0.5">Пиковый час</Text>
          <Text fontSize="sm" fontWeight="bold">{peakEntry.hour}</Text>
          <Text fontSize="xs" color="fg.subtle">{peakEntry.incoming} входящих</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="fg.muted" mb="0.5">Ср. эффективность</Text>
          <Text fontSize="sm" fontWeight="bold" color={avgEfficiency >= 70 ? "teal.500" : "orange.500"}>
            {avgEfficiency}%
          </Text>
          <Text fontSize="xs" color="fg.subtle">разрешено / входящие</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="fg.muted" mb="0.5">Всего разрешено</Text>
          <Text fontSize="sm" fontWeight="bold" color="green.500">{totalResolved}</Text>
          <Text fontSize="xs" color="fg.subtle">за период</Text>
        </Box>
      </Grid>
      <Box h="380px" w="full">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </Box>
    </SectionCard>
  );
};
