import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import {
  getContractEvents,
  prepareEvent,
  readContract,
  toTokens,
} from "thirdweb";

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

const fetchAssetDataFromContract = async (
  address: string,
  userAddress: string,
) => {
  const mint = prepareEvent({
    signature: "event Mint(address,uint256)",
  });
  const events = await getContractEvents({
    contract: monetPointsContractFactory(address),
    fromBlock: "earliest",
    toBlock: "latest",
    events: [mint],
  });
  const decimals = await readContract({
    contract: monetPointsContractFactory(address),
    method: "decimals",
  });
  const pointSymbol = async () => {
    const Symboldata = await readContract({
      contract: monetPointsContractFactory(address),
      method: "symbol",
    });
    return Symboldata;
  };
  const pointName = async () => {
    const Namedata = await readContract({
      contract: monetPointsContractFactory(address),
      method: "name",
    });
    return Namedata;
  };
  const asset = async () => {
    const Assetdata = await readContract({
      contract: monetMarketplaceContract,
      method: "getAsset",
      params: [address],
    });
    return Assetdata;
  };

  const userOnChainPoints = async () => {
    const points = await readContract({
      contract: monetPointsContractFactory(address),
      method: "balanceOf",
      params: [userAddress],
    });
    return points;
  };

  const calculateMintedPoints = async () => {
    let mintedPoints = 0;
    const userEvents = events.filter((event) => event.args[0] === userAddress);
    userEvents.forEach((event) => {
      mintedPoints += Number(toTokens(BigInt(event.args[1]), decimals));
    });
    return mintedPoints;
  };

  const symbol = await pointSymbol();
  const name = await pointName();
  const assetInfo = await asset();
  const userPoints = await userOnChainPoints();
  const mintedPoints = await calculateMintedPoints();

  return {
    symbol,
    name,
    status: assetInfo.status,
    address,
    userPoints: userPoints && userPoints > 0 ? Number(userPoints) : 0,
    mintedPoints,
  };
};

const fetchMarketplaceDataFromBlockchain = async (userAddress: string) => {
  const assetAddresses = await readContract({
    contract: monetMarketplaceContract,
    method: "getAssetAddresses",
    params: [],
  });
  return await Promise.all(
    assetAddresses.map((address) =>
      fetchAssetDataFromContract(address, userAddress),
    ),
  );
};

export { fetchListingsFromBlockchain, fetchMarketplaceDataFromBlockchain };
