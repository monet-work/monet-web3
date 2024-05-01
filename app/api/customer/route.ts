import { ROLES } from "@/models/role";
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

  const customer = await client.db.Customer.filter({
    user: user.id,
  });
  return new Response(JSON.stringify(customer), { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  if (!body.walletAddress) {
    return new Response("Invalid wallet address", { status: 400 });
  }
  const client = getXataClient();

  // check if user exists
  const user = await client.db.User.filter({
    walletAddress: body.walletAddress,
  }).getFirst();

  // fetch all roles
  const roles = await client.db.Role.getAll();

  const customerRole = roles.find((role) => role.roleId === ROLES.CUSTOMER);

  if(!customerRole) {
    return new Response("Role not found", { status: 404 });
  }

  // if user not found then create user with role Customer
  if (!user) {
    await client.db.User.create({ ...body, role: customerRole });
  }

  // check if customer exists
  const customer = await client.db.Customer.filter({
    user: user?.id,
  }).getFirst();

  if (!customer) {
    await client.db.Customer.create({
      user: user,
      points: 0,
    });
  }

  return new Response(JSON.stringify(customer), { status: 200 });
}
