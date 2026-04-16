import { useQuery } from "@tanstack/react-query";
import { accountApi } from "@/app/entities/account/api/accountApi";

const SEARCH_ACCOUNTS_QUERY_KEY = ["analytics", "searchAccounts"];

export const useSearchAccounts = (searchTerm: string, enabled = true) => {
  return useQuery({
    queryKey: [...SEARCH_ACCOUNTS_QUERY_KEY, searchTerm],
    queryFn: async () => {
      const response = await accountApi.getAccounts({
        searchTerm: searchTerm.trim(),
        limit: 10,
        offset: 0,
        isStaff: true,
      });
      return response.items;
    },
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
