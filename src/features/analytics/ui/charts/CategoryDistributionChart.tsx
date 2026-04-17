import { FC, useMemo } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AdmissionIntentCategory, CategoryStatEntry } from "../../model/types";
import { useColorMode } from "@/shared/components/ui/color-mode";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryDistributionChartProps {
  data: CategoryStatEntry[];
}

const CATEGORY_COLORS: Record<AdmissionIntentCategory, string> = {
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

const categoryLabels: Record<AdmissionIntentCategory, string> = {
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

export const CategoryDistributionChart: FC<CategoryDistributionChartProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const totalCount = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data],
  );

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data],
  );

  const topCategory = sorted[0];

  const chartData = useMemo(() => ({
    labels: sorted.map((d) => categoryLabels[d.category as AdmissionIntentCategory] || d.category),
    datasets: [
      {
        data: sorted.map((d) => d.count),
        backgroundColor: sorted.map((d) => CATEGORY_COLORS[d.category as AdmissionIntentCategory]),
        borderColor: isDark ? "#1A202C" : "#FFFFFF",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  }), [sorted, isDark]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: { label: string; raw: unknown; dataset: { data: unknown[] } }) => {
            const pct = ((Number(ctx.raw) / totalCount) * 100).toFixed(1);
            return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <Panel p="4" gridColumn={{ base: "1 / -1", lg: "2 / 3" }}>
        <VStack h="380px" justify="center" gap="2">
          <Text color="fg.muted" textAlign="center">Нет данных по категориям</Text>
        </VStack>
      </Panel>
    );
  }

  return (
    <Panel p="4" gridColumn={{ base: "1 / -1", lg: "2 / 3" }}>
      <VStack align="stretch" gap="4" h="full">
        <Box>
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
            Распределение по категориям
          </Text>
          {topCategory && (
            <Text fontSize="xs" color="fg.subtle">
              Лидер: <Box as="span" fontWeight="semibold" color="fg.default">
                {categoryLabels[topCategory.category as AdmissionIntentCategory]}
              </Box>
              {" "}— {topCategory.percentage.toFixed(1)}%
            </Text>
          )}
        </Box>

        <Box position="relative" h="180px" flexShrink={0}>
          <Doughnut data={chartData} options={chartOptions} />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            pointerEvents="none"
          >
            <Text fontSize="2xl" fontWeight="bold" lineHeight="1">{totalCount}</Text>
            <Text fontSize="xs" color="fg.muted">заявок</Text>
          </Box>
        </Box>

        <VStack align="stretch" gap="1.5" overflowY="auto" flex="1" minH="0">
          {sorted.map((entry) => {
            const color = CATEGORY_COLORS[entry.category as AdmissionIntentCategory];
            const label = categoryLabels[entry.category as AdmissionIntentCategory] || entry.category;
            return (
              <Box key={entry.category}>
                <Flex justify="space-between" align="center" mb="0.5">
                  <Flex align="center" gap="1.5" minW="0">
                    <Box w="2" h="2" borderRadius="full" bg={color} flexShrink={0} />
                    <Text fontSize="xs" color="fg.default" truncate>{label}</Text>
                  </Flex>
                  <Flex align="center" gap="2" flexShrink={0} ml="2">
                    <Text fontSize="xs" color="fg.muted">{entry.count}</Text>
                    <Text fontSize="xs" fontWeight="semibold" color="fg.default" w="8" textAlign="right">
                      {entry.percentage.toFixed(1)}%
                    </Text>
                  </Flex>
                </Flex>
                <Box h="3px" bg={isDark ? "whiteAlpha.100" : "blackAlpha.100"} borderRadius="full" overflow="hidden">
                  <Box
                    h="full"
                    w={`${entry.percentage}%`}
                    bg={color}
                    borderRadius="full"
                    transition="width 0.4s ease"
                  />
                </Box>
              </Box>
            );
          })}
        </VStack>
      </VStack>
    </Panel>
  );
};
