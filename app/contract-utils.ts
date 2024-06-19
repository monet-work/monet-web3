"use client";

import {
  MONET_MARKET_PLACE_ABI,
  MONET_POINT_CONTRACT_ABI,
  MONET_REWARD_POINTS_FACTORY_ABI,
} from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { Wallet, createWallet, injectedProvider } from "thirdweb/wallets";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
export { ThirdwebProvider, ConnectButton } from "thirdweb/react";

export const connectWallet = async (
  connect: (
    options: Wallet | (() => Promise<Wallet>),
  ) => Promise<Wallet | null>,
): Promise<Wallet | null> => {
  return connect(async () => {
    const metamask = createWallet("io.metamask");

    // if user has metamask installed, connect to it
    if (injectedProvider("io.metamask")) {
      await metamask.connect({ client });
    }

    // open wallet connect modal so user can scan the QR code and connect
    else {
      await metamask.connect({
        client,
        walletConnect: { showQrModal: true },
      });
    }

    // return the wallet
    return metamask;
  });
};

export const monetPointsContractFactory = (address: string) => {
  return getContract({
    client,
    chain: baseSepolia,
    address,
    abi: MONET_POINT_CONTRACT_ABI,
  });
};

export const monetMarketplaceContract = getContract({
  client,
  chain: baseSepolia,
  address: process.env.NEXT_PUBLIC_MONET_MARKETPLACE_CONTRACT || "",
  abi: MONET_MARKET_PLACE_ABI,
});

export const rewardPointsFactoryAddress = getContract({
  client,
  chain: baseSepolia,
  address: process.env.NEXT_PUBLIC_REWARD_POINTS_FACTORY_ADDRESS!,
  abi: MONET_REWARD_POINTS_FACTORY_ABI,
});
