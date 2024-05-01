import { eigenLayerPointsContractABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { generate } from "random-words";

const eigenLayerPointsContractAddress =
  process.env.EIGENLAYER_POINTS_CONTRACT || "";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export const eigenLayerPointsContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: baseSepolia,
  // the contract's address
  address: eigenLayerPointsContractAddress,
  // OPTIONAL: the contract's abi
  abi: eigenLayerPointsContractABI,
});

export const generateRandomWords = (length: number) => {
  return generate({
    exactly: length,
    wordsPerString: 1,
    formatter: (word) => word.toLowerCase(),
  });
};

