import { getXataClient } from "@/xata";

const client = getXataClient();

export async function POST(request: Request) {
  // extract the json body from the request
  const body = await request.json();
  if (!body) {
    return new Response("Bad Request", { status: 400 });
  }

  const { walletAddress, customerData } = body;

  if (!walletAddress || !customerData) {
    return new Response("Bad Request", { status: 400 });
  }

  // ensure the body is an array of objects containing name, wallet, and points
  if (!Array.isArray(customerData)) {
    return new Response("Bad Request", { status: 400 });
  }

  // iterate through the array and ensure each object has the required fields
  for (const item of customerData) {
    if (!item.name || !item.wallet || !item.value) {
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

  // save or update the data in the database
  await Promise.all(
    customerData.map(async (item) => {
      // check if the user already exists
      let user = await client.db.User.filter({
        walletAddress: item.wallet,
      }).getFirst();

      if (!user) {
        // if user doesn't exist, create a new one
        user = await client.db.User.create({
          name: item.name,
          walletAddress: item.wallet,
        });

        // create a new customer for the user
        await client.db.Customer.create({
          user: user.id,
        });
      }

      // check if the customer already exists
      let customer = await client.db.Customer.filter({
        user: user.id,
      }).getFirst();

      // if customer doesn't exist, create a new one
      if (!customer) {
        customer = await client.db.Customer.create({
          user: user.id,
        });
      }

      // check if there's already a point entry for this user and company
      let point = await client.db.Point.filter({
        owner: user.id,
        company: company.id,
      }).getFirst();

      if (point) {
        // if a point entry exists, increment the value
        await client.db.Point.update(point.id, {
          value: point.value + item.value,
        });
      } else {
        // if no point entry exists, create a new one
        await client.db.Point.create({
          owner: user.id,
          company: company.id,
          value: item.value,
        });
      }
    })
  );

  // fetch all points for the company
  const points = await client.db.Point.filter({ company: company.id })
    .select(["value", "owner.name", "owner.walletAddress"])
    .getAll();

  return new Response(JSON.stringify(points), { status: 200 });
}
