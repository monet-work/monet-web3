import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";
import { createThirdwebClient, prepareContractCall, readContract, resolveMethod, sendTransaction, toUnits } from "thirdweb";
import { privateKeyAccount } from "thirdweb/wallets";
import { elpContract } from "../lib/utils";


if(!process.env.THIRDWEB_SECRET_KEY){
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
  const user = await client.db.Customer.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const userPoints = user.points;
  // fetch the company private key linked to user. 
  // Currently the link is not there. So fetch the company private key from the database.

  const company = await client.db.Company.getFirst();

  if(!company){
    return new Response("Company not found!", { status: 404 });
  }

  const companyPrivateKey = company?.privateKey;

  if(!companyPrivateKey){
    return new Response("Private key not found!", { status: 404 });
  }

  // fetch the decimals

  const decimalsData = await readContract({ 
    contract: elpContract, 
    method: 'decimals', 
    params: [] 
  })

  // connect with the ELP contract and call the distribute tokens function

  const companyWallet = privateKeyAccount({
    client: thirdWebClient,
    privateKey: companyPrivateKey,
  });


  //prepare transaction

  const transaction = await prepareContractCall({ 
    contract: elpContract, 
    method: 'transferTokensByDistributor', 
    params: [walletAddress, toUnits(String(userPoints), decimalsData)] // use function decimals from contract to get the decimals
  });

  console.log("Transaction: ", transaction)


  const { transactionHash } = await sendTransaction({ 
    transaction, 
    account: companyWallet 
  })

  console.log("Transaction hash: ", transactionHash);
  

  // reset user's points
  await client.db.Customer.update(user.id, { points: 0 });
  // return the updated points
  return new Response(JSON.stringify({ user }), {
    status: 200,
  });

}