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
    const newUser = await client.db.User.create({
      walletAddress,
    });

    const company = await client.db.Company.filter({
      user: newUser.id,
    }).select(["name", "user.*", "approved"]);

    if (!company) {
      return new Response("Company not found", { status: 404 });
    }

    return new Response(JSON.stringify(company), { status: 200 });
  }

  const company = await client.db.Company.filter({
    user: user.id,
  })
    .select(["name", "approved", "user.*"])
    .getFirst();

  if (!company) {
    return new Response("Company not found", { status: 404 });
  }
  return new Response(JSON.stringify(company), { status: 200 });
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
