import jwt, {
  SignOptions,
  JwtPayload,
} from "jsonwebtoken";
import env from "../config/env";

export interface CustomerJwtPayload extends JwtPayload {
  userId: string;
  type: "customer";
}

export const generateCustomerToken = (
  userId: string
): string => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const payload: CustomerJwtPayload = {
    userId,
    type: "customer",
  };

  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    env.jwtSecret,
    options
  );
};

export const verifyCustomerToken = (
  token: string
): CustomerJwtPayload => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const decoded = jwt.verify(
    token,
    env.jwtSecret
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    decoded.type !== "customer" ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid customer token");
  }

  return decoded as CustomerJwtPayload;
};