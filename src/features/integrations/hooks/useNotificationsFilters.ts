import { useState, useEffect } from "react";
import { NotificationStatus } from "../model/types";

export const useNotificationsFilters = (initialLimit = 20) => {
  const [status, setStatus] = useState<NotificationStatus | undefined>(undefined);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const handlePageChange = (details: { page: number }) => {
    setPage(details.page);
  };

  return {
    filters: {
      status,
      page,
      limit: initialLimit,
    },
    ui: {
      status,
      setStatus,
      page,
      handlePageChange,
    },
  };
};
