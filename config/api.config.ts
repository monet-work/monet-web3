const API_BASE_URL = "http://localhost:3000/v1";
const API_ENDPOINTS = {
  // auth
  AUTHENTICATE: "auth",

  // companies
  COMPANY_VERIFY_WALLET_1: "companies/verify-wallet-1",
  COMPANY_VERIFY_WALLET_2: "companies/verify-wallet-2",
  COMPANY_UPLOAD_POINTS: (walletId: string) =>
    `companies/${walletId}/upload-points`,
  COMPANY_DASHBOARD: (companyId: string) => `companies/${companyId}/dashboard`,

  // customers
  CUSTOMER_VERIFY_WALLET_1: "customers/verify-wallet-1",
  CUSTOMER_VERIFY_WALLET_2: "customers/verify-wallet-2",
  CUSTOMER_POINTS: (customerId: string) => `customers/${customerId}/points`,
  CUSTOMER_REDEEM_POINTS: (customerId: string) =>
    `customers/${customerId}/redeem`,

  // admins
  ADMIN_VERIFY_WALLET_1: "admins/verify-wallet-1",
  ADMIN_VERIFY_WALLET_2: "admins/verify-wallet-2",
  ADMIN_GET_COMPANIES: "admins/companies",
  ADMIN_COMPANY_APPROVE: (companyId: string) =>
    `admins/companies/${companyId}/approve`,

  // auth
  REFRESH_TOKENS: "auth/refresh-tokens",

  // marketplace
  MARKETPLACE_POINTS_LIST: "marketplace",
};

export { API_BASE_URL, API_ENDPOINTS };
