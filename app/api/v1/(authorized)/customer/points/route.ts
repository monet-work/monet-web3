import { getXataClient } from "@/xata";

const client = getXataClient();
export async function GET(request: Request) {
  // fetch query params
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("walletAddress");
  if (!walletAddress) {
    return new Response("Invalid wallet address", { status: 400 });
  }
  const user = await client.db.User.filter({
    walletAddress,
  }).getFirst();

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const customer = await client.db.Customer.filter({
    user: user.id,
  }).getFirst();

  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }

  try {
    const points = await client.db.Point.filter({ owner: customer.id })
      .select([
        "value",
        "company.name",
        "company.pointName",
        "company.pointSymbol",
        "owner.email",
        "owner.walletAddress",
      ])
      .getAll();

    if (!points) {
      return new Response("Points not found", { status: 404 });
    }

    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    return new Response("Error fetching points", { status: 500 });
  }
}
