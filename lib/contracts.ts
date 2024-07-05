import { createThirdwebClient, getContract } from "thirdweb";

export const CONTRACTS = {
  ELP_CONTRACT: process.env.NEXT_PUBLIC_EIGENLAYER_POINTS_CONTRACT || "",
  ELP_MARKETPLACE_CONTRACT:
    process.env.NEXT_PUBLIC_ELP_MARKETPLACE_CONTRACT || "",
  AIRDROP_CONTRACT: process.env.NEXT_PUBLIC_AIRDROP_CONTRACT || "",
  EIGENLAYER_TOKEN_CONTRACT:
    process.env.NEXT_PUBLIC_EIGENLAYER_TOKEN_CONTRACT || "",
  MONET_POINTS_FACTORY_CONTRACT:
    process.env.NEXT_PUBLIC_MONET_POINTS_FACTORY_CONTRACT || "",
};

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
