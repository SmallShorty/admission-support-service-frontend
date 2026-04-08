import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState, useEffect } from "react";

export const useAccountsFilters = (initialLimit = 20) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isStaff, setIsStaff] = useState(true);
  const [offset, setOffset] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch, isStaff]);

  const handleNext = () => setOffset((prev) => prev + initialLimit);
  const handlePrev = () =>
    setOffset((prev) => Math.max(0, prev - initialLimit));

  return {
    filters: {
      searchTerm: debouncedSearch,
      isStaff,
      offset,
      limit: initialLimit,
    },
    ui: {
      searchTerm,
      setSearchTerm,
      isStaff,
      setIsStaff,
      setOffset, // Добавляем этот метод для ручного управления (пагинация по номерам)
      handleNext,
      handlePrev,
    },
  };
};
