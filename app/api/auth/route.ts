import { getXataClient } from "@/xata";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    // handle POST request
    const payload = await request.json();
    const { walletAddress } = payload;
    if(!walletAddress) {
        return new Response("Invalid wallet address", { status: 400 });
    }

    // fetch data from xata
    const client = getXataClient();
    const loggedInUser = await client.db.User.filter({ walletAddress: walletAddress }).getFirst();
    if(!loggedInUser) {
        return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(loggedInUser), { status: 200 });
}