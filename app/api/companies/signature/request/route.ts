import { generateRandomWords } from "@/app/api/lib/utils";
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

  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const randomMessage = generateRandomWords(3);

  return new Response(JSON.stringify({ message: randomMessage }), {
    status: 200,
  });
}