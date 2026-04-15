import { FC, useMemo } from "react";
import { Box, useRecipe } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { HourlyVolumeEntry } from "../../model/types";
import { useColorMode } from "@/shared/components/ui/color-mode";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TicketVolumeChartProps {
  data: HourlyVolumeEntry[];
}

export const TicketVolumeChart: FC<TicketVolumeChartProps> = ({ data }) => {
  const cardRecipe = useRecipe({ key: "card" });
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Входящие",
          data: data.map((d) => d.incoming),
          backgroundColor: colorMode === "dark" ? "#4FCCC9" : "#0AAEA4",
          borderRadius: 4,
          opacity: 0.8,
        },
        {
          label: "Завершено",
          data: data.map((d) => d.completed),
          backgroundColor: colorMode === "dark" ? "#86EFAC" : "#22C55E",
          borderRadius: 4,
          opacity: 0.8,
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
        ticks: { stepSize: 20 },
      },
    },
  };

  return (
    <Box {...cardRecipe.base} p="4" gridColumn={{ base: "1 / -1" }}>
      <Box h="300px" w="full">
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};
