import { Badge, Flex, Text } from "@chakra-ui/react";
import { IntentCategoryBadge } from "@/features/tickets/components/IntentCategoryBadge";
import { TicketListItem } from "@/features/tickets/model/types";
import { AdmissionIntentCategory, TicketStatus } from "@/features/tickets/model/types";

const STATUS_CONFIG: Record<TicketStatus, { label: string; colorPalette: string }> = {
  [TicketStatus.NEW]: { label: "Новый", colorPalette: "blue" },
  [TicketStatus.IN_PROGRESS]: { label: "В работе", colorPalette: "orange" },
  [TicketStatus.ESCALATED]: { label: "Эскалирован", colorPalette: "red" },
  [TicketStatus.RESOLVED]: { label: "Решён", colorPalette: "green" },
  [TicketStatus.CLOSED]: { label: "Закрыт", colorPalette: "gray" },
  [TicketStatus.AWAITING_FEEDBACK]: { label: "Ожидает отзыва", colorPalette: "purple" },
};

interface ChatHeaderProps {
  ticket: TicketListItem;
}

export const ChatHeader = ({ ticket }: ChatHeaderProps) => {
  const statusCfg = STATUS_CONFIG[ticket.status];

  return (
    <Flex
      align="center"
      gap="3"
      px="4"
      py="3"
      borderBottomWidth="1px"
      borderColor="border.muted"
      flexShrink={0}
    >
      <Flex direction="column" flex="1" minW="0">
        <Text fontWeight="semibold" fontSize="sm" truncate>
          {ticket.applicant.name ||
            `${ticket.applicant.firstName} ${ticket.applicant.lastName}`}
        </Text>
        <Text fontSize="xs" color="fg.muted" truncate>
          {ticket.applicant.email}
        </Text>
      </Flex>

      <Flex gap="2" align="center" flexShrink={0}>
        {ticket.category && (
          <IntentCategoryBadge
            category={ticket.category as AdmissionIntentCategory}
          />
        )}
        <Badge
          colorPalette={statusCfg.colorPalette}
          variant="surface"
          size="sm"
          borderRadius="md"
        >
          {statusCfg.label}
        </Badge>
        {ticket.priorityValue !== null && (
          <Badge
            variant="surface"
            size="sm"
            borderRadius="md"
            colorPalette={
              ticket.priorityValue >= 8
                ? "red"
                : ticket.priorityValue >= 5
                  ? "orange"
                  : "teal"
            }
          >
            P{ticket.priorityValue}
          </Badge>
        )}
      </Flex>
    </Flex>
  );
};
