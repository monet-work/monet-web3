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

  const user = await client.db.User.filter({ walletAddress }).getFirst();

  // check if user exists and is already isWalletApproved
  if (user?.isWalletApproved) {
    return new Response("Wallet already verified", { status: 400 });
  }

  // validate signature

  const isSignatureValid = await verifyEOASignature({
    address: walletAddress,
    signature,
    message,
  });

  if (isSignatureValid) {
    if (!user) {
      // create user
      const { user, company } = await createUserAndCompany(walletAddress);

      // generate access token
      const accessToken = await generateAccessTokenForUser(user);
      return new Response(JSON.stringify({ accessToken }), {
        status: 200,
      });
    }

    await approveUserWallet(user);

    // generate access token
    const accessToken = await generateAccessTokenForUser(user);

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
    });
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
