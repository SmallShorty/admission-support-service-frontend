import { FC, useMemo } from "react";
import { Box, Text, VStack, useRecipe } from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { CategoryStatEntry } from "../../model/types";
import { useColorMode } from "@/shared/components/ui/color-mode";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryDistributionChartProps {
  data: CategoryStatEntry[];
}

// Fixed color palette for categories (12 colors)
const CATEGORY_COLORS = {
  TECHNICAL_ISSUES: "#EF4444",
  DEADLINES_TIMELINES: "#F97316",
  DOCUMENT_SUBMISSION: "#EAB308",
  STATUS_VERIFICATION: "#84CC16",
  SCORES_COMPETITION: "#22C55E",
  PAYMENTS_CONTRACTS: "#10B981",
  ENROLLMENT: "#14B8A6",
  DORMITORY_HOUSING: "#06B6D4",
  STUDIES_SCHEDULE: "#0EA5E9",
  EVENTS: "#3B82F6",
  GENERAL_INFO: "#8B5CF6",
  PROGRAM_CONSULTATION: "#D946EF",
};

const categoryLabels: Record<string, string> = {
  TECHNICAL_ISSUES: "Технические проблемы",
  DEADLINES_TIMELINES: "Сроки и графики",
  DOCUMENT_SUBMISSION: "Подача документов",
  STATUS_VERIFICATION: "Проверка статуса",
  SCORES_COMPETITION: "Баллы и конкурс",
  PAYMENTS_CONTRACTS: "Платежи и контракты",
  ENROLLMENT: "Зачисление",
  DORMITORY_HOUSING: "Общежитие",
  STUDIES_SCHEDULE: "Расписание занятий",
  EVENTS: "События",
  GENERAL_INFO: "Общая информация",
  PROGRAM_CONSULTATION: "Консультация по программе",
};

export const CategoryDistributionChart: FC<CategoryDistributionChartProps> = ({
  data,
}) => {
  const cardRecipe = useRecipe({ key: "card" });
  const { colorMode } = useColorMode();

  const totalCount = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data]);

  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => categoryLabels[d.category] || d.category),
      datasets: [
        {
          data: data.map((d) => d.count),
          backgroundColor: data.map((d) => CATEGORY_COLORS[d.category]),
          borderColor: colorMode === "dark" ? "#1F2937" : "#FFFFFF",
          borderWidth: 2,
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
        position: "bottom" as const,
      },
      tooltip: { enabled: true },
    },
  };

  if (data.length === 0) {
    return (
      <Box {...cardRecipe.base} p="4" gridColumn={{ base: "1 / -1", lg: "2 / 3" }}>
        <VStack h="300px" justify="center" gap="2">
          <Text color="fg.muted" textAlign="center">
            Нет данных по категориям
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box {...cardRecipe.base} p="4" gridColumn={{ base: "1 / -1", lg: "2 / 3" }} position="relative">
      <Box h="300px" w="full" position="relative">
        <Doughnut data={chartData} options={chartOptions} />
        {/* Center overlay with total count */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          pointerEvents="none"
        >
          <Text fontSize="2xl" fontWeight="bold">
            {totalCount}
          </Text>
          <Text fontSize="xs" color="fg.muted">
            заявок
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
