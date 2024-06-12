import { getXataClient } from "@/xata";

export async function GET(request: Request) {
  // fetch query params
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("walletAddress");
  const client = getXataClient();
  if (!walletAddress) {
    return new Response("Invalid wallet address", { status: 400 });
  }
  const user = await client.db.User.filter({
    walletAddress,
  }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  return new Response(JSON.stringify(user), { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  if(!body) {
    return new Response("Invalid request", { status: 400 });
  }
  if(!body.walletAddress) {
    return new Response("Invalid wallet address", { status: 400 });
  }
  const client = getXataClient();
  const user = await client.db.User.create(body);
  return new Response(JSON.stringify(user), { status: 200 });
}
