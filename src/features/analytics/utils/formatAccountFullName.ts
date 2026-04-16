import { Account } from "@/app/entities/account/model/types";

export const getAccountFullName = (account: Account): string => {
  const parts = [account.lastName, account.firstName];
  if (account.middleName) {
    parts.push(account.middleName);
  }
  return parts.filter(Boolean).join(" ");
};
