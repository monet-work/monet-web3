import { generateAccessToken, generateAccessTokenForUser } from "@/app/api/v1/lib/utils";
import { User, getXataClient } from "@/xata";
import { verifyEOASignature } from "thirdweb/auth";
import { USER_ROLE } from "../../../../lib/role";

const client = getXataClient();

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const { walletAddress, signature, message, requestedRole } = body;
  if (!walletAddress || !signature || !message || !requestedRole) {
    return new Response("Invalid request", { status: 400 });
  }

  // check if role is valid
  if (!Object.values(USER_ROLE).includes(requestedRole)) {
    return new Response("Invalid role", { status: 400 });
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
      roles: [String(requestedRole)],
    });

    await approveUserWallet(user);

    // generate access token
    const accessToken = await generateAccessTokenForUser(user, [requestedRole]);

    const updatedCompany = await client.db.Company.filter({
      user: user.id,
    }).select(["user.*", "pointContractAddress", "name", "approved"]);

    return new Response(JSON.stringify({ accessToken }), {
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

