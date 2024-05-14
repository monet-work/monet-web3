import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";
import { generateAccessTokenForUser } from "@/app/api/v1/lib/utils";

const client = getXataClient();

export async function POST(request: NextRequest) {
  
  const payload = await request.json();
  const { walletAddress } = payload;

  if (!walletAddress) {
    return new Response("Invalid request", { status: 400 });
  }

  // check if user already exists
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  const userRoles = user?.roles;
  if (!user) {
    return new Response("Not found", { status: 404 });
  }

  if (!userRoles) {
    return new Response("Unauthorized", { status: 401 });
  }

  // generate access token
  const accessToken = await generateAccessTokenForUser(
    { id: user.id, walletAddress, roles: userRoles },
    userRoles
  );
  return new Response(JSON.stringify({ accessToken, user }), {
    status: 200,
  });
}
