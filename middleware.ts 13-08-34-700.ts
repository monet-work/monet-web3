import { NextResponse } from "next/server";
import { verifyAccessToken } from "./app/api/v1/lib/utils";

export async function middleware(request: Request) {
  const authResponse = await authMiddleware(request);

  if (authResponse instanceof Response) {
    return authResponse;
  }

  return NextResponse.next();
}

const authMiddleware = async (request: Request) => {
  const authorizedRoutes = [
    "/api/v1/auth",
    "/api/v1/companies",
    "/api/v1/company",
    "/api/v1/companies/approve",
    "/api/v1/companies/reject",
  ];


  // check if any of the routes is in the request url
  if (!authorizedRoutes.some((route) => request.url.includes(route))) {
    console.log('skipping', request.url)
    return NextResponse.next();
  }

  const accessToken = request.headers.get("Authorization");
  console.log("accessToken", accessToken);
  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // verify token
  const isValid = await verifyAccessToken(accessToken);
  if (!isValid) {
    return new Response("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
};
