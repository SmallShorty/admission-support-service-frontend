import { PaginatedResponse, PaginationParams } from "@/shared/types/pagination";
import { ApplicantProfile } from "../../applicant/model/types";

export enum AccountRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  SUPERVISOR = "SUPERVISOR",
  APPLICANT = "APPLICANT",
}
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export enum AuthProvider {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}
export interface BaseAccount {
  id: string;
  externalId: string | null;
  lastName: string;
  firstName: string;
  middleName: string | null;
  email: string;
  authProvider: AuthProvider;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}
export interface ApplicantAccount extends BaseAccount {
  role: AccountRole.APPLICANT;
  applicant: ApplicantProfile;
}
export interface StaffAccount extends BaseAccount {
  role: AccountRole.ADMIN | AccountRole.OPERATOR | AccountRole.SUPERVISOR;
}
export type Account = ApplicantAccount | StaffAccount;

export interface AuthResponse {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

export interface GetAccountsFilters extends PaginationParams {
  searchTerm?: string;
  isStaff?: boolean;
}

export type AccountPaginatedResponse = PaginatedResponse<Account>;

export type StaffRole =
  | AccountRole.ADMIN
  | AccountRole.OPERATOR
  | AccountRole.SUPERVISOR;

export interface CreateAccountDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: StaffRole;
}

export interface RegisterAccountResponse {
  email: string;
  password: string;
}

export interface UpdateAccountDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  role?: StaffRole;
}
