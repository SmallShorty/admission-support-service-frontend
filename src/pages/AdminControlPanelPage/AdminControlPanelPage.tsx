import { KnowledgeBaseTabs } from "@/features/knowledge-base/ui/KnowledgeBaseTabs";
import { ManageAccounts } from "@/features/managa-accounts/ui/ManageAccounts";
import { Box, Center } from "@chakra-ui/react";
import { FC } from "react";

const AdminControlPanelPage: FC = () => {
  return (
    <>
      <ManageAccounts />
    </>
  );
};

export default AdminControlPanelPage;
