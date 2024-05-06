import { getXataClient } from "@/xata";
import { privateKeyAccount } from "thirdweb/wallets";
import {
  createThirdwebClient,
  prepareContractCall,
  sendTransaction,
  toWei,
} from "thirdweb";
import { monetPointsFactoryContract } from "../../lib/utils";

const client = getXataClient();

const ownerWalletAddress = "0x73029Df592EC27FeDddE45a512B4c42ad35A3e7d";
const ownerWalletPrivateKey = process.env.COMPANY_WALLET_PRIVATE_KEY;

const thirdWebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const {
    walletAddress,
    companyName,
    email,
    pointsName,
    pointsSymbol,
    allPoints,
    decimalDigits,
    orderingFee,
  } = body;
  if (
    !walletAddress ||
    !companyName ||
    !email ||
    !pointsName ||
    !pointsSymbol ||
    !allPoints ||
    !decimalDigits ||
    !orderingFee
  ) {
    return new Response("Invalid request", { status: 400 });
  }

  // fetch user using wallet address and then retrieve the company
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // update user with email and name
  await client.db.User.update(user.id, { email, name: companyName });

  const company = await client.db.Company.filter({ user: user.id }).getFirst();
  if (!company) {
    return new Response("Company not found", { status: 404 });
  }

  // approve the company
  await client.db.Company.update(company.id, { name: companyName });

  if (!ownerWalletPrivateKey) {
    return new Response("Private key not found!", { status: 404 });
  }

  const ownerWallet = privateKeyAccount({
    client: thirdWebClient,
    privateKey: ownerWalletPrivateKey,
  });

  //prepare transaction

  const transaction = await prepareContractCall({
    contract: monetPointsFactoryContract,
    method: "createPoint",
    params: [
      ownerWalletAddress,
      walletAddress,
      toWei(allPoints),
      Number(decimalDigits),
      toWei(orderingFee),
      pointsName,
      pointsSymbol,
    ],
  });

  const { transactionHash } = await sendTransaction({
    transaction,
    account: ownerWallet,
  });

  // update company with pointsContractCreated to true
  await client.db.Company.update(company.id, { pointsContractCreated: true });

  const updatedCompany = await client.db.Company.filter({
    user: user.id,
  }).getFirst();

  return new Response(JSON.stringify(updatedCompany), { status: 200 });
}
