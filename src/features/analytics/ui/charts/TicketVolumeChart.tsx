import { FC, useEffect, useMemo } from "react";
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

// Регистрация необходимых модулей Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TicketVolumeChartProps {
  data: HourlyVolumeEntry[];
}

export const TicketVolumeChart: FC<TicketVolumeChartProps> = ({ data }) => {
  const cardRecipe = useRecipe({ key: "card" });
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => {
    const incomingColor = colorMode === "dark" ? "#4FD1C5" : "#2C7A7B"; // Teal / Turquoise
    const completedColor = colorMode === "dark" ? "#68D391" : "#38A169"; // Green

    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Входящие",
          data: data.map((d) => {
            const val = d.incoming > 0 ? d.incoming : d.count || 0;
            return Number(val);
          }),
          backgroundColor: incomingColor,
          borderRadius: 4,
          // minBarLength позволяет видеть тонкую полоску даже при значении 0
          minBarLength: 5,
        },
        {
          label: "Завершено",
          data: data.map((d) => d.completed),
          backgroundColor: completedColor,
          borderRadius: 4,
          minBarLength: 5,
        },
      ],
    };
  }, [data, colorMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
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
