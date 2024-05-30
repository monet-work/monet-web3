import { API_BASE_URL, API_ENDPOINTS } from "@/config/api.config";
import {
  CompanyUploadPointsPayload,
  CompanyVerifyWalletPayload,
} from "@/models/api-payload.model";
import {
  AuthResponse,
  CustomerPointResponse,
  VerifyAdminSubmitRequestResponse,
  VerifyCompanySubmitRequestResponse,
  VerifyCustomerSubmitRequestResponse,
  VerifyWalletResponse,
} from "@/models/api-response.model";
import { Token } from "@/models/company.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import axios from "axios";

// Helper function to check if a URL matches a dynamic pattern
const matchesDynamicRoute = (url: string, pattern: string) => {
  // Strip query parameters if present
  const [urlPath] = url.split("?");

  // Replace dynamic segments with regex patterns specifically in the path part
  const regexPattern = pattern
    .split("/")
    .map((segment) => (segment.startsWith(":") ? "([\\w-]+)" : segment))
    .join("/");

  // Create the final regex with start and end anchors
  const regex = new RegExp(`^${regexPattern}$`);

  // Test the URL against the regex pattern
  const result = regex.test(urlPath);

  return result;
};

const securedRoutes = [
  `${API_BASE_URL}/${API_ENDPOINTS.AUTHENTICATE}`,
  `${API_BASE_URL}/customers/:customerId/points`,
  `${API_BASE_URL}/companies/:companyId/dashboard`,
  `${API_BASE_URL}/${API_ENDPOINTS.ADMIN_GET_COMPANIES}`,
  `${API_BASE_URL}/customers/:customerId/redeem`,
  `${API_BASE_URL}/companies/:companyId/upload-points`,
  `${API_BASE_URL}/admins/companies/:companyId/approve`,
];

// axios interceptors
// intercept specific requests
axios.interceptors.request.use(
  (config) => {
    // secured routes
    if (config.url) {
      const isSecuredRoute = securedRoutes.some((route) =>
        matchesDynamicRoute(config.url!, route)
      );
      // Add token to request header
      if (isSecuredRoute) {
        const accessToken = JSON.parse(
          localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN) ?? ""
        ) as Token;
        if (typeof accessToken === "object" && accessToken !== null) {
          config.headers.Authorization = `Bearer ${accessToken.token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

const authenticate = async () => {
  return axios.get<AuthResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.AUTHENTICATE}`
  );
};

const companyVerifyWalletStep1 = async (wallet: string) => {
  return axios.post<VerifyWalletResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_VERIFY_WALLET_1}`,
    { walletAddress: wallet }
  );
};

const companyVerifyWalletStep2 = async (
  payload: Partial<CompanyVerifyWalletPayload>
) => {
  return axios.post<VerifyCompanySubmitRequestResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_VERIFY_WALLET_2}`,
    payload
  );
};

const fetchCompanyDashboard = async (
  companyId: string
) => {
  return axios.get(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_DASHBOARD(companyId)}`
  );
};

const companyUploadPoints = async (
  companyId: string,
  payload: CompanyUploadPointsPayload
) => {
  return axios.post(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_UPLOAD_POINTS(companyId)}`
  );
};

const adminVerifyWalletStep1 = async (wallet: string) => {
  return axios.post<Pick<VerifyWalletResponse, "words">>(
    `${API_BASE_URL}/${API_ENDPOINTS.ADMIN_VERIFY_WALLET_1}`,
    { walletAddress: wallet }
  );
};

const adminVerifyWalletStep2 = async ({
  wallet,
  words,
  signature,
}: {
  wallet: string;
  words: string;
  signature: string;
}) => {
  return axios.post<VerifyAdminSubmitRequestResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.ADMIN_VERIFY_WALLET_2}`,
    { walletAddress: wallet, words: words, signature: signature }
  );
};

const customerVerifyWalletStep1 = async (wallet: string) => {
  return axios.post<VerifyWalletResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_VERIFY_WALLET_1}`,
    { walletAddress: wallet }
  );
};

const customerVerifyWalletStep2 = async (
  payload: Partial<CompanyVerifyWalletPayload>
) => {
  return axios.post<VerifyCustomerSubmitRequestResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_VERIFY_WALLET_2}`,
    payload
  );
};

const fetchCustomerPoints = async (customerId: string) => {
  return axios.get<CustomerPointResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_POINTS(customerId)}`
  );
};

const fetchAdminCompanies = async () => {
  return axios.get(`${API_BASE_URL}/${API_ENDPOINTS.ADMIN_GET_COMPANIES}`);
}

const customerRedeemPoints = async (customerId: string) => {
  return axios.post(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_REDEEM_POINTS(customerId)}`
  );
}

export const apiService = {
  authenticate,
  companyVerifyWalletStep1,
  companyVerifyWalletStep2,
  fetchCompanyDashboard,
  companyUploadPoints,
  customerVerifyWalletStep1,
  customerVerifyWalletStep2,
  fetchCustomerPoints,
  adminVerifyWalletStep1,
  adminVerifyWalletStep2,
  fetchAdminCompanies,
};
