import { FC } from "react";
import {
  Badge,
  ButtonGroup,
  HStack,
  IconButton,
  Pagination,
  Table,
  Text,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Panel } from "@shared/components/ui/panel";
import { EmptyResults } from "@shared/components/ui/empty-results";
import { NotificationDto, NotificationStatus, EventType } from "../model/types";

const STATUS_COLOR: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: "yellow",
  [NotificationStatus.SENT]: "green",
  [NotificationStatus.FAILED]: "red",
};

const STATUS_LABEL: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: "Ожидает",
  [NotificationStatus.SENT]: "Отправлено",
  [NotificationStatus.FAILED]: "Ошибка",
};

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  [EventType.INFORMATIONAL]: "Информационное",
  [EventType.FAILURE]: "Ошибка",
};

interface NotificationsTableProps {
  notifications: NotificationDto[];
  isLoading: boolean;
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (details: { page: number }) => void;
}

export const NotificationsTable: FC<NotificationsTableProps> = ({
  notifications,
  isLoading,
  page,
  limit,
  totalCount,
  onPageChange,
}) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min((page - 1) * limit + notifications.length, totalCount);

  return (
    <Panel overflow="hidden" borderWidth="1px" borderColor="border.subtle">
      <Table.Root size="md" variant="line">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Интеграция</Table.ColumnHeader>
            <Table.ColumnHeader>Тип события</Table.ColumnHeader>
            <Table.ColumnHeader>Создано</Table.ColumnHeader>
            <Table.ColumnHeader>Отправлено</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body opacity={isLoading ? 0.5 : 1} transition="opacity 0.15s">
          {notifications.map((item) => (
            <Table.Row key={item.id} _hover={{ bg: "gray.50/50" }}>
              <Table.Cell>
                <HStack gap="1">
                  <Badge
                    colorPalette={STATUS_COLOR[item.status]}
                    variant="subtle"
                    size="sm"
                  >
                    {STATUS_LABEL[item.status]}
                  </Badge>
                  {(item.payload as Record<string, unknown>)._test && (
                    <Badge colorPalette="gray" variant="outline" size="sm">
                      тест
                    </Badge>
                  )}
                </HStack>
              </Table.Cell>

              <Table.Cell>
                <Text fontSize="xs" fontFamily="mono" color="gray.600" maxW="160px" truncate>
                  {item.integrationId}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Badge
                  colorPalette={item.payload.eventType === EventType.FAILURE ? "red" : "blue"}
                  variant="subtle"
                  size="sm"
                >
                  {EVENT_TYPE_LABEL[item.payload.eventType]}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Text fontSize="xs" color="gray.600">
                  {new Date(item.createdAt).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Table.Cell>

              <Table.Cell>
                {item.sentAt ? (
                  <Text fontSize="xs" color="gray.600">
                    {new Date(item.sentAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                ) : (
                  <Text fontSize="sm" color="gray.400">—</Text>
                )}
              </Table.Cell>
            </Table.Row>
          ))}

          {!isLoading && notifications.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} py="0">
                <EmptyResults title="Уведомления не найдены" />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>

        <Table.Footer bg="gray.50/50">
          <Table.Row>
            <Table.Cell colSpan={5}>
              <HStack justify="space-between" py="2" width="full">
                <Text fontSize="xs" color="gray.600">
                  {totalCount > 0
                    ? `Показано ${start}–${end} из ${totalCount}`
                    : "Нет записей"}
                </Text>

                <Pagination.Root
                  count={totalCount}
                  pageSize={limit}
                  page={page}
                  onPageChange={onPageChange}
                >
                  <ButtonGroup variant="outline" size="xs" attached={false} gap="1">
                    <Pagination.PrevTrigger asChild>
                      <IconButton variant="ghost" disabled={page === 1 || isLoading}>
                        <ChevronLeft size={14} />
                      </IconButton>
                    </Pagination.PrevTrigger>

                    <Pagination.Items
                      render={(p) => (
                        <IconButton
                          key={p.value}
                          variant={p.value === page ? "subtle" : "ghost"}
                          colorPalette={p.value === page ? "teal" : "gray"}
                        >
                          {p.value}
                        </IconButton>
                      )}
                    />

                    <Pagination.NextTrigger asChild>
                      <IconButton variant="ghost" disabled={end >= totalCount || isLoading}>
                        <ChevronRight size={14} />
                      </IconButton>
                    </Pagination.NextTrigger>
                  </ButtonGroup>
                </Pagination.Root>
              </HStack>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Panel>
  );
};
