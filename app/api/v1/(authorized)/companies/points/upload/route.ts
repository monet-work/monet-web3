import { getXataClient } from "@/xata";

const client = getXataClient();

export async function POST(request: Request) {
  try {
    // extract the JSON body from the request
    const body = await request.json();
    if (
      !body ||
      !body.walletAddress ||
      !body.customerData ||
      !Array.isArray(body.customerData)
    ) {
      return new Response("Bad Request", { status: 400 });
    }

    const { walletAddress, customerData } = body;

    // retrieve company from user wallet address
    const companyUser = await client.db.User.filter({
      walletAddress,
    }).getFirst();
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
      customerData.map(async (item: any) => {
        const user = await client.db.User.filter({
          walletAddress: item.wallet,
        }).getFirst();
        if (!user) {
          await client.db.User.create({
            walletAddress: item.wallet,
            name: item.name,
          });

          const newUser = await client.db.User.filter({
            walletAddress: item.wallet,
          }).getFirst();
          if (newUser) {
            const customer = await client.db.Customer.create({
              user: newUser.id,
              points: item.value,
            });

            if (!customer) {
              throw new Error("Error while creating customer");
            }

            const point = await client.db.Point.create({
              value: item.value,
              owner: customer,
              company: company.id,
            });

            if (!point) {
              throw new Error("Error while creating point");
            }
          }
        }
      })
    );

    // fetch all points for the company
    const points = await client.db.Point.filter({ company: company.id })
      .select(["value", "owner.name", "owner.user.walletAddress"])
      .getAll();

    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error: any) {
    return new Response(
      `
      Error while uploading points: ${error?.message}
    `,
      { status: 500 }
    );
  }
}
