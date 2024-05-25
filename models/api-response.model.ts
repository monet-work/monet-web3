import { AuthTokens, Company } from "./company.model";

export interface VerifyWalletResponse {
  words: string;
  isRegistered: boolean;
}

export interface VerifyCompanySubmitRequestResponse {
  company: Company;
  tokens: AuthTokens;
}
