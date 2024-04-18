"use client";

import { elpContractABI, elpMarketplaceContractABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

const elpContractAddress = process.env.NEXT_PUBLIC_ELP_CONTRACT || "";
const elpMarketplaceContractAddress = process.env.NEXT_PUBLIC_ELP_MARKETPLACE_CONTRACT || "";

export const client = createThirdwebClient({
  clientId: clientId,
});
export { ThirdwebProvider, ConnectButton } from "thirdweb/react";

export const elpContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: baseSepolia,
  // the contract's address
  address: elpContractAddress,
  // OPTIONAL: the contract's abi
  abi: elpContractABI
});

export const elpMarketplaceContract = getContract({
  client,
  chain: baseSepolia,
  address: elpMarketplaceContractAddress,
  abi: elpMarketplaceContractABI
});