import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { EventType } from "../model/types";

export const useIntegrationsFilters = (initialLimit = 20) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState<EventType | undefined>(undefined);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, eventType]);

  const handlePageChange = (details: { page: number }) => {
    setPage(details.page);
  };

  return {
    filters: {
      searchTerm: debouncedSearch || undefined,
      eventType,
      page,
      limit: initialLimit,
    },
    ui: {
      searchTerm,
      setSearchTerm,
      eventType,
      setEventType,
      page,
      handlePageChange,
    },
  };
};
