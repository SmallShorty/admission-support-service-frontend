import { accountApi } from "@/app/entities/account/api/accountApi";
import { GetAccountsFilters } from "@/app/entities/account/model/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { accountsQueryKeys } from "./queryKeys";

export const useAccountsQuery = (filters: GetAccountsFilters) => {
  return useQuery({
    queryKey: accountsQueryKeys.list(filters),
    queryFn: () => accountApi.getAccounts(filters),
    placeholderData: keepPreviousData,
  });
};
