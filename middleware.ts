// write a middleware to check for accessToken in the request headers of restricted routes and return a 401 status code if the token is not present or invalid.

import { verifyAccessToken } from "./app/api/lib/utils";


const restrictedRoutes = ["/dashboard"];

export function middleware(request: Request) {
  const { url } = request;
  if (restrictedRoutes.includes(url)) {
    const token = request.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      verifyAccessToken(token);
    } catch (error) {
      return new Response("Unauthorized", { status: 401 });
    }
  }
  return fetch(request);
}