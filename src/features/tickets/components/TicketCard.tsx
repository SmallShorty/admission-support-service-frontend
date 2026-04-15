import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  Icon,
  Separator,
  useRecipe,
} from "@chakra-ui/react";
import { Clock } from "lucide-react";
import { IntentCategoryBadge } from "./IntentCategoryBadge";
import { AdmissionIntentCategory, TicketStatus } from "../model/types";

interface TicketCardProps {
  id: string;
  applicant: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
  };
  category: string | null;
  status: TicketStatus;
  priorityValue: number | null;
  isSelected: boolean;
  onSelect: (id: string) => void;
  createdAt: string | Date;
  lastMessageAt: string | Date;
  cardVariant?: "editable";
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
  cardVariant,
}: TicketCardProps) => {
  const isWorking = status === TicketStatus.IN_PROGRESS;
  const cardRecipe = useRecipe({ key: "card" });
  const cardStyles = cardRecipe({ variant: cardVariant });

  const getPriorityPalette = (val: number) => {
    if (val >= 8) return "red";
    if (val >= 5) return "orange";
    return "teal";
  };

  const displayName = `${applicant.firstName} ${applicant.lastName}`;

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("ru-RU");
  };

  const formatDateTime = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <Box
      onClick={() => onSelect?.(applicant.id)}
      css={cardStyles}
      p="3"
      borderRadius="xl"
      position="relative"
      borderWidth="1px"
      bg="bg.panel"
      borderColor={isSelected ? "teal.500" : "gray.200"}
      transform={isWorking && !isSelected ? "translateY(-4px)" : "none"}
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
          colorPalette={getPriorityPalette(priorityValue!)}
          size="sm"
          borderRadius="md"
          width="25px"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
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

      <Separator borderColor="gray.50" />

      {/* Footer */}
      <Flex
        mt="3"
        pt="2.5"
        borderTopWidth="1px"
        align="center"
        justify="space-between"
        fontSize="10px"
        borderColor={isSelected || isWorking ? "teal.200/50" : "gray.50"}
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
              {formatDate(createdAt)}
            </Text>
          </Text>
        </HStack>

        <HStack gap="1.5" color="fg.muted">
          <Box
            w="1.5"
            h="1.5"
            borderRadius="full"
            bg={isSelected || isWorking ? "teal.500" : "border.emphasized"}
          />
          <Text>
            Изменено:{" "}
            <Text
              as="span"
              fontWeight="medium"
              color={isSelected || isWorking ? "teal.700" : "fg.default"}
            >
              {formatDateTime(lastMessageAt)}
            </Text>
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};
