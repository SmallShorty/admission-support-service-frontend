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
} from "@chakra-ui/react";
import {
  Edit,
  Trash2,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Account } from "@/app/entities/account/model/types";
import { RoleBadge } from "@/app/entities/account/ui/RoleBadge";
import { StatusBadge } from "@/app/entities/account/ui/StatusBadge";

interface AccountsListTableProps {
  accounts: Account[];
  isLoading: boolean;
  offset: number;
  limit: number;
  totalCount: number;
  onPageChange: (details: { page: number }) => void;
  onEdit: (acc: Account) => void;
  onBlock: (acc: Account) => void;
  onShowLogs: () => void;
}

export const AccountsListTable = ({
  accounts,
  isLoading,
  offset,
  limit,
  totalCount,
  onPageChange,
  onEdit,
  onBlock,
  onShowLogs,
}: AccountsListTableProps) => {
  // Вычисляем текущую страницу для Pagination.Root (начиная с 1)
  const currentPage = Math.floor(offset / limit) + 1;
  const start = offset + 1;
  const end = Math.min(offset + accounts.length, totalCount);

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
            <Table.ColumnHeader>Пользователь</Table.ColumnHeader>
            <Table.ColumnHeader>Роль</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body opacity={isLoading ? 0.5 : 1} transition="opacity 0.15s">
          {accounts.map((acc) => (
              <Table.Row key={acc.id} _hover={{ bg: "gray.50/50" }}>
                <Table.Cell>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      {acc.lastName} {acc.firstName} {acc.middleName}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {acc.corporateEmail}
                    </Text>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <RoleBadge role={acc.role} />
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={acc.status} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Menu.Root positioning={{ placement: "bottom-end" }}>
                    <Menu.Trigger asChild>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        aria-label="Действия"
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          {/* Изменить */}
                          <Menu.Item value="edit" onClick={() => onEdit(acc)}>
                            <HStack gap="2">
                              <Edit size={14} />
                              <Text>Изменить</Text>
                            </HStack>
                          </Menu.Item>

                          {/* Журнал действий */}
                          <Menu.Item value="logs" onClick={() => onShowLogs()}>
                            <HStack gap="2">
                              <History size={14} />
                              <Text>Журнал действий</Text>
                            </HStack>
                          </Menu.Item>

                          {/* Удалить */}
                          <Menu.Item
                            value="delete"
                            color="red.600"
                            _hover={{ bg: "red.50", color: "red.700" }}
                            onClick={() => onBlock(acc)}
                          >
                            <HStack gap="2">
                              <Trash2 size={14} />
                              <Text>Удалить</Text>
                            </HStack>
                          </Menu.Item>
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
            <Table.Cell colSpan={4}>
              <HStack justify="space-between" py="2" width="full">
                <Text fontSize="xs" color="gray.600">
                  Показано {start}–{end} из {totalCount}
                </Text>

                {/* ИСПОЛЬЗУЕМ ПАТТЕРН ИЗ ТВОЕГО ПРИМЕРА */}
                <Pagination.Root
                  count={totalCount}
                  pageSize={limit}
                  page={currentPage}
                  onPageChange={onPageChange}
                >
                  <ButtonGroup
                    variant="outline"
                    size="xs"
                    attached={false}
                    gap="1"
                  >
                    <Pagination.PrevTrigger asChild>
                      <IconButton
                        variant="ghost"
                        disabled={currentPage === 1 || isLoading}
                      >
                        <ChevronLeft size={14} />
                      </IconButton>
                    </Pagination.PrevTrigger>

                    <Pagination.Items
                      render={(page) => (
                        <IconButton
                          key={page.value}
                          variant={
                            page.value === currentPage ? "subtle" : "ghost"
                          }
                          colorPalette={
                            page.value === currentPage ? "teal" : "gray"
                          }
                        >
                          {page.value}
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
