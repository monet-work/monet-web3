import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";

const client = getXataClient();

export async function GET(request: Request) {
  // fetch points by company wallet address as query param
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("walletAddress");
  if (!walletAddress) {
    return new Response("Invalid wallet address", { status: 400 });
  }

  // retrieve user
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // retrieve company
  const company = await client.db.Company.filter({ user: user.id }).getFirst();
  if (!company) {
    return new Response("Company not found", { status: 404 });
  }

  // retrieve points for the company
  const points = await client.db.Point.filter({ company: company.id })
    .select(["value", "owner.user.walletAddress", "owner.name"])
    .getAll();
  return new Response(JSON.stringify(points), { status: 200 });
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
  const customer = await client.db.Customer.filter({
    user: user.id,
  }).getFirst();
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  // save user's points
  await client.db.Customer.update(customer.id, {
    points: customer.points + points,
  });
  // return the updated points
  return new Response(JSON.stringify({ points: customer.points + points }), {
    status: 200,
  });
}
