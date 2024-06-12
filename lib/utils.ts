import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
