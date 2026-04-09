import { Stack } from "@chakra-ui/react";
import { useAccountsQuery } from "../hooks/queries/useAccountsQuery";
import { useAccountsFilters } from "../hooks/useAccountsFilters";
import { useCreateAccountMutation } from "../hooks/mutations/useCreateAccountMutation";
import { useUpdateAccountMutation } from "../hooks/mutations/useUpdateAccountMutation";
import { AccountsControls } from "./AccountsControls";
import { AccountsListTable } from "./AccountsListTable";
import { AccountInfoModal, AccountFormData } from "./AccountInfoModal";
import { useState } from "react";
import { Account } from "@/app/entities/account/model/types";

export const ManageAccounts = () => {
  const { filters, ui } = useAccountsFilters(20);
  const { data, isFetching } = useAccountsQuery(filters);

  const createMutation = useCreateAccountMutation();
  const updateMutation = useUpdateAccountMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleOpenCreate = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleSave = (formData: AccountFormData) => {
    if (selectedAccount) {
      const { password, ...updateData } = formData;
      updateMutation.mutate(
        { id: selectedAccount.id, ...updateData },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  return (
    <Stack gap="4">
      <AccountsControls
        search={ui.searchTerm}
        onSearch={ui.setSearchTerm}
        showApplicants={!ui.isStaff}
        onToggleApplicants={(val) => ui.setIsStaff(!val)}
        onAddClick={handleOpenCreate}
      />

      <AccountsListTable
        accounts={data?.items ?? []}
        isLoading={isFetching}
        offset={filters.offset}
        limit={filters.limit}
        totalCount={data?.total ?? 0}
        onPageChange={ui.handlePageChange}
        onEdit={handleOpenEdit}
        onBlock={(acc) => console.log("Заблокировать", acc)}
        onShowLogs={() => {}}
      />

      <AccountInfoModal
        key={selectedAccount?.id ?? "create"}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        account={selectedAccount}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Stack>
  );
};
