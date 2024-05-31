export const LOCALSTORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  ACCESS_TOKEN_EXPIRY: "access_token_expiry",
  REFRESH_TOKEN_EXPIRY: "refresh_token_expiry",
  CUSTOMER: "customer",
  COMPANY: "company",
  ADMIN: "admin",
};

export type LOCALSTORAGE_KEYS =
  (typeof LOCALSTORAGE_KEYS)[keyof typeof LOCALSTORAGE_KEYS];
