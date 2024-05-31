"use client";

import { CONTRACTS } from "@/lib/contracts";
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

// export const elpContract = getContract({
//   // the client you have created via `createThirdwebClient()`
//   client,
//   // the chain the contract is deployed on
//   chain: baseSepolia,
//   // the contract's address
//   address: CONTRACTS.ELP_CONTRACT,
//   // OPTIONAL: the contract's abi
//   abi: eigenLayerPointsContractABI,
// });

// export const elpMarketplaceContract = getContract({
//   client,
//   chain: baseSepolia,
//   address: CONTRACTS.ELP_MARKETPLACE_CONTRACT,
//   abi: elpMarketplaceContractABI,
// });

// export const airdropContract = getContract({
//   client,
//   chain: baseSepolia,
//   address: CONTRACTS.AIRDROP_CONTRACT,
//   abi: airdropContractABI,
// });

// export const eigenLayerTokenContract = getContract({
//   client,
//   chain: baseSepolia,
//   address: CONTRACTS.EIGENLAYER_TOKEN_CONTRACT,
//   abi: eigenLayerTokenContractABI,
// });

// export const monetPointsFactoryContract = getContract({
//   client,
//   chain: baseSepolia,
//   address: CONTRACTS.MONET_POINTS_FACTORY_CONTRACT,
//   abi: monetPointsFactoryContractABI
// });

export const connectWallet = async (
  connect: (options: Wallet | (() => Promise<Wallet>)) => Promise<Wallet | null>
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