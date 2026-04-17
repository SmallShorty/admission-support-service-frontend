import { FC } from "react";
import { Box, Flex, Text, VStack, Grid, IconButton } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { Activity, Info } from "lucide-react";
import { useColorMode } from "@/shared/components/ui/color-mode";
import { AnalyticsRequests } from "../../model/types";

interface TotalRequestsStatProps {
  requests: AnalyticsRequests;
}

export const TotalRequestsStat: FC<TotalRequestsStatProps> = ({ requests }) => {
  const { colorMode } = useColorMode();

  const trendColor =
    requests.trend === null
      ? "fg.muted"
      : requests.trend.direction === "down"
        ? "teal.500"
        : requests.trend.direction === "up"
          ? "red.500"
          : "fg.muted";

  const trendArrow =
    requests.trend === null
      ? ""
      : requests.trend.direction === "up"
        ? "↗"
        : requests.trend.direction === "down"
          ? "↘"
          : "→";

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
              bg="green.100"
              _dark={{ bg: "green.900" }}
              flexShrink={0}
            >
              <Activity size={18} color={colorMode === "dark" ? "#9AE6B4" : "#276749"} />
            </Flex>
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" lineHeight="1.2">
                Всего заявок
              </Text>
              <Text fontSize="xs" color="fg.subtle">Total Requests</Text>
            </Box>
          </Flex>
          <IconButton variant="ghost" size="xs" aria-label="Информация" color="fg.subtle">
            <Info size={14} />
          </IconButton>
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {requests.total.toLocaleString("ru-RU")}
        </Text>

        {requests.trend && (
          <Text fontSize="sm" color={trendColor}>
            {trendArrow} {requests.trend.percentage.toFixed(1)}% за период
          </Text>
        )}

        <Grid templateColumns="1fr 1fr" gap="3">
          <Box>
            <Text fontSize="xs" color="fg.muted" mb="1">Открытых</Text>
            <Text fontSize="lg" fontWeight="semibold" color="orange.500">{requests.open}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="fg.muted" mb="1">Закрытых</Text>
            <Text fontSize="lg" fontWeight="semibold" color="teal.500">{requests.resolved}</Text>
          </Box>
        </Grid>
      </VStack>
    </Panel>
  );
};
