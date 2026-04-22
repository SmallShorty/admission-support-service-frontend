import { FC } from "react";
import { Stack } from "@chakra-ui/react";
import { useIntegrationLogsFilters } from "../hooks/useIntegrationLogsFilters";
import { useIntegrationLogs } from "../hooks/queries/useIntegrationLogs";
import { IntegrationLogsControls } from "./IntegrationLogsControls";
import { IntegrationLogsTable } from "./IntegrationLogsTable";

export const IntegrationsLogs: FC = () => {
  const { filters, ui } = useIntegrationLogsFilters(20);
  const { data, isFetching } = useIntegrationLogs(filters);

  return (
    <Stack gap="4">
      <IntegrationLogsControls
        action={ui.action}
        onActionChange={ui.setAction}
        severity={ui.severity}
        onSeverityChange={ui.setSeverity}
        dateFrom={ui.dateFrom}
        onDateFromChange={ui.setDateFrom}
        dateTo={ui.dateTo}
        onDateToChange={ui.setDateTo}
      />

      <IntegrationLogsTable
        logs={data?.items ?? []}
        isLoading={isFetching}
        page={ui.page}
        limit={filters.limit ?? 20}
        totalCount={data?.total ?? 0}
        onPageChange={ui.handlePageChange}
      />
    </Stack>
  );
};
