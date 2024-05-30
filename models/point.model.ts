export interface Point {
  id: string;
  created_at: string;
  updated_at: string;
  points: number;
  company_id: string;
  wallet_address: string;
}


export interface CustomerPoint {
  walletAddress: string;
  points: number;
  name: string;
}