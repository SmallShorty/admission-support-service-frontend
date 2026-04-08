import { Stack } from "@chakra-ui/react";
import { useAccountsQuery } from "../api/useAccountsQuery";
import { useAccountsFilters } from "../hooks/useAccountsFilters";
import { AccountsControls } from "./AccountsControls";
import { AccountsListTable } from "./AccountsListTable";
import { useState } from "react";
import { Account } from "@/app/entities/account/model/types";
import { AccountInfoModal } from "./AccountInfoModal";

export const ManageAccounts = () => {
  const { filters, ui } = useAccountsFilters(20);
  // React Query автоматически подхватит debouncedSearch из filters
  const { data, isLoading } = useAccountsQuery(filters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // 1. Открытие для создания
  const handleOpenCreate = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  // 2. Открытие для редактирования (вызывается из таблицы)
  const handleOpenEdit = (account: any) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    console.log("Данные из формы:", formData);
    // Здесь вызывай мутацию (useMutation) для API
    setIsModalOpen(false);
  };

  // Обработчик изменения страницы через компоненты пагинации Chakra
  const handlePageChange = (details: { page: number }) => {
    const newOffset = (details.page - 1) * filters.limit;
    ui.setOffset(newOffset);
  };

  return (
    <Stack gap="4">
      <AccountsControls
        search={ui.searchTerm} // Используем "быстрый" стейт для инпута
        onSearch={ui.setSearchTerm}
        showApplicants={!ui.isStaff}
        onToggleApplicants={(val) => ui.setIsStaff(!val)}
        onAddClick={() => console.log("Open Add Modal")}
      />

      <AccountsListTable
        accounts={data?.items ?? []}
        isLoading={isLoading}
        offset={filters.offset}
        limit={filters.limit}
        totalCount={data?.total ?? 0}
        onPageChange={handlePageChange}
        onEdit={(acc) => console.log("Редактировать", acc)}
        onBlock={(acc) => console.log("Удалить", acc)}
        onShowLogs={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <AccountInfoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        account={selectedAccount}
        onSave={handleSave}
      />
    </Stack>
  );
};
