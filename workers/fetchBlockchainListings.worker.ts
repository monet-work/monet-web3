// TODO: implement this in the future for better performance. currently the next js build fails when using web workers

import { monetMarketplaceContract } from "@/app/contract-utils";
import { expose } from "comlink";
import { readContract } from "thirdweb";

const fetchData = async (id: number) => {
  return await readContract({
    contract: monetMarketplaceContract,
    method: "getListing",
    params: [BigInt(id)],
  });
};

const fetchListings = async (count: number) => {
  const results = await Promise.all(
    Array.from({ length: count }, (_, i) => fetchData(i + 1)), // i + 1 because the listing starts at 1
  );
  return results;
};

expose(fetchListings);
