import { generateAccessToken } from "@/app/api/lib/utils";
import { User, getXataClient } from "@/xata";
import { verifyEOASignature } from "thirdweb/auth";

const client = getXataClient();

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const { walletAddress, signature, message } = body;
  if (!walletAddress || !signature || !message) {
    return new Response("Invalid request", { status: 400 });
  }

  // validate signature

  const isSignatureValid = await verifyEOASignature({
    address: walletAddress,
    signature,
    message,
  });

  if (isSignatureValid) {
    // create user
    const { user, company } = await createUserAndCompany(walletAddress);


    await approveUserWallet(user);

    // generate access token
    const accessToken = await generateAccessTokenForUser(user);

    const updatedCompany = await client.db.Company.filter({
      user: user.id,
    }).select([
      "user.*",
      "pointContractAddress",
      "name",
      "approved",
    ]);

    return new Response(
      JSON.stringify({ company: updatedCompany, accessToken }),
      {
        status: 200,
      }
    );
  } else {
    return new Response("Invalid signature", { status: 400 });
  }
}

const createUserAndCompany = async (walletAddress: string) => {
  const user = await client.db.User.create({
    walletAddress,
  });

  const company = await client.db.Company.create({
    user: user.id,
  });

  return { user, company };
};

const approveUserWallet = async (user: User) => {
  await client.db.User.update(user.id, {
    isWalletApproved: true,
  });
};

const generateAccessTokenForUser = async (user: User) => {
  const accessToken = generateAccessToken(
    { id: user.id, walletAddress: user.walletAddress },
    "30d"
  );
  return accessToken;
};
