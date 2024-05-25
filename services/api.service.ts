import { API_BASE_URL, API_ENDPOINTS } from "@/config/api.config";
import { CompanyVerifyWallet } from "@/models/api-payload.model";
import { VerifyWalletResponse } from "@/models/api-response.model";
import axios from "axios";

const companyVerifyWalletStep1 = async (wallet: string) => {
  return axios.post<VerifyWalletResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_VERIFY_WALLET_1}`,
    { walletAddress: wallet }
  );
};

const companyVerifyWalletStep2 = async (payload: CompanyVerifyWallet) => {
  return axios.post(
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
  companyVerifyWalletStep1,
  customerVerifyWalletStep1,
};
