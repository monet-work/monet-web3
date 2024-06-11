export const LOCALSTORAGE_KEYS = {
  CUSTOMER: "customer",
  COMPANY: "company",
  ADMIN: "admin",
  MARKETPLACE_POINTS: "marketplace_points",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export type LOCALSTORAGE_KEYS =
  (typeof LOCALSTORAGE_KEYS)[keyof typeof LOCALSTORAGE_KEYS];
