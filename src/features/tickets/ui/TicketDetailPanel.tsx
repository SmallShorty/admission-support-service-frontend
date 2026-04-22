import React from "react";
import {
  Badge,
  Box,
  Button,
  createListCollection,
  Dialog,
  Flex,
  IconButton,
  Menu,
  Portal,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { MoreHorizontal, AlertTriangle, StickyNote, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useTicketDetail } from "../hooks/queries/useTicketDetail";
import { useTakeTicket } from "../hooks/mutations/useTakeTicket";
import { useUpdateTicketStatus } from "../hooks/mutations/useUpdateTicketStatus";
import { useEscalateTicket } from "../hooks/mutations/useEscalateTicket";
import { openEscalateModal, closeEscalateModal } from "../model/ticketsSlice";
import {
  TicketStatus,
  EscalationCause,
  EscalateTicketPayload,
} from "../model/types";
import { IntentCategoryBadge } from "../components/IntentCategoryBadge";

const ESCALATION_CAUSE_LABELS: Record<EscalationCause, string> = {
  [EscalationCause.COMPLEX_ISSUE]: "Сложный вопрос",
  [EscalationCause.INSUFFICIENT_RIGHTS]: "Недостаточно прав",
  [EscalationCause.CUSTOMER_COMPLAINT]: "Жалоба клиента",
  [EscalationCause.TECHNICAL_FAILURE]: "Технический сбой",
  [EscalationCause.TIMEOUT]: "Истекло время",
  [EscalationCause.OTHER]: "Другое",
};

const escalationCauses = createListCollection({
  items: Object.entries(ESCALATION_CAUSE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface TicketDetailPanelProps {
  ticketId: string;
}

export const TicketDetailPanel = ({ ticketId }: TicketDetailPanelProps) => {
  const dispatch = useAppDispatch();
  const isEscalateModalOpen = useAppSelector(
    (state) => state.tickets.isEscalateModalOpen,
  );
  const [escalateCause, setEscalateCause] = React.useState<EscalationCause>(
    EscalationCause.COMPLEX_ISSUE,
  );
  const [escalateComment, setEscalateComment] = React.useState("");

  const { data: ticket, isLoading } = useTicketDetail(ticketId);
  const { mutate: takeTicket, isPending: isTaking } = useTakeTicket();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateTicketStatus();
  const { mutate: escalateTicket, isPending: isEscalating } =
    useEscalateTicket();

  if (isLoading) {
    return (
      <Flex h="full" align="center" justify="center">
        <Spinner size="sm" />
      </Flex>
    );
  }

  if (!ticket) return null;

  const handleEscalate = () => {
    const payload: EscalateTicketPayload = {
      toAgentId: "",
      cause: escalateCause,
      causeComment: escalateComment || undefined,
    };
    escalateTicket({ ticketId, payload });
  };

  return (
    <Flex
      direction="column"
      h="full"
      w="full"
      borderLeftWidth="1px"
      borderColor="gray.200"
    >
      <Box
        flex="1"
        overflowY="auto"
        px="4"
        py="4"
        css={{ "&::-webkit-scrollbar": { width: "4px" } }}
      >
        <Stack gap="5">
          {/* Applicant info */}
          <Stack gap="1">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Абитуриент
            </Text>
            <Text fontWeight="semibold" fontSize="sm">
              {ticket.applicant.name ||
                `${ticket.applicant.firstName} ${ticket.applicant.lastName}`}
            </Text>
            {ticket.applicant.middleName && (
              <Text fontSize="sm" color="fg.muted">
                {ticket.applicant.middleName}
              </Text>
            )}
            <Text fontSize="sm" color="fg.muted">
              {ticket.applicant.email}
            </Text>
          </Stack>

          {/* Ticket meta */}
          <Stack gap="2">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Тикет
            </Text>
            <Flex wrap="wrap" gap="2">
              {ticket.category && (
                <IntentCategoryBadge category={ticket.category} showIcon />
              )}
              {ticket.priorityValue !== null && (
                <Badge
                  colorPalette={
                    ticket.priorityValue >= 8
                      ? "red"
                      : ticket.priorityValue >= 5
                        ? "orange"
                        : "teal"
                  }
                  variant="surface"
                  size="sm"
                  borderRadius="md"
                >
                  Приоритет: {ticket.priorityValue}
                </Badge>
              )}
            </Flex>
            <Text fontSize="xs" color="fg.muted">
              Создан: {formatDate(ticket.createdAt)}
            </Text>
            {ticket.assignedAt && (
              <Text fontSize="xs" color="fg.muted">
                Назначен: {formatDate(ticket.assignedAt)}
              </Text>
            )}
          </Stack>

          {/* Exam scores */}
          {ticket.examScores && ticket.examScores.length > 0 && (
            <Stack gap="2">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Баллы
              </Text>
              <Stack gap="1">
                {ticket.examScores.map((score, i) => (
                  <Flex key={i} justify="space-between" align="center">
                    <Text fontSize="sm" color="fg.muted">
                      {score.subjectName}
                    </Text>
                    <Badge variant="surface" size="sm">
                      {score.score}
                    </Badge>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Programs */}
          {ticket.applicantPrograms && ticket.applicantPrograms.length > 0 && (
            <Stack gap="2">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Программы
              </Text>
              <Stack gap="1">
                {ticket.applicantPrograms.map((program, i) => (
                  <Box key={i} p="2" borderRadius="md" bg="bg.subtle">
                    <Text fontSize="xs" fontWeight="medium">
                      {program.programCode}
                    </Text>
                    <Text fontSize="11px" color="fg.muted">
                      Приоритет: {program.priority}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Actions */}
      <Flex
        px="4"
        py="3"
        borderTopWidth="1px"
        borderColor="border.muted"
        flexShrink={0}
        align="center"
        justify="space-between"
        gap="2"
      >
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton variant="outline" size="sm" aria-label="">
              <MoreHorizontal size={16} />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="note"
                  onClick={() => {
                    /* TODO: open leave note modal */
                  }}
                >
                  <StickyNote size={14} />
                  Оставить заметку
                </Menu.Item>
                <Menu.Item
                  value="category"
                  onClick={() => {
                    /* TODO: open change category modal */
                  }}
                >
                  <Tag size={14} />
                  Изменить категорию
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item
                  value="escalate"
                  color="red.500"
                  onClick={() => dispatch(openEscalateModal(ticketId))}
                >
                  <AlertTriangle size={14} />
                  Эскалировать
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

        {ticket.status === TicketStatus.NEW && (
          <Button
            size="sm"
            flex="1"
            loading={isTaking}
            onClick={() => takeTicket(ticketId)}
          >
            Взять тикет
          </Button>
        )}

        {(ticket.status === TicketStatus.IN_PROGRESS ||
          ticket.status === TicketStatus.ESCALATED) && (
          <Button
            colorPalette="green"
            size="sm"
            flex="1"
            loading={isUpdating}
            onClick={() =>
              updateStatus({ ticketId, status: TicketStatus.RESOLVED })
            }
          >
            Решить
          </Button>
        )}

        {ticket.status === TicketStatus.RESOLVED && (
          <Button
            colorPalette="gray"
            variant="outline"
            size="sm"
            flex="1"
            loading={isUpdating}
            onClick={() =>
              updateStatus({ ticketId, status: TicketStatus.CLOSED })
            }
          >
            Закрыть
          </Button>
        )}
      </Flex>

      {/* Escalate modal */}
      <Dialog.Root
        open={isEscalateModalOpen}
        onOpenChange={(details) => {
          if (!details.open) dispatch(closeEscalateModal());
        }}
        unmountOnExit
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Эскалация тикета</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="4">
                  <Stack gap="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Причина
                    </Text>
                    <Select.Root
                      collection={escalationCauses}
                      value={[escalateCause]}
                      onValueChange={(details) =>
                        setEscalateCause(details.value[0] as EscalationCause)
                      }
                      size="sm"
                    >
                      <Select.Trigger bg="white">
                        <Select.ValueText />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content bg="white" shadow="md" borderRadius="md">
                            {escalationCauses.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                <Select.ItemText>{item.label}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </Stack>

                  <Stack gap="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Комментарий (опционально)
                    </Text>
                    <Textarea
                      value={escalateComment}
                      onChange={(e) => setEscalateComment(e.target.value)}
                      placeholder="Дополнительная информация..."
                      rows={3}
                      resize="none"
                      size="sm"
                    />
                  </Stack>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(closeEscalateModal())}
                >
                  Отмена
                </Button>
                <Button
                  colorPalette="orange"
                  size="sm"
                  loading={isEscalating}
                  onClick={handleEscalate}
                >
                  Эскалировать
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
