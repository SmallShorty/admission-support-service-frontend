import { Stack } from "@chakra-ui/react";
import { useAccountsQuery } from "../hooks/queries/useAccountsQuery";
import { useAccountsFilters } from "../hooks/useAccountsFilters";
import { useCreateAccountMutation } from "../hooks/mutations/useCreateAccountMutation";
import { useUpdateAccountMutation } from "../hooks/mutations/useUpdateAccountMutation";
import { AccountsControls } from "./AccountsControls";
import { AccountsListTable } from "./AccountsListTable";
import { AccountInfoModal, AccountFormData } from "./AccountInfoModal";
import { AccountCreatedModal } from "./AccountCreatedModal";
import { useEffect, useState } from "react";
import { Account } from "@/app/entities/account/model/types";

export const ManageAccounts = () => {
  const { filters, ui } = useAccountsFilters(20);
  const { data, isFetching } = useAccountsQuery(filters);

  const createMutation = useCreateAccountMutation();
  const updateMutation = useUpdateAccountMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }
  }, [isModalOpen]);

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
      updateMutation.mutate(
        { id: selectedAccount.id, ...formData },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          setIsModalOpen(false);
          setCreatedCredentials({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: data.email,
            password: data.password,
          });
        },
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

      <AccountCreatedModal
        open={!!createdCredentials}
        onClose={() => setCreatedCredentials(null)}
        firstName={createdCredentials?.firstName ?? ""}
        lastName={createdCredentials?.lastName ?? ""}
        email={createdCredentials?.email ?? ""}
        password={createdCredentials?.password ?? ""}
      />
    </Stack>
  );
};
