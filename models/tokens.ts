export const LOCALSTORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  CUSTOMER: "customer",
  COMPANY: "company",
  ADMIN: "admin",
};


export type LOCALSTORAGE_KEYS = typeof LOCALSTORAGE_KEYS[keyof typeof LOCALSTORAGE_KEYS];