import { Company, Customer } from "@/xata";
import axios from "axios";

interface updatePointsVariables {
  walletAddress: string;
  points: number;
}

export const login = async (walletAddress: string) => {
  return axios.post<Customer>("/api/auth", { walletAddress });
};

export const getCompanies = async () => {
  return axios.get<Company[]>("/api/companies");
};

export const getCompanyByWalletAddress = async (walletAddress: string) => {
  return axios.get<Company>("/api/company", { params: { walletAddress } });
}

export const createCompany = async (data: {
  name: string;
  email: string;
  walletAddress: string;
}) => {
  return axios.post<Company>("/api/company", data);
};

export const approveCompany = async (walletAddress: string) => {
  return axios.post<Company>("/api/companies/approve", { walletAddress });
};

export const rejectCompany = async (walletAddress: string) => {
  return axios.post<Company>("/api/companies/reject", { walletAddress });
};

export const requestCompanySignature = async (walletAddress: string) => {
  return axios.post<{ message: string }>("/api/companies/signature/request", {
    walletAddress,
  });
};

export const verifyCompanySignature = async (data: {
  walletAddress: string;
  signature: string;
  message: string;
}) => {
  return axios.post<Company>("/api/companies/signature/verify", data);
};

export const getCustomer = async ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  return await axios.get<Customer>("/api/customer", {
    params: { walletAddress },
  });
};

export const createCustomer = async (data: { walletAddress: string }) => {
  return axios.post<Customer>("/api/customer", data);
};

export const collectPoints = async ({
  walletAddress,
  points,
}: updatePointsVariables) => {
  return axios.post<Customer>("/api/points", { walletAddress, points });
};

export const getPoints = async (walletAddress: string) => {
  return axios.get<Customer>("/api/points", { params: { walletAddress } });
};

export const redeemPoints = async (walletAddress: string) => {
  return axios.post<Customer>("/api/redeem", { walletAddress });
};
