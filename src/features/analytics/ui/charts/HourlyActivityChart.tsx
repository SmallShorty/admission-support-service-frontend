import { FC, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { HourlyActivityEntry } from "../../model/types";
import { useColorMode } from "@/shared/components/ui/color-mode";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface HourlyActivityChartProps {
  data: HourlyActivityEntry[];
}

export const HourlyActivityChart: FC<HourlyActivityChartProps> = ({ data }) => {
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.hour),
      datasets: [
        {
          label: "Входящие",
          data: data.map((d) => d.incoming),
          borderColor: colorMode === "dark" ? "#4FCCC9" : "#0AAEA4",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: "Разрешено",
          data: data.map((d) => d.resolved),
          borderColor: colorMode === "dark" ? "#86EFAC" : "#22C55E",
          borderDash: [5, 5],
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    };
  }, [data, colorMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" as const },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <Panel p="4" gridColumn={{ base: "1 / -1", lg: "1 / 2" }}>
      <Box h="300px" w="full">
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Panel>
  );
};
