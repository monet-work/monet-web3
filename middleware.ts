import { apiLoggerMiddleware } from "@/lib/middlewares/server/apiLoggerMiddleware";
import { apiAuthenticationMiddleware } from "./lib/middlewares/server/apiAuthenticationMiddleware";
import { apiAuthorizationMiddleware } from "./lib/middlewares/server/apiAuthorizationMiddleware";

export async function middleware(request: Request) {
  //server side middleware
  await apiLoggerMiddleware(request);
  await apiAuthenticationMiddleware(request);
  await apiAuthorizationMiddleware(request);


  // client side middleware
}
