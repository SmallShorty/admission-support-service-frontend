import { GetAccountsFilters } from "@/app/entities/account/model/types";

export const accountsQueryKeys = {
  all: ["accounts"] as const,
  list: (filters: GetAccountsFilters) => ["accounts", filters] as const,
};
