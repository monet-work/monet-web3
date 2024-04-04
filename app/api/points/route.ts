import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";

const client = getXataClient();

export async function GET() {
  // fetch data from xata
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { walletAddress, points } = payload;
  if (!walletAddress || !points) {
    return new Response("Invalid request", { status: 400 });
  }

  // retrieve user
  const user = await client.db.Customer.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  // save user's points
  await client.db.Customer.update(user.id, { points: user.points + points });
  // return the updated points
  return new Response(JSON.stringify({ points: user.points + points }), {
    status: 200,
  });
}
