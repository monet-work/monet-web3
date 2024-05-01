import { getXataClient } from "@/xata";

export async function GET(request: Request) {
  const client = getXataClient();

  const companies = await client.db.Company.select(["id", "name", "user.*", "approved"]).getMany();

  return new Response(JSON.stringify(companies), { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const { name, email, walletAddress } = body;
  if (!name || !email || !walletAddress) {
    return new Response("Invalid request", { status: 400 });
  }

  const client = getXataClient();

  // check if user already exists
  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (user) {
    return new Response("User already exists", { status: 400 });
  }

  console.log("Creating user and company", user);

  // create user
  const newUser = await client.db.User.create({ email, walletAddress });

  // create company
  const newCompany = await client.db.Company.create({ name, user: newUser.id });

  return new Response(JSON.stringify(newCompany), { status: 200 });
}
