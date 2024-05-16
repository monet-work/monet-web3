import { CustomerPoint } from "@/models/point";
import { Company, Customer, Point, User } from "@/xata";
import axios from "axios";

interface updatePointsVariables {
  walletAddress: string;
  points: number;
}

export const authenticate = async (payload: {
  walletAddress: string;
  accessToken: string;
}) => {
  const headers = {
    Authorization: `Bearer ${payload.accessToken}`,
  };
  return axios.post<{ user: User; accessToken?: string }>(
    "/api/v1/auth",
    {
      walletAddress: payload.walletAddress,
    },
    { headers }
  );
};

export const login = async (data: { walletAddress: string }) => {
  return axios.post<{ accessToken: string; user: User }>("/api/v1/login", data);
};

export const getCompanies = async () => {
  return axios.get<Company[]>("/api/v1/companies");
};

export const getCompanyByWalletAddress = async (walletAddress: string) => {
  return axios.get<Company>("/api/v1/company", { params: { walletAddress } });
};

export const getCompanyDashboardData = async (walletAddress: string) => {
  return axios.get<{
    company: Company;
    customers: CustomerPoint[];
  }>("/api/v1/companies/dashboard", { params: { walletAddress } });
};

export const createCompany = async (data: {
  name: string;
  email: string;
  walletAddress: string;
}) => {
  return axios.post<Company>("/api/v1/company", data);
};

export const approveCompany = async (walletAddress: string) => {
  return axios.post<Company>("/api/v1/companies/approve", { walletAddress });
};

export const rejectCompany = async (walletAddress: string) => {
  return axios.post<Company>("/api/v1/companies/reject", { walletAddress });
};

export const submitCompanyRequest = async (payload: {
  walletAddress: string;
}) => {
  return axios.post<{ message: string[] }>(
    "/api/v1/companies/request",
    payload
  );
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
  return axios.post<Company>("/api/v1/companies/contract", payload);
};

export const uploadCustomerData = async (payload: {
  walletAddress: string;
  customerData: { name: string; wallet: string; value: number }[];
}) => {
  return axios.post<
    {
      value: number;
      owner: { walletAddress: string; name: string };
    }[]
  >("/api/v1/companies/points/upload", payload);
};

export const requestWalletVerification = async (data: {
  walletAddress: string;
}) => {
  return axios.post<{ message: string[] }>("/api/v1/wallet/request", data);
};

export const verifyCompanyWalletSignature = async (data: {
  walletAddress: string;
  signature: `0x${string}`;
  message: string;
}) => {
  return axios.post<{ user: User; accessToken: string }>(
    "/api/v1/wallet/company/signature/verify",
    data
  );
};
export const verifyCustomerWalletSignature = async (data: {
  walletAddress: string;
  signature: `0x${string}`;
  message: string;
}) => {
  return axios.post<{ user: User; accessToken: string }>(
    "/api/v1/wallet/customer/signature/verify",
    data
  );
};

export const getCustomer = async ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  return await axios.get<Customer>("/api/v1/customer", {
    params: { walletAddress },
  });
};

export const getCustomerPoints = async (walletAddress: string) => {
  return await axios.get<Point[]>("/api/v1/customers/points", {
    params: { walletAddress },
  });
};

export const createCustomer = async (data: { walletAddress: string }) => {
  return axios.post<Customer>("/api/v1/customer", data);
};

export const collectPoints = async ({
  walletAddress,
  points,
}: updatePointsVariables) => {
  return axios.post<Customer>("/api/v1/companies/points", {
    walletAddress,
    points,
  });
};

export const redeemPoints = async (walletAddress: string) => {
  return axios.post<Customer>("/api/v1/redeem", { walletAddress });
};

export const getPointsByCompanyWalletAddress = async (
  walletAddress: string
) => {
  return axios.get<
    {
      value: number;
      owner: { walletAddress: string; name: string };
    }[]
  >("/api/v1/companies/points", {
    params: { walletAddress },
  });
};
