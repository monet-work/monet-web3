"use client";

import { CONTRACTS } from "@/lib/contracts";
import { airdropContractABI, eigenLayerPointsContractABI, eigenLayerTokenContractABI, elpMarketplaceContractABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}


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
  address: CONTRACTS.ELP_CONTRACT,
  // OPTIONAL: the contract's abi
  abi: eigenLayerPointsContractABI
});

export const elpMarketplaceContract = getContract({
  client,
  chain: baseSepolia,
  address: CONTRACTS.ELP_MARKETPLACE_CONTRACT,
  abi: elpMarketplaceContractABI
});

export const airdropContract = getContract({
  client,
  chain: baseSepolia,
  address: CONTRACTS.AIRDROP_CONTRACT,
  abi: airdropContractABI
});

export const eigenLayerTokenContract = getContract({
  client,
  chain: baseSepolia,
  address: CONTRACTS.EIGENLAYER_TOKEN_CONTRACT,
  abi: eigenLayerTokenContractABI
});