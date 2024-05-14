import { USER_ROLE } from "@/app/api/v1/lib/role";
import { isAuthenticated, isAuthorized } from "@/app/api/v1/lib/utils";
import { NextResponse } from "next/server";

const companyRoleRoutes = ["/api/v1/companies", "/api/v1/company"];
const customerRoleRoutes = ["/api/v1/customer"];

export const apiAuthorizationMiddleware = async (request: Request) => {
  // only log requests to the API
  if (!request.url.includes("/api")) {
    return NextResponse.next();
  }

  // match only company and customer routes
  const isCompanyRoute = companyRoleRoutes.some((route) =>
    request.url.includes(route)
  );

  const isCustomerRoute = customerRoleRoutes.some((route) =>
    request.url.includes(route)
  );

  if (!isCompanyRoute && !isCustomerRoute) {
    return NextResponse.next();
  }

  console.log("API Authorization Middleware");

  if (isCompanyRoute) {
    const isUserAuthorized = isAuthorized(request, String(USER_ROLE.COMPANY));
    if (!isUserAuthorized) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  if (isCustomerRoute) {
    const isUserAuthorized = isAuthorized(request, String(USER_ROLE.CUSTOMER));
    if (!isUserAuthorized) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  // Continue to the next Middleware or route handler.
  return NextResponse.next();
};
