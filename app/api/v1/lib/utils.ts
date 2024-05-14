import { generate } from "random-words";
import jwt from "jsonwebtoken";
import { User } from "@/xata";

export const generateRandomWords = (length: number) => {
  return generate({
    exactly: length,
    wordsPerString: 1,
    formatter: (word) => word.toLowerCase(),
  });
};

const generateAccessToken = (payload: any, expiresInSeconds: string) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresInSeconds,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const generateAccessTokenForUser = async (
  user: User,
  roles: string[]
) => {
  const accessToken = generateAccessToken(
    { id: user.id, walletAddress: user.walletAddress, roles: roles },
    "30d"
  );
  return accessToken;
};

export const parseAccessToken = (token: string) => {
  return jwt.decode(token);
};

const extractAccessTokenFromRequestHeaders = (request: Request) => {
  const { headers } = request;
  const authorization = headers.get("Authorization");
  if (!authorization) {
    return null;
  }
  const token = authorization.split(" ")[1];
  return token;
};

export const isAuthenticated = (request: Request): boolean => {
  const token = extractAccessTokenFromRequestHeaders(request);
  if (!token) {
    return false;
  }
  try {
    verifyAccessToken(token);
    return true;
  } catch (error) {
    return false;
  }
};

export const isAuthorized = (request: Request, role: string): boolean => {
  const token = extractAccessTokenFromRequestHeaders(request);
  if (!token) {
    return false;
  }
  try {
    const parsed = parseAccessToken(token) as {
      roles: string[];
      walletAddress: string;
      userId: string;
    };
    return parsed.roles.includes(role);
  } catch (error) {
    return false;
  }
};
