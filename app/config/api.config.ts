const API_ENDPOINTS = {
    // companies
    COMPANIE_VERIFY_WALLET_1: 'companies/verify-wallet-1',
    COMPANIE_VERIFY_WALLET_2: 'companies/verify-wallet-2',
    COMPANIE_UPLOAD_POINTS: (walletId: string) => `companies/${walletId}/upload-points`,

    // customers
    CUSTOMER_VERIFY_WALLET_1: 'customers/verify-wallet-1',
    CUSTOMER_VERIFY_WALLET_2: 'customers/verify-wallet-2',
    CUSTOMER_POINTS: 'customers/points',

    // admins
    ADMIN_VERIFY_WALLET_1: 'admins/verify-wallet-1',
    ADMIN_VERIFY_WALLET_2: 'admins/verify-wallet-2',
    ADMIN_GET_COMPANIES: 'admins/companies',
    ADMIN_COMPANY_APPROVE: (companyId: string) => `admins/companies/${companyId}/approve`,

    // auth
    REFRESH_TOKENS: 'auth/refresh-tokens',
}