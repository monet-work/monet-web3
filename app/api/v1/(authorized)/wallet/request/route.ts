import { generateRandomWords } from "@/app/api/v1/lib/utils";


export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const { walletAddress } = body;
  if (!walletAddress) {
    return new Response("Invalid request", { status: 400 });
  }

  // generate set of random words for the company for wallet verification
  const message = generateRandomWords(3);

  return new Response(JSON.stringify({ message }), { status: 200 });
}
