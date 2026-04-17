import { FC } from "react";
import { Box, Flex, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { Star, Info } from "lucide-react";
import { useColorMode } from "@/shared/components/ui/color-mode";
import { MetricValue } from "../../model/types";

interface CustomerSatisfactionStatProps {
  csat: MetricValue;
}

const CSAT_THRESHOLD = 3.5;

export const CustomerSatisfactionStat: FC<CustomerSatisfactionStatProps> = ({ csat }) => {
  const { colorMode } = useColorMode();
  const value = csat.value ?? 0;
  const filledStars = Math.round(value);
  const isPositive = value >= CSAT_THRESHOLD;
  const progressPercent = (value / 5) * 100;

  const isImproving = csat.trend !== null && csat.trend > 0;
  const trendColor = csat.trend === null ? "fg.muted" : isImproving ? "teal.500" : "red.500";
  const trendArrow = csat.trend === null ? "" : isImproving ? "↗" : "↘";

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
              bg="orange.100"
              _dark={{ bg: "orange.900" }}
              flexShrink={0}
            >
              <Star size={18} color={colorMode === "dark" ? "#FBD38D" : "#C05621"} />
            </Flex>
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" lineHeight="1.2">
                Удовлетворенность
              </Text>
              <Text fontSize="xs" color="fg.subtle">Customer Satisfaction (CSI)</Text>
            </Box>
          </Flex>
          <IconButton variant="ghost" size="xs" aria-label="Информация" color="fg.subtle">
            <Info size={14} />
          </IconButton>
        </Flex>

        {csat.value !== null ? (
          <>
            <Text fontSize="2xl" fontWeight="bold">{value.toFixed(1)}</Text>

            <HStack gap="1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < filledStars ? "#FCD34D" : "none"}
                  stroke={i < filledStars ? "#FCD34D" : "#D1D5DB"}
                  color={i < filledStars ? "#FCD34D" : "#D1D5DB"}
                />
              ))}
              <Text fontSize="xs" color="fg.muted" ml="1">из 5</Text>
            </HStack>

            {csat.trend !== null && (
              <Text fontSize="sm" color={trendColor}>
                {trendArrow} {Math.abs(csat.trend).toFixed(1)} за период
              </Text>
            )}

            <Box h="8px" bg="gray.200" borderRadius="full" overflow="hidden" _dark={{ bg: "gray.700" }}>
              <Box
                h="full"
                w={`${progressPercent}%`}
                bg={isPositive ? "teal.500" : "red.500"}
                transition="width 0.3s ease"
              />
            </Box>
          </>
        ) : (
          <Text fontSize="sm" color="fg.muted">Нет данных</Text>
        )}
      </VStack>
    </Panel>
  );
};
