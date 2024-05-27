import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { USER_ROLE } from "@/models/role";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCustomerData = (
  data: {
    Name: string;
    "Wallet Address": string;
    Points: number;
  }[]
) => {
  return data.map((item) => {
    return {
      name: item["Name"],
      wallet: item["Wallet Address"],
      value: item["Points"],
    };
  });
};

export const parseJWT = (jwt: string) => {
  const base64Url = jwt.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const extractLoggedInUserRoles = (jwt: string) => {
  const parsedJWT = parseJWT(jwt);
  if (!parsedJWT.roles) return [];

  return parsedJWT.roles as (typeof USER_ROLE)[keyof typeof USER_ROLE][];
};


export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));