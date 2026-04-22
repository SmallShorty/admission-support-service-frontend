import { useState, useEffect } from "react";
import { IntegrationLogAction, IntegrationLogSeverity } from "../model/types";

export const useIntegrationLogsFilters = (initialLimit = 20) => {
  const [action, setAction] = useState<IntegrationLogAction | undefined>(undefined);
  const [severity, setSeverity] = useState<IntegrationLogSeverity | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [action, severity, dateFrom, dateTo]);

  const handlePageChange = (details: { page: number }) => {
    setPage(details.page);
  };

  return {
    filters: {
      action,
      severity,
      dateFrom: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
      dateTo: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
      page,
      limit: initialLimit,
    },
    ui: {
      action,
      setAction,
      severity,
      setSeverity,
      dateFrom,
      setDateFrom,
      dateTo,
      setDateTo,
      page,
      handlePageChange,
    },
  };
};
