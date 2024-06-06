import { API_BASE_URL, API_ENDPOINTS } from "@/config/api.config";
import { matchesDynamicRoute } from "@/lib/utils";
import {
  CompanyUploadPointsPayload,
  CompanyVerifyWalletPayload,
} from "@/models/api-payload.model";
import {
  AuthResponse,
  CompanyDashboardResponse,
  CustomerPointResponse,
  CustomerRedeemPointsResponse,
  MarketplacePointAssetInfoResponse,
  PointsListResponse,
  VerifyAdminSubmitRequestResponse,
  VerifyCompanySubmitRequestResponse,
  VerifyCustomerSubmitRequestResponse,
  VerifyWalletResponse,
} from "@/models/api-response.model";
import { Token } from "@/models/company.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import axios from "axios";

const securedRoutes = [
  `${API_BASE_URL}/${API_ENDPOINTS.AUTHENTICATE}`,
  `${API_BASE_URL}/customers/:customerId/points`,
  `${API_BASE_URL}/companies/:companyId/dashboard`,
  `${API_BASE_URL}/${API_ENDPOINTS.ADMIN_GET_COMPANIES}`,
  `${API_BASE_URL}/customers/:customerId/redeem`,
  `${API_BASE_URL}/companies/:companyId/upload-points`,
  `${API_BASE_URL}/admins/companies/:companyId/approve`,
  `${API_BASE_URL}/marketplace`,
  `${API_BASE_URL}/marketplace/:pointAddress`,
  `${API_BASE_URL}/customers/:customerId/points/:pointAddress`,
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
          localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN_DATA) ?? ""
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

const refreshToken = async (refreshToken: string) => {
  return axios.post(`${API_BASE_URL}/${API_ENDPOINTS.REFRESH_TOKENS}`, {
    refreshToken,
  });
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

const fetchCompanyDashboard = async (companyId: string) => {
  return axios.get<CompanyDashboardResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_DASHBOARD(companyId)}`
  );
};

const companyUploadPoints = async (payload: {
  points: CompanyUploadPointsPayload;
  companyId: string;
}) => {
  return axios.post(
    `${API_BASE_URL}/${API_ENDPOINTS.COMPANY_UPLOAD_POINTS(payload.companyId)}`,
    payload.points
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

export const fetchAdminCompanies = async () => {
  return axios.get(`${API_BASE_URL}/${API_ENDPOINTS.ADMIN_GET_COMPANIES}`);
};

export const approveAdminCompany = async (companyId: string) => {
  return axios.post(`${API_BASE_URL}/admins/companies/${companyId}/approve`, {
    approve: true,
  });
};

export const rejectAdminCompany = async (companyId: string) => {
  return axios.post(`${API_BASE_URL}/admins/companies/${companyId}/approve`, {
    approve: false,
  });
};

const customerRedeemPoints = async (payload: {
  customerId: string;
  amount: string;
  companyId: string;
}) => {
  return axios.post<CustomerRedeemPointsResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_REDEEM_POINTS(payload.customerId)}`,
    {
      amount: payload.amount,
      companyId: payload.companyId,
    }
  );
};

const getMarketplacePointsList = async () => {
  return axios.get<PointsListResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.MARKETPLACE_POINTS_LIST}`
  );
};

const getMarketplacePointAssetInfo = async (pointAddress: string) => {
  return axios.get<MarketplacePointAssetInfoResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.MARKETPLACE_POINT_ASSET_INFO(pointAddress)}`
  );
};

const getCustomerOnChainPoints = async (
  customerId: string,
  pointAddress: string
) => {
  return axios.get<CustomerPointResponse>(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER_ONCHAIN_POINTS(customerId, pointAddress)}`
  );
};
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
  rejectAdminCompany,
  adminVerifyWalletStep2,
  fetchAdminCompanies,
  approveAdminCompany,
  customerRedeemPoints,
  refreshToken,
  getMarketplacePointsList,
  getMarketplacePointAssetInfo,
  getCustomerOnChainPoints,
};
