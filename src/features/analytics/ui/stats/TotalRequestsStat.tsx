import { FC } from "react";
import { Box, Flex, Text, Badge, VStack, Grid, useRecipe } from "@chakra-ui/react";
import { AnalyticsRequests } from "../../model/types";

interface TotalRequestsStatProps {
  requests: AnalyticsRequests;
}

const getTrendArrow = (direction: "up" | "down" | "flat"): string => {
  switch (direction) {
    case "up":
      return "↑";
    case "down":
      return "↓";
    case "flat":
      return "→";
  }
};

export const TotalRequestsStat: FC<TotalRequestsStatProps> = ({ requests }) => {
  const cardRecipe = useRecipe({ key: "card" });

  return (
    <Box {...cardRecipe.base} p="4">
      <VStack align="stretch" gap="4">
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
            Всего заявок
          </Text>
          {requests.trend && (
            <Badge
              colorPalette={
                requests.trend.direction === "up"
                  ? "red"
                  : requests.trend.direction === "down"
                    ? "teal"
                    : "gray"
              }
              variant="subtle"
              size="sm"
            >
              {getTrendArrow(requests.trend.direction)} {requests.trend.percentage.toFixed(1)}%
            </Badge>
          )}
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {requests.total}
        </Text>

        <Grid templateColumns="1fr 1fr" gap="3">
          <Box>
            <Text fontSize="xs" color="fg.muted" mb="1">
              Открытые
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="orange.500">
              {requests.open}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="fg.muted" mb="1">
              Закрытые
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="teal.500">
              {requests.resolved}
            </Text>
          </Box>
        </Grid>
      </VStack>
    </Box>
  );
};
