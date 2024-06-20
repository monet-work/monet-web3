import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { USER_ROLE } from "@/models/role";
import { Token } from "@/models/company.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCustomerData = (
  data: {
    Name: string;
    "Wallet Address": string;
    Points: number;
  }[],
) => {
  return data.map((item) => {
    return {
      name: item["Name"],
      walletAddress: item["Wallet Address"],
      points: item["Points"],
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
      .join(""),
  );

  return JSON.parse(jsonPayload);
};

export const extractLoggedInUserRoles = (jwt: string) => {
  const parsedJWT = parseJWT(jwt);
  if (!parsedJWT.roles) return [];

  return parsedJWT.roles as (typeof USER_ROLE)[keyof typeof USER_ROLE][];
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Helper function to check if a URL matches a dynamic pattern
 *
 * @param url the URL to check
 * @param pattern the dynamic pattern to match against
 * @returns true if the URL matches the pattern, false otherwise
 */
export const matchesDynamicRoute = (url: string, pattern: string) => {
  // Decode the URL path
  const decodedUrl = decodeURIComponent(url).replace(/ /g, "");

  // Strip query parameters if present
  const [urlPath] = decodedUrl.split("?");

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

/**
 * Check if a token is expired
 *
 * @param token
 * @returns
 */
export const isTokenExpired = (token: Token) => {
  return new Date(token.expires).getTime() < Date.now();
};
