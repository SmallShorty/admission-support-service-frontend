import { FC } from "react";
import { Stack } from "@chakra-ui/react";
import { useNotifications } from "../hooks/queries/useNotifications";
import { useNotificationsFilters } from "../hooks/useNotificationsFilters";
import { NotificationsControls } from "./NotificationsControls";
import { NotificationsTable } from "./NotificationsTable";

export const NotificationsManager: FC = () => {
  const { filters, ui } = useNotificationsFilters(20);
  const { data, isFetching } = useNotifications(filters);

  return (
    <Stack gap="4">
      <NotificationsControls
        status={ui.status}
        onStatusChange={ui.setStatus}
      />

      <NotificationsTable
        notifications={data?.items ?? []}
        isLoading={isFetching}
        page={ui.page}
        limit={filters.limit ?? 20}
        totalCount={data?.total ?? 0}
        onPageChange={ui.handlePageChange}
      />
    </Stack>
  );
};
