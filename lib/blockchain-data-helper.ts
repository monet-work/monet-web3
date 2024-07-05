import { monetMarketplaceContract } from "@/app/contract-utils";
import { readContract } from "thirdweb";

const fetchListingData = async (id: number) => {
  return await readContract({
    contract: monetMarketplaceContract,
    method: "getListing",
    params: [BigInt(id)],
  });
};

const fetchListingsFromBlockchain = async (count: number) => {
  const results = await Promise.all(
    Array.from({ length: count }, (_, i) => fetchListingData(i + 1)), // i + 1 because the listing starts at 1
  );
  return results;
};

export { fetchListingsFromBlockchain };
