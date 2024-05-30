import { Role } from "@/xata";

export interface User{
    id: string;
    email: string;
    name: null;
    password: null;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    wallet_address: string;
    roles: Role[];
    company: LinkedCompany;
    customer: LinkedCustomer;
}


interface LinkedCompany {
    id: string;
  }
  
  interface LinkedCustomer {
    id: string;
  }

