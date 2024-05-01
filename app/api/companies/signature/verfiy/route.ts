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

  // validate signature

  const isSignatureValid = await verifyEOASignature({
    address: walletAddress,
    signature,
    message,
  });

  if (isSignatureValid) {
    const user = await client.db.User.filter({ walletAddress }).getFirst();
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await client.db.User.update(user.id, { isWalletApproved: true });

    const company = await client.db.Company.filter({
      user: user.id,
    }).getFirst();
    if (!company) {
      return new Response("Company not found", { status: 404 });
    }

    await client.db.Company.update(company.id, { approved: true });

    return new Response(JSON.stringify(company), { status: 200 });
  }
}
