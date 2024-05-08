import { getXataClient } from "@/xata";
import { generateAccessToken } from "../../lib/utils";

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

  if (user) {
    const accessToken = generateAccessToken(
      { id: user.id, walletAddress },
      "30d"
    );

    return new Response(JSON.stringify({ accessToken, user }), {
      status: 200,
    });
  }

  return new Response("Unauthorized", { status: 401 });
}
