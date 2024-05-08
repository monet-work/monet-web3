import { getXataClient } from "@/xata";

const client = getXataClient();

export async function POST(request: Request) {
  // extract the json  body from the request
  const body = await request.json();
  if (!body) {
    return new Response("Bad Request", { status: 400 });
  }

  const { walletAddress, customerData } = body;

  if (!walletAddress || !customerData) {
    return new Response("Bad Request", { status: 400 });
  }

  //ensure the body is as array of objects containing name, wallet and points
  if (!Array.isArray(customerData)) {
    return new Response("Bad Request", { status: 400 });
  }

  //iterate through the array and ensure each object has the required fields
  for (const item of customerData) {
    if (!item.name || !item.wallet || !item.points) {
      return new Response("Bad Request", { status: 400 });
    }
  }

  // retrieve company from user wallet address
  const companyUser = await client.db.User.filter({ walletAddress }).getFirst();
  if (!companyUser) {
    return new Response("Company not found", { status: 404 });
  }

  const company = await client.db.Company.filter({
    user: companyUser.id,
  }).getFirst();

  if (!company) {
    return new Response("Company not found", { status: 404 });
  }

  //save the data to the database

  // create users based on name, wallet
  await Promise.all(
    customerData.map(async (item) => {
      //create new user
      const user = await client.db.User.create({
        name: item.name,
        walletAddress: item.wallet,
      });

      // create new customer
      await client.db.Customer.create({
        user: user.id,
      });

      // create new Point
      await client.db.Point.create({
        owner: user.id,
        company: company.id,
        value: item.points,
      });
    })
  );

  // fetch all points for the company
  const points = await client.db.Point.filter({ company: company.id })
    .select(["value", "owner.name", "owner.walletAddress"])
    .getAll();

  return new Response(JSON.stringify(points), { status: 200 });
}
