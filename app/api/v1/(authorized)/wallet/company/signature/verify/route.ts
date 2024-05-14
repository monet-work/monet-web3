import { USER_ROLE } from "@/app/api/v1/lib/role";
import { generateAccessTokenForUser } from "@/app/api/v1/lib/utils";
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

  // check if user already exists
  const user = await client.db.User.filter({ walletAddress }).getFirst();

  // check if user wallet is already approved
  if (user?.isWalletApproved) {
    return new Response("Wallet already approved", { status: 400 });
  }

  if (user && !user.isWalletApproved) {
    await approveUserWallet(user);
    // if user does not have roles or does not have company role, assign company role
    if (!user.roles || !user.roles.includes(String(USER_ROLE.COMPANY))) {
      await client.db.User.update(user.id, {
        roles: [String(USER_ROLE.COMPANY)],
      });
    }

    const userRoles = user.roles || [];

    // generate access token
    const accessToken = await generateAccessTokenForUser(user, userRoles);

    const updatedUser = await client.db.User.filter({
      walletAddress,
    }).getFirst();

    return new Response(JSON.stringify({ accessToken, user: updatedUser }), {
      status: 200,
    });
  }

  // validate signature
  const isSignatureValid = await verifyEOASignature({
    address: walletAddress,
    signature,
    message,
  });

  if (isSignatureValid) {
    // create user and assign role

    const user = await client.db.User.create({
      walletAddress,
      roles: [String(USER_ROLE.COMPANY)],
    });

    await approveUserWallet(user);

    const userRoles = user.roles || [];

    // generate access token
    const accessToken = await generateAccessTokenForUser(user, userRoles);

    const updatedUser = await client.db.User.filter({
      walletAddress,
    }).getFirst();

    return new Response(JSON.stringify({ accessToken, user: updatedUser }), {
      status: 200,
    });
  } else {
    return new Response("Invalid signature", { status: 400 });
  }
}

const approveUserWallet = async (user: User) => {
  await client.db.User.update(user.id, {
    isWalletApproved: true,
  });
};
