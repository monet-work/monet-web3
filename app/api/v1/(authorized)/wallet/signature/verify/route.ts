import { generateAccessTokenForUser } from "@/app/api/v1/lib/utils";
import { User, getXataClient } from "@/xata";
import { verifyEOASignature } from "thirdweb/auth";
import { USER_ROLE } from "../../../../lib/role";

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
    // create user and assign role

    const user = await client.db.User.create({
      walletAddress,
      roles: [String(USER_ROLE.COMPANY), String(USER_ROLE.CUSTOMER)], // assign company and customer role
    });

    await approveUserWallet(user);

    const userRoles = user.roles || [];

    // generate access token
    const accessToken = await generateAccessTokenForUser(user, userRoles);

    return new Response(JSON.stringify({ accessToken, user }), {
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
