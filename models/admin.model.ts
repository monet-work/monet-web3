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
