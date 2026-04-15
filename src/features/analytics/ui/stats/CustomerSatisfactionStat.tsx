import { FC } from "react";
import { Box, Flex, Text, Badge, VStack, HStack, useRecipe } from "@chakra-ui/react";
import { Star } from "lucide-react";
import { MetricValue } from "../../model/types";

interface CustomerSatisfactionStatProps {
  csat: MetricValue;
}

const CSAT_THRESHOLD = 3.5;

export const CustomerSatisfactionStat: FC<CustomerSatisfactionStatProps> = ({
  csat,
}) => {
  const cardRecipe = useRecipe({ key: "card" });
  const value = csat.value ?? 0;
  const filledStars = Math.round(value);
  const isPositive = value >= CSAT_THRESHOLD;
  const progressPercent = (value / 5) * 100;

  const getTrendLabel = (): string => {
    if (csat.trend === null) return "";
    if (csat.trend > 0) return `+${csat.trend.toFixed(1)}`;
    return `${csat.trend.toFixed(1)}`;
  };

  return (
    <Box {...cardRecipe.base} p="4">
      <VStack align="stretch" gap="3">
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
            Удовлетворенность
          </Text>
          {csat.trend !== null && (
            <Badge
              colorPalette={csat.trend > 0 ? "teal" : "red"}
              variant="subtle"
              size="sm"
            >
              {getTrendLabel()}
            </Badge>
          )}
        </Flex>

        {csat.value !== null && (
          <>
            <HStack gap="1" justify="center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < filledStars ? "#FCD34D" : "none"}
                  stroke={i < filledStars ? "#FCD34D" : "#D1D5DB"}
                  color={i < filledStars ? "#FCD34D" : "#D1D5DB"}
                />
              ))}
            </HStack>

            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              {value.toFixed(1)} / 5
            </Text>
          </>
        )}

        {csat.value === null && (
          <Text fontSize="sm" color="fg.muted" textAlign="center">
            Нет данных
          </Text>
        )}

        {csat.value !== null && (
          <Box
            h="8px"
            bg="gray.200"
            borderRadius="full"
            overflow="hidden"
            _dark={{ bg: "gray.700" }}
          >
            <Box
              h="full"
              w={`${progressPercent}%`}
              bg={isPositive ? "teal.500" : "red.500"}
              transition="width 0.3s ease"
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};
