import { API_BASE_URL, API_ENDPOINTS } from "@/config/api.config";
import { CompanyVerifyWallet } from "@/models/api-payload.model";
import {
  AuthResponse,
  VerifyCompanySubmitRequestResponse,
  VerifyWalletResponse,
} from "@/models/api-response.model";
import { Token } from "@/models/company.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import axios from "axios";

// axios interceptors
// intercept specific requests
axios.interceptors.request.use(
  (config) => {
    // secured routes
    const securedRoutes = [`${API_BASE_URL}/${API_ENDPOINTS.AUTHENTICATE}`];
    if (config.url && securedRoutes.includes(config.url)) {
      // Add token to request header
      const accessToken = JSON.parse(
        localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN) || ""
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

export const apiService = {
  authenticate,
  companyVerifyWalletStep1,
  companyVerifyWalletStep2,
  customerVerifyWalletStep1,
};
