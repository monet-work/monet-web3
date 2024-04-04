import { getXataClient } from "@/xata";

export async function GET(request: Request) {
  // fetch query params
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("walletAddress");
  const client = getXataClient();
  if (!walletAddress) {
    return new Response("Invalid wallet address", { status: 400 });
  }
  const customer = await client.db.Customer.filter({
    walletAddress,
  }).getFirst();
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response(JSON.stringify(customer), { status: 200 });
  return new Response("Hello World", { status: 200 });
}
