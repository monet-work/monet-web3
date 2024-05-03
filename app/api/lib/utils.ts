import { eigenLayerPointsContractABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { generate } from "random-words";
import jwt from "jsonwebtoken";

const eigenLayerPointsContractAddress =
  process.env.EIGENLAYER_POINTS_CONTRACT || "";

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

export const generateRandomWords = (length: number) => {
  return generate({
    exactly: length,
    wordsPerString: 1,
    formatter: (word) => word.toLowerCase(),
  });
};

export const generateAccessToken = (payload: any, expiresInSeconds: string) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresInSeconds,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
