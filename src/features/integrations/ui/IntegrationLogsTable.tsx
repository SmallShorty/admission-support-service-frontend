import { FC } from "react";
import {
  Table,
  IconButton,
  Text,
  Box,
  HStack,
  Pagination,
  ButtonGroup,
  Badge,
} from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { EmptyResults } from "@shared/components/ui/empty-results";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  IntegrationLogDto,
  IntegrationLogAction,
  IntegrationLogSeverity,
} from "../model/types";

const ACTION_LABEL: Record<IntegrationLogAction, string> = {
  [IntegrationLogAction.INTEGRATION_SUBMITTED]: "Отправка формы",
  [IntegrationLogAction.INTEGRATION_SUBMISSION_NOT_FOUND]: "Форма не найдена",
  [IntegrationLogAction.INTEGRATION_SUBMISSION_READONLY_FIELD_VIOLATION]: "Нарушение полей",
  [IntegrationLogAction.INTEGRATION_CREATED]: "Создание",
  [IntegrationLogAction.INTEGRATION_UPDATED]: "Изменение",
  [IntegrationLogAction.INTEGRATION_ACTIVATED]: "Активация",
  [IntegrationLogAction.INTEGRATION_DEACTIVATED]: "Деактивация",
};

const ACTION_COLOR: Record<IntegrationLogAction, string> = {
  [IntegrationLogAction.INTEGRATION_SUBMITTED]: "green",
  [IntegrationLogAction.INTEGRATION_SUBMISSION_NOT_FOUND]: "orange",
  [IntegrationLogAction.INTEGRATION_SUBMISSION_READONLY_FIELD_VIOLATION]: "red",
  [IntegrationLogAction.INTEGRATION_CREATED]: "teal",
  [IntegrationLogAction.INTEGRATION_UPDATED]: "blue",
  [IntegrationLogAction.INTEGRATION_ACTIVATED]: "green",
  [IntegrationLogAction.INTEGRATION_DEACTIVATED]: "gray",
};

const SEVERITY_COLOR: Record<IntegrationLogSeverity, string> = {
  [IntegrationLogSeverity.INFO]: "blue",
  [IntegrationLogSeverity.WARN]: "orange",
  [IntegrationLogSeverity.ERROR]: "red",
};

interface IntegrationLogsTableProps {
  logs: IntegrationLogDto[];
  isLoading: boolean;
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (details: { page: number }) => void;
}

export const IntegrationLogsTable: FC<IntegrationLogsTableProps> = ({
  logs,
  isLoading,
  page,
  limit,
  totalCount,
  onPageChange,
}) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min((page - 1) * limit + logs.length, totalCount);

  return (
    <Panel overflow="hidden" borderWidth="1px" borderColor="border.subtle">
      <Table.Root size="md" variant="line">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader>Действие</Table.ColumnHeader>
            <Table.ColumnHeader>Уровень</Table.ColumnHeader>
            <Table.ColumnHeader>Интеграция</Table.ColumnHeader>
            <Table.ColumnHeader>Актор</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body opacity={isLoading ? 0.5 : 1} transition="opacity 0.15s">
          {logs.map((item) => (
            <Table.Row key={item.id} _hover={{ bg: "gray.50/50" }}>
              <Table.Cell>
                <Badge
                  colorPalette={ACTION_COLOR[item.action]}
                  variant="subtle"
                  size="sm"
                >
                  {ACTION_LABEL[item.action]}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Badge
                  colorPalette={SEVERITY_COLOR[item.severity]}
                  variant="surface"
                  size="sm"
                >
                  {item.severity}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                {item.slug ? (
                  <Text fontSize="xs" fontFamily="mono" color="gray.600">
                    {item.slug}
                  </Text>
                ) : (
                  <Text fontSize="sm" color="gray.400">—</Text>
                )}
              </Table.Cell>

              <Table.Cell>
                {item.actor ? (
                  <Box>
                    <Text fontSize="sm">
                      {item.actor.lastName} {item.actor.firstName}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {item.actor.email}
                    </Text>
                  </Box>
                ) : (
                  <Text fontSize="sm" color="gray.400">—</Text>
                )}
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
            </Table.Row>
          ))}

          {!isLoading && logs.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} py="0">
                <EmptyResults title="Записи не найдены" />
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
                      <IconButton
                        variant="ghost"
                        disabled={page === 1 || isLoading}
                      >
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
                      <IconButton
                        variant="ghost"
                        disabled={end >= totalCount || isLoading}
                      >
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
