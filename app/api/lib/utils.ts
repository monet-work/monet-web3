
import { elpContractABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const elpContractAddress = process.env.ELP_CONTRACT || '';

const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  });

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
  