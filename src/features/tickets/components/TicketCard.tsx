import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  Icon,
  Separator,
} from "@chakra-ui/react";
import { Clock } from "lucide-react";
import { IntentCategoryBadge } from "./IntentCategoryBadge";
import { AdmissionIntentCategory, TicketStatus } from "../model/types";

interface TicketCardProps {
  applicant: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  category: string;
  status: TicketStatus;
  priorityValue: number;
  createdAt: string;
  lastMessageAt: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export const TicketCard = ({
  applicant,
  category,
  status,
  priorityValue,
  createdAt,
  lastMessageAt,
  isSelected,
  onSelect,
  className,
}: TicketCardProps) => {
  const isWorking = status === TicketStatus.IN_PROGRESS;

  const getPriorityPalette = (val: number) => {
    if (val >= 8) return "red";
    if (val >= 5) return "orange";
    return "teal";
  };

  const displayName = `${applicant.firstName} ${applicant.lastName}`;

  return (
    <Box
      className={className}
      onClick={() => onSelect?.(applicant.id)}
      cursor="pointer"
      p="3"
      borderRadius="xl"
      transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
      position="relative"
      // БАЗОВЫЕ СТИЛИ
      borderWidth="1px"
      bg="bg.panel"
      // ЭФФЕКТ LEVITATION (для IN_PROGRESS)
      // Если тикет в работе — поднимаем его и даем тень
      // Если выбран — добавляем четкую рамку
      borderColor={isSelected ? "teal.500" : "border.subtle"}
      shadow={isSelected ? "md" : isWorking ? "lg" : "none"}
      transform={isWorking && !isSelected ? "translateY(-4px)" : "none"}
      _hover={{
        shadow: "xl",
        transform: "translateY(-4px)",
        borderColor: isSelected ? "teal.500" : "teal.300",
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb="2" gap="2">
        <Text
          fontSize="sm"
          fontWeight="bold"
          truncate
          color={isSelected ? "teal.700" : "fg.default"}
        >
          {displayName}
        </Text>
        <Badge
          variant="solid"
          colorPalette={getPriorityPalette(priorityValue)}
          size="sm"
          borderRadius="md"
        >
          {priorityValue}
        </Badge>
      </Flex>

      {/* Tags */}
      <HStack gap="2" mb="3" wrap="wrap">
        <IntentCategoryBadge
          category={category as AdmissionIntentCategory}
          showIcon
        />
      </HStack>

      {/* Body */}
      <Text fontSize="xs" color="fg.muted" lineClamp={2} mb="3">
        Нажмите, чтобы просмотреть историю переписки и детали запроса...
      </Text>

      <Separator borderColor="border.subtle/50" />

      {/* Footer */}
      <Flex
        mt="3"
        pt="2.5"
        borderTopWidth="1px"
        align="center"
        justify="space-between"
        fontSize="10px"
        borderColor={
          isSelected || isWorking ? "teal.200/50" : "border.subtle/50"
        }
      >
        <HStack gap="1.5" color="fg.muted">
          <Icon
            asChild
            color={isSelected || isWorking ? "teal.500" : "fg.muted"}
          >
            <Clock size={11} />
          </Icon>
          <Text>
            Создано:{" "}
            <Text
              as="span"
              fontWeight="medium"
              color={isSelected || isWorking ? "teal.700" : "fg.default"}
            >
              {createdAt}
            </Text>
          </Text>
        </HStack>

        <HStack gap="1.5" color="fg.muted">
          <Box
            w="1.5"
            h="1.5"
            borderRadius="full"
            bg={isSelected || isWorking ? "teal.500" : "border.emphasized"}
            // Добавим пульсацию для эффекта "живого" тикета
            animation={isWorking ? "pulse 2s infinite" : "none"}
            css={{
              "@keyframes pulse": {
                "0%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.5, transform: "scale(1.2)" },
                "100%": { opacity: 1, transform: "scale(1)" },
              },
            }}
          />
          <Text>
            Изменено:{" "}
            <Text
              as="span"
              fontWeight="medium"
              color={isSelected || isWorking ? "teal.700" : "fg.default"}
            >
              {lastMessageAt}
            </Text>
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};
