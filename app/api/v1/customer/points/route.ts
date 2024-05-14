import { Customer, getXataClient } from "@/xata";

const client = getXataClient();

export async function GET(request: Request) {
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

    // create customer (to be refactored. Cannot create user unless wallet is verified)
    const customer = await client.db.Customer.create({
      user: newUser,
    });

    // fetch points for user

    const points = await getPointsForCustomer(customer as Customer);

    return new Response(JSON.stringify(points), { status: 200 });
  }

  const customer = await client.db.Customer.filter({
    user: user.id,
  }).getFirst();

  const points = await getPointsForCustomer(customer as Customer);

  return new Response(JSON.stringify(points), { status: 200 });
}

const getPointsForCustomer = async (customer: Customer) => {
  const points = await client.db.Point.filter({
    owner: customer.user,
  })
    .select([
      "value",
      "company.name",
      "owner.*",
      "company.pointName",
      "company.pointSymbol",
    ])
    .getAll();

  if (!points) {
    return [];
  }

  return points;
};
