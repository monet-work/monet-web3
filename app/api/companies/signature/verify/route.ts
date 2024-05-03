import { generateAccessToken } from "@/app/api/lib/utils";
import { getXataClient } from "@/xata";
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
      return new Response("User not found", { status: 404 });
    }

    await client.db.User.update(user.id, {
      isWalletApproved: true,
    });

    // generate access token
    const accessToken = generateAccessToken(
      { id: user.id, walletAddress },
      "30d"
    );
    
    const company = await client.db.Company.filter({
      user: user.id,
    }).getFirst();

    if (!company) {
      //create company
      await client.db.Company.create({
        user: user.id,
      });
      return new Response(JSON.stringify({ accessToken }), {
        status: 200,
      });
    }

    // await client.db.Company.update(company.id);

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
    });
  }
}
