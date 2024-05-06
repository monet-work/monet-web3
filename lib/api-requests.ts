import { Company, Customer, User } from "@/xata";
import axios from "axios";

interface updatePointsVariables {
  walletAddress: string;
  points: number;
}

export const authenticate = async (payload: {
  accessToken: string;
  walletAddress: string;
}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: payload.accessToken,
  };

  return axios.post<{ user: User; accessToken: string }>(
    "/api/auth",
    { walletAddress: payload.walletAddress },
    { headers }
  );
};

export const login = async (data: { walletAddress: string }) => {
  return axios.post<{ accessToken: string; user: User }>(
    "/api/auth/login",
    data
  );
};

export const getCompanies = async () => {
  return axios.get<Company[]>("/api/companies");
};

export const getCompanyByWalletAddress = async (walletAddress: string) => {
  return axios.get<Company>("/api/company", { params: { walletAddress } });
};

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

export const submitCompanyRequest = async (payload: {
  walletAddress: string;
}) => {
  return axios.post<{ message: string[] }>("/api/companies/request", payload);
};

export const createCompanyContract = async (payload: {
  walletAddress: string;
  companyName: string;
  email: string;
  pointsName: string;
  pointsSymbol: string;
  allPoints: string;
  decimalDigits: string;
  orderingFee: string;
}) => {
  return axios.post<Company>("/api/companies/contract", payload);
};

export const requestCompanyWalletVerfication = async (data: {
  walletAddress: string;
  signature: `0x${string}`;
  message: string;
}) => {
  return axios.post<{ company: Company, accessToken: string }>(
    "/api/companies/signature/verify",
    data
  );
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
