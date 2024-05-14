import { getXataClient } from "@/xata";
import { generateAccessTokenForUser } from "@/app/api/v1/lib/utils";

const client = getXataClient();

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const { walletAddress } = body;

  if (!walletAddress) {
    return new Response("Invalid request", { status: 400 });
  }

  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("Invalid Request", { status: 404 });
  }

  if (!user?.isWalletApproved) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userRoles = user?.roles;

  if (!userRoles) {
    return new Response("Unauthorized", { status: 401 });
  }

  const accessToken = await generateAccessTokenForUser(
    { id: user.id, walletAddress },
    userRoles
  );

  return new Response(JSON.stringify({ accessToken, user }), {
    status: 200,
  });
}
