import { apiLoggerMiddleware } from "@/lib/middlewares/server/apiLoggerMiddleware";
import { apiAuthenticationMiddleware } from "./lib/middlewares/server/apiAuthenticationMiddleware";

export async function middleware(request: Request) {
  //server side middleware
  await apiLoggerMiddleware(request);
  await apiAuthenticationMiddleware(request);


  // client side middleware
}
