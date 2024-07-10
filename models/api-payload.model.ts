import { CustomerPoint } from "./point.model";

interface VerifyWalletPayload {
  words: string;
  walletAddress: string;
  signature: string;
}

export interface CompanyVerifyWalletPayload extends VerifyWalletPayload {
  name: string;
  description: string;
  email: string;
  pointName: string;
  pointSymbol: string;
  decimal: string;
}

export interface CustomerVerifyWalletPayload extends VerifyWalletPayload {}

export interface CompanyUploadPointsPayload {
  customerPoints: CustomerPoint[];
}
