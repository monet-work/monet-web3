import { MONET_POINT_CONTRACT_ABI } from "@/models/abi";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const eigenLayerPointsContractAddress =
  process.env.EIGENLAYER_POINTS_CONTRACT || "";

const monetPointsFactoryContractAddress =
  process.env.MONET_POINT_FACTORY_CONTRACT || "";

export const thirdWebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});


// export const monetPointsFactoryContract = getContract({
//   client: thirdWebClient,
//   chain: baseSepolia,
//   address: monetPointsFactoryContractAddress,
//   abi: monetPointsFactoryContractABI,
// });

