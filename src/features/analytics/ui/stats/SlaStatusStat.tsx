import { FC } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { SectionCard } from "@shared/components/ui/section-card";
import { CheckCircle2 } from "lucide-react";
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
  const progressPercent =
    avgRT.value !== null ? Math.min((avgRT.value / SLA_THRESHOLD) * 100, 100) : 0;

  const isImproving = avgRT.trend !== null && avgRT.trend < 0;
  const trendColor = avgRT.trend === null ? "fg.muted" : isImproving ? "teal.600" : "red.600";
  const trendColorDark = avgRT.trend === null ? "fg.muted" : isImproving ? "teal.300" : "red.300";
  const trendBg = isImproving ? "teal.100" : "red.100";
  const trendBgDark = isImproving ? "teal.900" : "red.900";
  const trendArrow = avgRT.trend === null ? "" : isImproving ? "↘" : "↗";

  return (
    <SectionCard
      icon={<CheckCircle2 size={18} />}
      title="SLA статус"
      description="Average Resolution Time"
      colorScheme="purple"
      tooltip="SLA статус — показывает, соблюдается ли соглашение об уровне обслуживания. Целевое время обработки заявки: 12 минут. Прогресс-бар отражает текущую нагрузку относительно этого порога. При превышении — статус меняется на «Нарушен»."
      flex="1"
    >
      <VStack align="stretch" gap="3">
        <Flex align="center" justify="space-between" gap="3">
          <Text fontSize="3xl" fontWeight="bold" lineHeight="1">
            {formatSeconds(avgRT.value)}
          </Text>
          <Box
            px="3"
            py="1"
            borderRadius="full"
            bg={isSlaBreached ? "red.100" : "teal.100"}
            _dark={{ bg: isSlaBreached ? "red.900" : "teal.900" }}
          >
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color={isSlaBreached ? "red.600" : "teal.600"}
              _dark={{ color: isSlaBreached ? "red.300" : "teal.300" }}
            >
              {isSlaBreached ? "Нарушен" : "Соблюдён"}
            </Text>
          </Box>
        </Flex>

        {avgRT.trend !== null && (
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
              {trendArrow} {Math.abs(avgRT.trend).toFixed(1)}с за период
            </Text>
          </Box>
        )}

        <Box>
          <Flex justify="space-between" align="center" mb="1.5">
            <Text fontSize="xs" color="fg.muted">Загруженность SLA</Text>
            <Text fontSize="xs" fontWeight="semibold" color={isSlaBreached ? "red.500" : "fg.default"}>
              {progressPercent.toFixed(0)}%
            </Text>
          </Flex>
          <Box h="6px" bg="gray.200" borderRadius="full" overflow="hidden" _dark={{ bg: "gray.700" }}>
            <Box
              h="full"
              w={`${progressPercent}%`}
              bg={isSlaBreached ? "red.500" : "purple.500"}
              borderRadius="full"
              transition="width 0.3s ease"
            />
          </Box>
          <Flex justify="space-between" mt="1">
            <Text fontSize="xs" color="fg.subtle">0</Text>
            <Text fontSize="xs" color="fg.subtle">Цель: 12м</Text>
          </Flex>
        </Box>
      </VStack>
    </SectionCard>
  );
};
