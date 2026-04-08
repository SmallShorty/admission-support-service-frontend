import { accountApi } from "@/app/entities/account/api/accountApi";
import { GetAccountsFilters } from "@/app/entities/account/model/types";
import { useQuery } from "@tanstack/react-query";

export const useAccountsQuery = (filters: GetAccountsFilters) => {
  return useQuery({
    queryKey: ["accounts", filters],
    queryFn: () => accountApi.getAccounts(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 минут данные считаются свежими
  });
};
