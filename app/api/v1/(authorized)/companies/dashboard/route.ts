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

  const company = await client.db.Company.filter({ user: user.id })
    .select([
      "name",
      "approved",
      "pointContractAddress",
      "pointName",
      "pointSymbol",
      "user.email",
      "user.name",
      "user.walletAddress",
    ])
    .getFirst();

  if (!company) {
    return new Response(JSON.stringify({}), { status: 200 });
  }

  // fetch points data of customers for the company
  const points = await client.db.Point.filter({ company: company.id })
    .select(["value", "owner.walletAddress", "owner.name"])
    .getAll();

  return new Response(JSON.stringify({ company, customers: points }), {
    status: 200,
  });
}
