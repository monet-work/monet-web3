import { eigenLayerPointsContractABI, monetPointsFactoryContractABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const eigenLayerPointsContractAddress =
  process.env.EIGENLAYER_POINTS_CONTRACT || "";

const monetPointsFactoryContractAddress =
  process.env.MONET_POINT_FACTORY_CONTRACT || "";

export const thirdWebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export const eigenLayerPointsContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client: thirdWebClient,
  // the chain the contract is deployed on
  chain: baseSepolia,
  // the contract's address
  address: eigenLayerPointsContractAddress,
  // OPTIONAL: the contract's abi
  abi: eigenLayerPointsContractABI,
});

export const monetPointsFactoryContract = getContract({
  client: thirdWebClient,
  chain: baseSepolia,
  address: monetPointsFactoryContractAddress,
  abi: monetPointsFactoryContractABI,
});