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
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // retrieve customer
  const customer = await client.db.Customer.filter({ user: user.id }).getFirst();
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  // save user's points
  await client.db.Customer.update(customer.id, { points: customer.points + points });
  // return the updated points
  return new Response(JSON.stringify({ points: customer.points + points }), {
    status: 200,
  });
}
