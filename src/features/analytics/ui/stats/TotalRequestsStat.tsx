import { FC } from "react";
import { Box, Flex, Text, VStack, Grid } from "@chakra-ui/react";
import { SectionCard } from "@shared/components/ui/section-card";
import { Activity } from "lucide-react";
import { AnalyticsRequests } from "../../model/types";

interface TotalRequestsStatProps {
  requests: AnalyticsRequests;
}

export const TotalRequestsStat: FC<TotalRequestsStatProps> = ({ requests }) => {
  const trendColor =
    requests.trend === null
      ? "fg.muted"
      : requests.trend.direction === "down"
        ? "teal.600"
        : requests.trend.direction === "up"
          ? "red.600"
          : "fg.muted";

  const trendColorDark =
    requests.trend === null
      ? "fg.muted"
      : requests.trend.direction === "down"
        ? "teal.300"
        : requests.trend.direction === "up"
          ? "red.300"
          : "fg.muted";

  const trendBg = requests.trend?.direction === "down" ? "teal.100" : "red.100";
  const trendBgDark = requests.trend?.direction === "down" ? "teal.900" : "red.900";

  const trendArrow =
    requests.trend === null
      ? ""
      : requests.trend.direction === "up"
        ? "↗"
        : requests.trend.direction === "down"
          ? "↘"
          : "→";

  return (
    <SectionCard
      icon={<Activity size={18} />}
      title="Всего заявок"
      description="Total Requests"
      colorScheme="green"
      tooltip="Всего заявок — общее количество обращений абитуриентов за выбранный период. Открытые — заявки, которые ещё находятся в работе. Закрытые — успешно завершённые обращения. Тренд показывает изменение объёма относительно предыдущего периода."
      flex="1"
    >
      <VStack align="stretch" gap="3">
        <Flex align="center" justify="space-between" gap="3">
          <Text fontSize="3xl" fontWeight="bold" lineHeight="1">
            {requests.total.toLocaleString("ru-RU")}
          </Text>
          {requests.trend && (
            <Box px="2" py="0.5" borderRadius="full" bg={trendBg} _dark={{ bg: trendBgDark }}>
              <Text fontSize="xs" fontWeight="semibold" color={trendColor} _dark={{ color: trendColorDark }}>
                {trendArrow} {requests.trend.percentage.toFixed(1)}%
              </Text>
            </Box>
          )}
        </Flex>

        <Grid templateColumns="1fr 1fr" gap="2">
          <Box p="3" borderRadius="lg" bg="orange.100" _dark={{ bg: "orange.900" }}>
            <Text fontSize="xs" color="fg.muted" mb="1">Открытых</Text>
            <Text fontSize="xl" fontWeight="bold" color="orange.500">{requests.open}</Text>
          </Box>
          <Box p="3" borderRadius="lg" bg="teal.100" _dark={{ bg: "teal.900" }}>
            <Text fontSize="xs" color="fg.muted" mb="1">Закрытых</Text>
            <Text fontSize="xl" fontWeight="bold" color="teal.500">{requests.resolved}</Text>
          </Box>
        </Grid>
      </VStack>
    </SectionCard>
  );
};
