import { isAuthenticated } from "@/app/api/v1/lib/utils";
import { NextResponse } from "next/server";

const authorizedRoutes = [
  "/api/v1/auth",
  "/api/v1/companies",
  "/api/v1/company",
  "/api/v1/companies/approve",
  "/api/v1/companies/reject",
  "/api/v1/redeem",
  "/api/v1/customer/points",
];

export const apiAuthenticationMiddleware = async (request: Request) => {
  // only log requests to the API
  if (!request.url.includes("/api")) {
    return NextResponse.next();
  }

  // check if any of the routes is in the request url
  if (!authorizedRoutes.some((route) => request.url.includes(route))) {
    return NextResponse.next();
  }

  console.log("API Authentication Middleware");

  const isUserAuthenticated = isAuthenticated(request);

  if (!isUserAuthenticated) {
    return new Response("Unauthenticated", { status: 401 });
  }

  // Continue to the next Middleware or route handler.
  return NextResponse.next();
};
