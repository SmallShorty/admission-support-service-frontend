import { Stack } from "@chakra-ui/react";
import { useAccountsQuery } from "../api/useAccountsQuery";
import { useAccountsFilters } from "../hooks/useAccountsFilters";
import { AccountsControls } from "./AccountsControls";
import { AccountsListTable } from "./AccountsListTable";

export const ManageAccounts = () => {
  const { filters, ui } = useAccountsFilters(20);
  // React Query автоматически подхватит debouncedSearch из filters
  const { data, isLoading } = useAccountsQuery(filters);

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
    </Stack>
  );
};
