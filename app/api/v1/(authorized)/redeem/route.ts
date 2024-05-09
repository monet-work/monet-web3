import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";
import {
  createThirdwebClient,
  prepareContractCall,
  readContract,
  sendTransaction,
  toUnits,
} from "thirdweb";
import { privateKeyAccount } from "thirdweb/wallets";
import { eigenLayerPointsContract as elpContract } from "../../lib/utils";

const companyWalletPrivateKey = process.env.COMPANY_WALLET_PRIVATE_KEY;

if (!process.env.THIRDWEB_SECRET_KEY) {
  throw new Error("THIRDWEB_SECRET_KEY not found!");
}

const client = getXataClient();
const thirdWebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { walletAddress } = payload;
  if (!walletAddress) {
    return new Response("Invalid request", { status: 400 });
  }

  // retrieve user
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // retrieve customer
  const customer = await client.db.Customer.filter({
    user: user.id,
  }).getFirst();

  if (!customer) {
    return new Response("Customer not found!", { status: 404 });
  }

  const customerPoints = customer?.points;

  // const company = await client.db.Company.getFirst();

  // if(!company){
  //   return new Response("Company not found!", { status: 404 });
  // }

  const companyPrivateKey = companyWalletPrivateKey; // using a default key as of now

  if (!companyPrivateKey) {
    return new Response("Private key not found!", { status: 404 });
  }

  // fetch the decimals

  const decimalsData = await readContract({
    contract: elpContract,
    method: "decimals",
    params: [],
  });

  // connect with the ELP contract and call the distribute tokens function

  const companyWallet = privateKeyAccount({
    client: thirdWebClient,
    privateKey: companyPrivateKey,
  });

  //prepare transaction

  const transaction = await prepareContractCall({
    contract: elpContract,
    method: "transferTokensByDistributor",
    params: [walletAddress, toUnits(String(customerPoints), decimalsData)], // use function decimals from contract to get the decimals
  });

  const { transactionHash } = await sendTransaction({
    transaction,
    account: companyWallet,
  });

  // reset user's points
  await client.db.Customer.update(customer.id, { points: 0 });

  // return the updated points
  return new Response(JSON.stringify({ transactionHash }), {
    status: 200,
  });
}
