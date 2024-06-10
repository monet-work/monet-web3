export const LOCALSTORAGE_KEYS = {
  ACCESS_TOKEN_DATA: "access_token_data",
  REFRESH_TOKEN_DATA: "refresh_token_data",
  CUSTOMER: "customer",
  COMPANY: "company",
  ADMIN: "admin",
  MARKETPLACE_POINTS: "marketplace_points",
  ROLES: "roles",
};

export type LOCALSTORAGE_KEYS =
  (typeof LOCALSTORAGE_KEYS)[keyof typeof LOCALSTORAGE_KEYS];
