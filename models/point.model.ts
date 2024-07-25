import { Company } from "./company.model";

export interface Point {
  id: string;
  created_at: string;
  updated_at: string;
  points: number;
  company_id: string;
  wallet_address: string;
  company?: Company;
  name?: string;
}

export interface CustomerPoint {
  walletAddress: string;
  points: number;
  name: string;
}

export interface PointAsset {
  address: string;
  name: string;
  status: PointStatus;
  symbol: string;
}

export enum PointStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}
