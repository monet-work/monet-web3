import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";
import { generateAccessToken, verifyAccessToken } from "../lib/utils";

const client = getXataClient();

export async function POST(request: NextRequest) {
  // fetch access token from header
  const accessToken = request.headers.get("Authorization");

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await request.json();
  const { walletAddress } = payload;
  if (!walletAddress) {
    return new Response("Invalid request", { status: 400 });
  }

  if (accessToken && !verifyAccessToken(accessToken)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const loggedInUser = await client.db.User.filter({
    walletAddress: walletAddress,
  }).getFirst();

  if (!loggedInUser) {
    return new Response("User not found", { status: 404 });
  }

  const newAccessToken = generateAccessToken(
    { id: loggedInUser.id, walletAddress },
    "30d"
  );

  return new Response(
    JSON.stringify({ accessToken: newAccessToken, user: loggedInUser }),
    {
      status: 200,
    }
  );
}
