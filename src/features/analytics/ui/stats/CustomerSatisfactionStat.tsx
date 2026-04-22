import { FC } from "react";
import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { SectionCard } from "@shared/components/ui/section-card";
import { Star } from "lucide-react";
import { MetricValue } from "../../model/types";

interface CustomerSatisfactionStatProps {
  csat: MetricValue;
}

const CSAT_THRESHOLD = 3.5;

export const CustomerSatisfactionStat: FC<CustomerSatisfactionStatProps> = ({ csat }) => {
  const value = csat.value ?? 0;
  const filledStars = Math.round(value);
  const isPositive = value >= CSAT_THRESHOLD;
  const progressPercent = (value / 5) * 100;

  const isImproving = csat.trend !== null && csat.trend > 0;
  const trendColor = csat.trend === null ? "fg.muted" : isImproving ? "teal.600" : "red.600";
  const trendColorDark = csat.trend === null ? "fg.muted" : isImproving ? "teal.300" : "red.300";
  const trendBg = isImproving ? "teal.100" : "red.100";
  const trendBgDark = isImproving ? "teal.900" : "red.900";
  const trendArrow = csat.trend === null ? "" : isImproving ? "↗" : "↘";

  return (
    <SectionCard
      icon={<Star size={18} />}
      title="Удовлетворенность"
      description="Customer Satisfaction (CSI)"
      colorScheme="orange"
      tooltip="Индекс удовлетворённости (CSI) — средняя оценка от 1 до 5, выставленная абитуриентами после завершения заявки. Оценка ниже 3.5 считается неудовлетворительной и требует внимания. Звёзды отражают округлённое значение, прогресс-бар — точную долю от максимума."
      flex="1"
    >
      {csat.value !== null ? (
        <VStack align="stretch" gap="3">
          <Flex align="center" justify="space-between" gap="3">
            <Flex align="baseline" gap="1">
              <Text fontSize="3xl" fontWeight="bold" lineHeight="1">{value.toFixed(1)}</Text>
              <Text fontSize="sm" color="fg.muted">/5</Text>
            </Flex>
            <Box
              px="3"
              py="1"
              borderRadius="full"
              bg={isPositive ? "teal.100" : "red.100"}
              _dark={{ bg: isPositive ? "teal.900" : "red.900" }}
            >
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={isPositive ? "teal.600" : "red.600"}
                _dark={{ color: isPositive ? "teal.300" : "red.300" }}
              >
                {isPositive ? "Хорошо" : "Ниже нормы"}
              </Text>
            </Box>
          </Flex>

          <HStack gap="1.5">
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

          {csat.trend !== null && (
            <Box
              display="inline-flex"
              px="2"
              py="0.5"
              borderRadius="full"
              bg={trendBg}
              _dark={{ bg: trendBgDark }}
              alignSelf="flex-start"
            >
              <Text fontSize="xs" fontWeight="semibold" color={trendColor} _dark={{ color: trendColorDark }}>
                {trendArrow} {Math.abs(csat.trend).toFixed(1)} за период
              </Text>
            </Box>
          )}

          <Box h="6px" bg="gray.200" borderRadius="full" overflow="hidden" _dark={{ bg: "gray.700" }}>
            <Box
              h="full"
              w={`${progressPercent}%`}
              bg={isPositive ? "orange.400" : "red.500"}
              borderRadius="full"
              transition="width 0.3s ease"
            />
          </Box>
        </VStack>
      ) : (
        <Text fontSize="sm" color="fg.muted">Нет данных</Text>
      )}
    </SectionCard>
  );
};
