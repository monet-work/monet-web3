// write a middleware to check for accessToken in the request headers of restricted routes and return a 401 status code if the token is not present or invalid.

import { verifyAccessToken } from "./app/api/lib/utils";


const restrictedRoutes = ["/dashboard"];

export function middleware(request: Request) {
  
}