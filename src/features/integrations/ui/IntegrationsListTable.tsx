import { FC } from "react";
import {
  Table,
  IconButton,
  Text,
  Box,
  Menu,
  Portal,
  HStack,
  Pagination,
  ButtonGroup,
  Badge,
} from "@chakra-ui/react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Play,
  PowerOff,
  Power,
} from "lucide-react";
import { IntegrationDto, EventType } from "../model/types";

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  [EventType.INFORMATIONAL]: "Информационное",
  [EventType.FAILURE]: "Ошибка",
};

interface IntegrationsListTableProps {
  integrations: IntegrationDto[];
  isLoading: boolean;
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (details: { page: number }) => void;
  onEdit: (item: IntegrationDto) => void;
  onTestCall: (item: IntegrationDto) => void;
  onActivate: (item: IntegrationDto) => void;
  onDeactivate: (item: IntegrationDto) => void;
}

export const IntegrationsListTable: FC<IntegrationsListTableProps> = ({
  integrations,
  isLoading,
  page,
  limit,
  totalCount,
  onPageChange,
  onEdit,
  onTestCall,
  onActivate,
  onDeactivate,
}) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min((page - 1) * limit + integrations.length, totalCount);

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      shadow="sm"
      overflow="hidden"
    >
      <Table.Root size="md" variant="line">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader>Название</Table.ColumnHeader>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Автор</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body opacity={isLoading ? 0.5 : 1} transition="opacity 0.15s">
          {integrations.map((item) => (
            <Table.Row key={item.id} _hover={{ bg: "gray.50/50" }}>
              <Table.Cell>
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color="gray.400" fontFamily="mono">
                    {item.slug}
                  </Text>
                </Box>
              </Table.Cell>

              <Table.Cell>
                <Badge
                  colorPalette={item.eventType === EventType.FAILURE ? "red" : "blue"}
                  variant="subtle"
                  size="sm"
                >
                  {EVENT_TYPE_LABEL[item.eventType]}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Badge
                  colorPalette={item.isActive ? "green" : "gray"}
                  variant="subtle"
                  size="sm"
                >
                  {item.isActive ? "Активно" : "Неактивно"}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Text fontSize="sm" color="gray.500">
                  —
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Box>
                  <Text fontSize="xs" color="gray.600">
                    {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    изм. {new Date(item.updatedAt).toLocaleDateString("ru-RU")}
                  </Text>
                </Box>
              </Table.Cell>

              <Table.Cell textAlign="right">
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                  <Menu.Trigger asChild>
                    <IconButton variant="ghost" size="sm" aria-label="Действия">
                      <MoreVertical size={18} />
                    </IconButton>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="edit" onClick={() => onEdit(item)}>
                          <HStack gap="2">
                            <Edit size={14} />
                            <Text>Изменить</Text>
                          </HStack>
                        </Menu.Item>

                        <Menu.Item value="test" onClick={() => onTestCall(item)}>
                          <HStack gap="2">
                            <Play size={14} />
                            <Text>Тестовый вызов</Text>
                          </HStack>
                        </Menu.Item>

                        {item.isActive ? (
                          <Menu.Item
                            value="deactivate"
                            color="orange.600"
                            _hover={{ bg: "orange.50", color: "orange.700" }}
                            onClick={() => onDeactivate(item)}
                          >
                            <HStack gap="2">
                              <PowerOff size={14} />
                              <Text>Выключить</Text>
                            </HStack>
                          </Menu.Item>
                        ) : (
                          <Menu.Item
                            value="activate"
                            color="green.600"
                            _hover={{ bg: "green.50", color: "green.700" }}
                            onClick={() => onActivate(item)}
                          >
                            <HStack gap="2">
                              <Power size={14} />
                              <Text>Включить</Text>
                            </HStack>
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer bg="gray.50/50">
          <Table.Row>
            <Table.Cell colSpan={6}>
              <HStack justify="space-between" py="2" width="full">
                <Text fontSize="xs" color="gray.600">
                  Показано {start}–{end} из {totalCount}
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
    </Box>
  );
};
