import { Customer } from "@/xata";
import axios from "axios";

interface updatePointsVariables {
  walletAddress: string;
  points: number;
}

export const login = async (walletAddress: string) => {
  return axios.post<Customer>("/api/auth", { walletAddress });
};

export const getCustomer = async ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  return await axios.get<Customer>("/api/customer", {
    params: { walletAddress },
  });
};

export const collectPoints = async ({
  walletAddress,
  points,
}: updatePointsVariables) => {
  return axios.post<Customer>("/api/points", { walletAddress, points });
};

export const getPoints = async (walletAddress: string) => {
  return axios.get<Customer>("/api/points", { params: { walletAddress } });
};
