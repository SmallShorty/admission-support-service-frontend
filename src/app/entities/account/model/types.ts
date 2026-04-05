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
  token: string;
  account: Account;
}
