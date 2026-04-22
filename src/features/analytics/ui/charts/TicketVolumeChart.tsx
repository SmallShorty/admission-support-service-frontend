import { FC, useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { SectionCard } from "@shared/components/ui/section-card";
import { Bar } from "react-chartjs-2";
import { BarChart3 } from "lucide-react";
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
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => {
    const incomingColor = colorMode === "dark" ? "#4FD1C5" : "#2C7A7B";
    const completedColor = colorMode === "dark" ? "#68D391" : "#38A169";

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
    <SectionCard
      icon={<BarChart3 size={18} />}
      title="Объём заявок"
      description="Ticket Volume"
      colorScheme="teal"
      tooltip="Объём заявок — сравнение входящих и завершённых обращений по временным интервалам. Позволяет отслеживать рабочую нагрузку команды и выявлять периоды пиковой активности."

    >
      <Box h="300px" w="full">
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </SectionCard>
  );
};
