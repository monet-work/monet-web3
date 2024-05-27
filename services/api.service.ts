import { API_BASE_URL, API_ENDPOINTS } from "@/config/api.config";
import { CompanyVerifyWallet } from "@/models/api-payload.model";
import {
  AuthResponse,
  VerifyCompanySubmitRequestResponse,
  VerifyCustomerSubmitRequestResponse,
  VerifyWalletResponse,
} from "@/models/api-response.model";
import { Token } from "@/models/company.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import axios from "axios";

// Helper function to check if a URL matches a dynamic pattern
const matchesDynamicRoute = (url: string, pattern: string) => {
  const regex = new RegExp(pattern.replace(/:[^\s/]+/g, '([\\w-]+)'));
  return regex.test(url);
};

const securedRoutes = [
  API_ENDPOINTS.AUTHENTICATE
];

// axios interceptors
// intercept specific requests
axios.interceptors.request.use(
  (config) => {
    // secured routes
    const securedRoutes = [`${API_BASE_URL}/${API_ENDPOINTS.AUTHENTICATE}`];
    if (config.url && securedRoutes.includes(config.url)) {
      // Add token to request header
      const accessToken = JSON.parse(
        localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN) ?? ""
      ) as Token;
        if (typeof accessToken === "object" && accessToken !== null) {
          config.headers.Authorization = `Bearer ${accessToken.token}`;
        }
      }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

const authenticate = async (refreshToken: string) => {
  return axios.get<AuthResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.AUTHENTICATE}`,
    {
      params: { refreshToken },
    }
  );
};

const companyVerifyWalletStep1 = async (wallet: string) => {
  return axios.post<VerifyWalletResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_VERIFY_WALLET_1}`,
    { walletAddress: wallet }
  );
};

const companyVerifyWalletStep2 = async (payload: Partial<CompanyVerifyWallet>) => {
  return axios.post<VerifyCompanySubmitRequestResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_VERIFY_WALLET_2}`,
    payload
  );
};

const customerVerifyWalletStep1 = async (wallet: string) => {
  return axios.post<VerifyWalletResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_VERIFY_WALLET_1}`,
    { walletAddress: wallet }
  );
};

const customerVerifyWalletStep2 = async (payload: Partial<CompanyVerifyWallet>) => {
  return axios.post<VerifyCustomerSubmitRequestResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_VERIFY_WALLET_2}`,
    payload
  );
}

const fetchCustomerPoints = async (customerId: string) => {
  return axios.get(`${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_POINTS(customerId)}`);
}


export const apiService = {
  authenticate,
  companyVerifyWalletStep1,
  companyVerifyWalletStep2,
  customerVerifyWalletStep1,
  customerVerifyWalletStep2,
  fetchCustomerPoints
};
