import { Customer } from "./customer.model";
import { AuthTokens, Company } from "./company.model";
import { Point } from "./point.model";
import { Admin } from "./admin.model";
import { User } from "./user.model";

export interface VerifyWalletResponse {
  words: string;
  isRegistered: boolean;
}

export interface VerifyCompanySubmitRequestResponse {
  company: Company;
  tokens: AuthTokens;
}

export interface VerifyCustomerSubmitRequestResponse {
  customer: Customer;
  tokens: AuthTokens;
}
export interface VerifyAdminSubmitRequestResponse {
  admin: Admin;
  tokens: AuthTokens;
}
export interface AuthResponse extends User{}

export interface CustomerPointResponse {
  points: Point[];
}

export interface CompanyDashboardResponse {
  company: Company;
  dashboard: Point[];
}