import { NextResponse } from "next/server";

export const apiLoggerMiddleware = async (request: Request) => {
  // only log requests to the API
  if (!request.url.includes("/api")) {
    return NextResponse.next();
  }

  // Log information about the incoming request, including the request method, URL, and timestamp.
  console.log("API Logger Middleware", {
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
    // headers: Object.fromEntries(request.headers),
  });

  // Continue to the next Middleware or route handler.
  return NextResponse.next();
};
