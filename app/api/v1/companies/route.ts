import { getXataClient } from "@/xata";

export async function GET(request: Request) {
  const client = getXataClient();

  const companies = await client.db.Company.select(["id", "name", "user.*", "approved"]).getMany();

  return new Response(JSON.stringify(companies), { status: 200 });
}

