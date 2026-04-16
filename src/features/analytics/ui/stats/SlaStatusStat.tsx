import { FC } from "react";
import { Box, Flex, Text, Badge, VStack } from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { MetricValue } from "../../model/types";

interface SlaStatusStatProps {
  avgRT: MetricValue;
  isSlaBreached: boolean;
}

const SLA_THRESHOLD = 720; // 12 minutes in seconds

const formatSeconds = (seconds: number | null): string => {
  if (seconds === null) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}м ${secs}с`;
};

export const SlaStatusStat: FC<SlaStatusStatProps> = ({
  avgRT,
  isSlaBreached,
}) => {
  const progressPercent =
    avgRT.value !== null
      ? Math.min((avgRT.value / SLA_THRESHOLD) * 100, 100)
      : 0;

  return (
    <Panel p="4">
      <VStack align="stretch" gap="3">
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
            SLA статус
          </Text>
          <Badge
            colorPalette={isSlaBreached ? "red" : "teal"}
            variant={isSlaBreached ? "solid" : "subtle"}
            size="sm"
          >
            {isSlaBreached ? "Нарушено" : "OK"}
          </Badge>
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {formatSeconds(avgRT.value)}
        </Text>

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
            bg={isSlaBreached ? "red.500" : "teal.500"}
            transition="width 0.3s ease"
          />
        </Box>

        <Text fontSize="xs" color="fg.muted">
          Цель: 12 мин
        </Text>
      </VStack>
    </Panel>
  );
};
