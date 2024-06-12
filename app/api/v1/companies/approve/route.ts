import { getXataClient } from "@/xata";

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

  // fetch user using wallet address and then retrieve the company
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const company = await client.db.Company.filter({ user: user.id }).getFirst();
  if (!company) {
    return new Response("Company not found", { status: 404 });
  }

  // approve the company
  await client.db.Company.update(company.id, { approved: true });

  return new Response(JSON.stringify(company), { status: 200 });
}
