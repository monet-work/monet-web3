import { getXataClient } from "@/xata";
import { privateKeyAccount } from "thirdweb/wallets";
import {
  createThirdwebClient,
  prepareContractCall,
  sendTransaction,
  toWei,
  watchContractEvents,
} from "thirdweb";
import { monetPointsFactoryContract } from "@/app/api/v1/lib/contract-helper";

const client = getXataClient();

const distributorWalletAddress = "0x73029Df592EC27FeDddE45a512B4c42ad35A3e7d";
const distributorWalletPrivateKey = process.env.COMPANY_WALLET_PRIVATE_KEY;

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
    //create company
    await client.db.Company.create({
      name: companyName,
      user: user.id,
    });
  }

  const updatedCompany = await client.db.Company.filter({
    user: user.id,
  }).getFirst();

  if (!updatedCompany) {
    return new Response("Error while creating company", { status: 500 });
  }

  // approve the company
  await client.db.Company.update(updatedCompany.id, { name: companyName });

  if (!distributorWalletPrivateKey) {
    return new Response("An error occured while interacting with the blockchain", { status: 500 });
  }

  const ownerWallet = privateKeyAccount({
    client: thirdWebClient,
    privateKey: distributorWalletPrivateKey,
  });

  //prepare transaction

  const transaction = await prepareContractCall({
    contract: monetPointsFactoryContract,
    method: "createPoint",
    params: [
      walletAddress,
      distributorWalletAddress,
      allPoints,
      Number(decimalDigits),
      toWei(orderingFee),
      pointsName,
      pointsSymbol,
    ],
  });

  const result = await sendTransaction({
    transaction,
    account: ownerWallet,
  });

  // wait for contract event
  const eventPromise = new Promise((resolve, reject) => {
    const unwatch = watchContractEvents({
      contract: monetPointsFactoryContract,
      onEvents: (events) => {
        // Check if the expected event is emitted
        const event = events.find(
          (event) => event.eventName === "PointCreated"
        );
        if (event) {
          unwatch(); // Stop watching for events
          resolve(event); // Resolve the promise with the event
        }
      },
    });
  });

  try {
    // Wait for the event or a timeout
    const event = (await Promise.race([eventPromise, timeout(60000)])) as any; // Adjust timeout as needed

    // update company with pointContractAddress
    await client.db.Company.update(updatedCompany.id, {
      pointContractAddress: event?.args?.pointAddress,
      pointName: event?.args?.name,
      pointSymbol: event?.args?.symbol,
    });

    const retrievedCompany = await client.db.Company.filter({
      user: user.id,
    }).getFirst();

    return new Response(JSON.stringify(retrievedCompany), { status: 200 });
  } catch (error) {
    // Handle timeout or any other errors
    console.error("Error occurred while waiting for contract event:", error);
    return new Response("An error occurred", { status: 500 });
  }
}

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
}
