import React from "react";
import {
  Badge,
  Box,
  Button,
  Circle,
  createListCollection,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Menu,
  Portal,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { StudyForm, AdmissionType } from "@/app/entities/applicant/model/types";
import {
  MoreHorizontal,
  AlertTriangle,
  StickyNote,
  Tag,
  Check,
  X,
} from "lucide-react";

const STUDY_FORM_LABELS: Record<StudyForm, string> = {
  [StudyForm.FULL_TIME]: "Очная",
  [StudyForm.PART_TIME]: "Заочная",
  [StudyForm.EVENING]: "Вечерняя",
};

const STUDY_FORM_COLORS: Record<StudyForm, string> = {
  [StudyForm.FULL_TIME]: "blue",
  [StudyForm.PART_TIME]: "purple",
  [StudyForm.EVENING]: "orange",
};

const ADMISSION_TYPE_LABELS: Record<AdmissionType, string> = {
  [AdmissionType.BUDGET_COMPETITIVE]: "Бюджет (конкурс)",
  [AdmissionType.BUDGET_BVI]: "БВИ",
  [AdmissionType.BUDGET_SPECIAL_QUOTA]: "Особая квота",
  [AdmissionType.BUDGET_SEPARATE_QUOTA]: "Отдельная квота",
  [AdmissionType.TARGET]: "Целевое",
  [AdmissionType.PAID]: "Платное",
};

const ADMISSION_TYPE_COLORS: Record<AdmissionType, string> = {
  [AdmissionType.BUDGET_COMPETITIVE]: "teal",
  [AdmissionType.BUDGET_BVI]: "green",
  [AdmissionType.BUDGET_SPECIAL_QUOTA]: "cyan",
  [AdmissionType.BUDGET_SEPARATE_QUOTA]: "blue",
  [AdmissionType.TARGET]: "yellow",
  [AdmissionType.PAID]: "red",
};
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useTicketDetail } from "../hooks/queries/useTicketDetail";
import { useTakeTicket } from "../hooks/mutations/useTakeTicket";
import { useUpdateTicketStatus } from "../hooks/mutations/useUpdateTicketStatus";
import { useEscalateTicket } from "../hooks/mutations/useEscalateTicket";
import { useUpdateTicketCategory } from "../hooks/mutations/useUpdateTicketCategory";
import { useUpdateTicketNote } from "../hooks/mutations/useUpdateTicketNote";
import { openEscalateModal, closeEscalateModal } from "../model/ticketsSlice";
import {
  TicketStatus,
  EscalationCause,
  EscalateTicketPayload,
  AdmissionIntentCategory,
} from "../model/types";
import { IntentCategoryBadge } from "../components/IntentCategoryBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { Panel } from "@/shared/components/ui/panel";
import { useAccountsQuery } from "@/features/managa-accounts/hooks/queries/useAccountsQuery";
import { AccountRole, StaffAccount } from "@/app/entities/account/model/types";

const ESCALATION_CAUSE_LABELS: Record<EscalationCause, string> = {
  [EscalationCause.COMPLEX_ISSUE]: "Сложный вопрос",
  [EscalationCause.INSUFFICIENT_RIGHTS]: "Недостаточно прав",
  [EscalationCause.CUSTOMER_COMPLAINT]: "Жалоба клиента",
  [EscalationCause.TECHNICAL_FAILURE]: "Технический сбой",
  [EscalationCause.TIMEOUT]: "Истекло время",
  [EscalationCause.OTHER]: "Другое",
};

const CATEGORY_LABELS: Record<AdmissionIntentCategory, string> = {
  [AdmissionIntentCategory.TECHNICAL_ISSUES]: "Технические проблемы",
  [AdmissionIntentCategory.DEADLINES_TIMELINES]: "Сроки",
  [AdmissionIntentCategory.DOCUMENT_SUBMISSION]: "Подача документов",
  [AdmissionIntentCategory.STATUS_VERIFICATION]: "Проверка статуса",
  [AdmissionIntentCategory.SCORES_COMPETITION]: "Баллы и конкурс",
  [AdmissionIntentCategory.PAYMENTS_CONTRACTS]: "Оплата и договоры",
  [AdmissionIntentCategory.ENROLLMENT]: "Зачисление",
  [AdmissionIntentCategory.DORMITORY_HOUSING]: "Общежитие",
  [AdmissionIntentCategory.STUDIES_SCHEDULE]: "Учёба и расписание",
  [AdmissionIntentCategory.EVENTS]: "Мероприятия",
  [AdmissionIntentCategory.GENERAL_INFO]: "Общая информация",
  [AdmissionIntentCategory.PROGRAM_CONSULTATION]: "Консультация по программам",
};

const escalationCauses = createListCollection({
  items: Object.entries(ESCALATION_CAUSE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

const categories = createListCollection({
  items: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
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
  const [escalateToAgentId, setEscalateToAgentId] = React.useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<AdmissionIntentCategory>(
      AdmissionIntentCategory.GENERAL_INFO,
    );

  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");

  const { data: ticket, isLoading } = useTicketDetail(ticketId);
  const { mutate: takeTicket, isPending: isTaking } = useTakeTicket();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateTicketStatus();
  const { mutate: escalateTicket, isPending: isEscalating } =
    useEscalateTicket();
  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    useUpdateTicketCategory();
  const { mutate: updateNote, isPending: isUpdatingNote } =
    useUpdateTicketNote();

  const { data: accountsData } = useAccountsQuery({ isStaff: true, limit: 200 });
  const supervisorAdminAgents = (accountsData?.items ?? []).filter(
    (a): a is StaffAccount =>
      a.role === AccountRole.SUPERVISOR || a.role === AccountRole.ADMIN,
  );
  const agentsCollection = createListCollection({
    items: supervisorAdminAgents.map((a) => ({
      value: a.id,
      label: `${a.lastName} ${a.firstName}${a.middleName ? " " + a.middleName : ""} (${a.role === AccountRole.ADMIN ? "Админ" : "Супервизор"})`,
    })),
  });

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
      toAgentId: escalateToAgentId,
      cause: escalateCause,
      causeComment: escalateComment || undefined,
    };
    escalateTicket({ ticketId, payload });
  };

  const handleCategoryChange = () => {
    updateCategory(
      { ticketId, category: selectedCategory },
      { onSuccess: () => setIsCategoryModalOpen(false) },
    );
  };

  const handleNoteSubmit = () => {
    updateNote(
      { ticketId, text: noteText },
      {
        onSuccess: () => {
          setIsNoteModalOpen(false);
          setNoteText("");
        },
      },
    );
  };

  return (
    <Flex
      direction="column"
      h="full"
      w="full"
      bg="bg.panel"
    >
      <Flex
        px="4"
        py="3"
        borderBottomWidth="1px"
        align="center"
        justify="space-between"
        gap="2"
      >
        <Heading size="sm" flexShrink={0}>
          Основная информация об абитуриенте
        </Heading>
      </Flex>

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
            <Text fontSize="sm" fontWeight="bold">
              {ticket.applicant.name}
            </Text>
            <Text fontSize="sm" color="fg.muted" fontWeight="medium">
              {ticket.applicant.email}
            </Text>
          </Stack>

          {/* Ticket meta */}
          <Stack gap="2">
            <Flex wrap="wrap" gap="2">
              {ticket.category && (
                <IntentCategoryBadge category={ticket.category} showIcon />
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

          {/* Internal note */}
          {ticket.noteText && (
            <Panel p="3">
              <Stack gap="1">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Заметка
                </Text>
                <Text fontSize="sm">{ticket.noteText}</Text>
              </Stack>
            </Panel>
          )}

          {/* Applicant status */}
          <Panel p="3">
            <Stack gap="3">
              <Flex justify="space-between" align="center">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Статус абитуриента
                </Text>
                {ticket.priorityValue !== null && (
                  <PriorityBadge value={ticket.priorityValue} />
                )}
              </Flex>
              <Stack gap="1.5">
                {(
                  [
                    [
                      ticket.applicantOriginalDocumentReceived,
                      "Оригинал документа сдан",
                    ],
                    [ticket.applicantHasBvi, "БВИ"],
                    [
                      ticket.applicantHasPriorityRight,
                      "Преимущественное право",
                    ],
                    [ticket.applicantHasSpecialQuota, "Особая квота"],
                    [ticket.applicantHasSeparateQuota, "Отдельная квота"],
                    [ticket.applicantHasTargetQuota, "Целевая квота"],
                  ] as [boolean | undefined, string][]
                ).map(([value, label]) => (
                  <Flex key={label} align="center" gap="2">
                    <Flex
                      align="center"
                      justify="center"
                      w="4"
                      h="4"
                      flexShrink={0}
                      color={value ? "green.500" : "fg.subtle"}
                    >
                      {value ? <Check size={13} /> : <X size={13} />}
                    </Flex>
                    <Text
                      fontSize="sm"
                      color={value ? "fg" : "fg.muted"}
                      fontWeight={value ? "medium" : "normal"}
                    >
                      {label}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          </Panel>

          {/* Exam scores */}
          {/* TODO: Разделение на internal/external, подсчёт баллов всего по каждому типу */}
          <Panel p="3">
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
                <Flex justify="space-between" borderColor="border.muted">
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="fg.muted"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Всего баллов
                  </Text>
                  <Text>200</Text>
                </Flex>
              </Stack>
            )}
          </Panel>

          {/* Programs */}
          <Panel p="3">
            {ticket.applicantPrograms &&
              ticket.applicantPrograms.length > 0 && (
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
                      <Panel key={i} position="relative" mt="4" p="4">
                        <Circle
                          size="5"
                          bg="teal.500"
                          color="white"
                          fontWeight="bold"
                          fontSize="xs"
                          position="absolute"
                          top="-2"
                          left="-2"
                        >
                          {program.priority}
                        </Circle>

                        <Box ml="4">
                          <Text fontSize="sm" fontWeight="bold">
                            {program.programName}
                          </Text>
                          <Text fontSize="xs" color="fg.muted">
                            {program.programCode}
                          </Text>
                          <Flex gap="1" mt="2" wrap="wrap">
                            <Badge
                              colorPalette={
                                STUDY_FORM_COLORS[program.studyForm]
                              }
                              variant="surface"
                              size="sm"
                              borderRadius="md"
                            >
                              {STUDY_FORM_LABELS[program.studyForm]}
                            </Badge>
                            <Badge
                              colorPalette={
                                ADMISSION_TYPE_COLORS[program.admissionType]
                              }
                              variant="surface"
                              size="sm"
                              borderRadius="md"
                            >
                              {ADMISSION_TYPE_LABELS[program.admissionType]}
                            </Badge>
                          </Flex>
                        </Box>
                      </Panel>
                    ))}
                  </Stack>
                </Stack>
              )}
          </Panel>
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
                    setNoteText(ticket.noteText ?? "");
                    setIsNoteModalOpen(true);
                  }}
                >
                  <StickyNote size={14} />
                  Оставить заметку
                </Menu.Item>
                <Menu.Item
                  value="category"
                  onClick={() => {
                    if (ticket.category) setSelectedCategory(ticket.category);
                    setIsCategoryModalOpen(true);
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
            Взять заявку
          </Button>
        )}

        {(ticket.status === TicketStatus.IN_PROGRESS ||
          ticket.status === TicketStatus.ESCALATED) && (
          <Button
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
                <Dialog.Title>Эскалация заявки</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="4">
                  <Stack gap="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Агент
                    </Text>
                    <Select.Root
                      collection={agentsCollection}
                      value={escalateToAgentId ? [escalateToAgentId] : []}
                      onValueChange={(details) =>
                        setEscalateToAgentId(details.value[0])
                      }
                      size="sm"
                    >
                      <Select.Trigger bg="white">
                        <Select.ValueText placeholder="Выберите супервизора или администратора" />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content
                            bg="white"
                            shadow="md"
                            borderRadius="md"
                          >
                            {agentsCollection.items.map((item) => (
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
                          <Select.Content
                            bg="white"
                            shadow="md"
                            borderRadius="md"
                          >
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
                  disabled={!escalateToAgentId}
                  onClick={handleEscalate}
                >
                  Эскалировать
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Change category modal */}
      <Dialog.Root
        open={isCategoryModalOpen}
        onOpenChange={(details) => {
          if (!details.open) setIsCategoryModalOpen(false);
        }}
        unmountOnExit
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Изменить категорию</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Select.Root
                  collection={categories}
                  value={[selectedCategory]}
                  onValueChange={(details) =>
                    setSelectedCategory(
                      details.value[0] as AdmissionIntentCategory,
                    )
                  }
                  size="sm"
                >
                  <Select.Trigger bg="white">
                    <Select.ValueText />
                  </Select.Trigger>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content
                        bg="white"
                        shadow="md"
                        borderRadius="md"
                      >
                        {categories.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  loading={isUpdatingCategory}
                  onClick={handleCategoryChange}
                >
                  Сохранить
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Note modal */}
      <Dialog.Root
        open={isNoteModalOpen}
        onOpenChange={(details) => {
          if (!details.open) setIsNoteModalOpen(false);
        }}
        unmountOnExit
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Внутренняя заметка</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Заметка видна только сотрудникам..."
                  rows={5}
                  resize="none"
                  maxLength={2000}
                />
                <Text fontSize="xs" color="fg.muted" mt="1" textAlign="right">
                  {noteText.length}/2000
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNoteModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  loading={isUpdatingNote}
                  disabled={!noteText.trim()}
                  onClick={handleNoteSubmit}
                >
                  Сохранить
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
