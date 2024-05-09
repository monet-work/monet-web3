import { getXataClient } from "@/xata";
import { generateAccessTokenForUser } from "../lib/utils";
import { USER_ROLE } from "../lib/role";

const client = getXataClient();

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }
  const { walletAddress, requestedRole } = body;

  if (!walletAddress || !requestedRole) {
    return new Response("Invalid request", { status: 400 });
  }

  // check if valid requested role
  if (!Object.values(USER_ROLE).includes(requestedRole)) {
    return new Response("Invalid role", { status: 400 });
  }

  const user = await client.db.User.filter({ walletAddress }).getFirst();
  if (!user) {
    return new Response("Invalid Request", { status: 404 });
  }
  console.log(user, "user");

  if (!user?.isWalletApproved) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userRoles = user?.roles;

  if (!userRoles) {
    // append user role to user.
    const updatedUser = await client.db.User.update(user.id, {
      roles: [String(requestedRole)],
    });

    if (!updatedUser || !updatedUser.roles) {
      return new Response("Unauthorized", { status: 401 });
    }

    const accessToken = await generateAccessTokenForUser(
      { id: user.id, walletAddress, roles: userRoles },
      updatedUser.roles
    );

    return new Response(JSON.stringify({ accessToken, user }), {
      status: 200,
    });
  }

  // if role is not already assigned to user, append it to user roles
  if (!userRoles.includes(String(requestedRole))) {
    await client.db.User.update(user.id, {
      roles: [...userRoles, String(requestedRole)],
    });

    const updatedUser = await client.db.User.filter({
      walletAddress,
    }).getFirst();

    if (!updatedUser || !updatedUser.roles) {
      return new Response("Unauthorized", { status: 401 });
    }

    const accessToken = await generateAccessTokenForUser(
      { id: user.id, walletAddress, roles: userRoles },
      updatedUser.roles
    );

    return new Response(JSON.stringify({ accessToken, user }), {
      status: 200,
    });
  }

  const accessToken = await generateAccessTokenForUser(
    { id: user.id, walletAddress, roles: userRoles },
    userRoles
  );

  return new Response(JSON.stringify({ accessToken, user }), {
    status: 200,
  });
}
