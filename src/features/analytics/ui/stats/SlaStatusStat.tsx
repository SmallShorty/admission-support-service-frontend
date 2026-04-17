import { FC } from "react";
import { Box, Flex, Text, VStack, IconButton } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { CheckCircle2, Info } from "lucide-react";
import { useColorMode } from "@/shared/components/ui/color-mode";
import { MetricValue } from "../../model/types";

interface SlaStatusStatProps {
  avgRT: MetricValue;
  isSlaBreached: boolean;
}

const SLA_THRESHOLD = 720;

const formatSeconds = (seconds: number | null): string => {
  if (seconds === null) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return secs === 0 ? `${mins}м` : `${mins}м ${secs}с`;
};

export const SlaStatusStat: FC<SlaStatusStatProps> = ({ avgRT, isSlaBreached }) => {
  const { colorMode } = useColorMode();
  const progressPercent =
    avgRT.value !== null ? Math.min((avgRT.value / SLA_THRESHOLD) * 100, 100) : 0;

  const isImproving = avgRT.trend !== null && avgRT.trend < 0;
  const trendColor = avgRT.trend === null ? "fg.muted" : isImproving ? "teal.500" : "red.500";
  const trendArrow = avgRT.trend === null ? "" : isImproving ? "↘" : "↗";

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
              bg="purple.100"
              _dark={{ bg: "purple.900" }}
              flexShrink={0}
            >
              <CheckCircle2 size={18} color={colorMode === "dark" ? "#D6BCFA" : "#6B46C1"} />
            </Flex>
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" lineHeight="1.2">
                SLA статус
              </Text>
              <Text fontSize="xs" color="fg.subtle">Average Resolution Time (RT)</Text>
            </Box>
          </Flex>
          <IconButton variant="ghost" size="xs" aria-label="Информация" color="fg.subtle">
            <Info size={14} />
          </IconButton>
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {formatSeconds(avgRT.value)}
        </Text>

        {avgRT.trend !== null && (
          <Text fontSize="sm" color={trendColor}>
            {trendArrow} {Math.abs(avgRT.trend).toFixed(1)}с за период
          </Text>
        )}

        <Box>
          <Flex justify="space-between" align="center" mb="1">
            <Text fontSize="xs" color="fg.muted">Целевое время:</Text>
            <Text fontSize="xs" fontWeight="semibold">12м</Text>
          </Flex>
          <Box h="8px" bg="gray.200" borderRadius="full" overflow="hidden" _dark={{ bg: "gray.700" }}>
            <Box
              h="full"
              w={`${progressPercent}%`}
              bg={isSlaBreached ? "red.500" : "purple.500"}
              transition="width 0.3s ease"
            />
          </Box>
        </Box>
      </VStack>
    </Panel>
  );
};
