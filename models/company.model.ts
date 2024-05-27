export interface Company {
  id: string;
  created_at: string;
  updated_at: string;
  point_contract_address: string;
  is_approved: boolean;
  point_name: string;
  point_symbol: string;
  name: string;
  description: string;
  user_id: string;
}
export interface Admin {
  id: string;
  email: string;
  name: string;
  password: null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  wallet_address: string;
  roles: Array<{
    userId: string;
    role: string;
  }>;
}

export interface Token {
  token: string;
  expires: string;
}

export interface AuthTokens {
  access: Token;
  refresh: Token;
}
