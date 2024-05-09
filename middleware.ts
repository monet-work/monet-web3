import { NextResponse } from "next/server";
import { verifyAccessToken } from "./app/api/v1/lib/utils";

let count = 0;
export async function middleware(request: Request) {
  // console.log("middleware hello", count++, request.url);

  const authResponse = await authMiddleware(request);

  if (authResponse instanceof Response) {
    return authResponse;
  }

  return NextResponse.next();
}

const authMiddleware = async (request: Request) => {
  const routes = [
    "/api/v1/auth",
    "/api/v1/companies",
    "/api/v1/company",
    "/api/v1/company",
    "/api/v1/companies/approve",
    "/api/v1/companies/reject",
    "/api/v1/companies/request",
    "/api/v1/company",
  ];

  // check if any of the routes is in the request url
  if (!routes.some((route) => request.url.includes(route))) {
    return NextResponse.next();
  }
  
  console.log("authMiddleware", request.url);
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
