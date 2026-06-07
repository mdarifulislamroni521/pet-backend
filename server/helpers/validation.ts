import { cpauthInterface, ENextFunction, ERequest, EResponse } from "../types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export const authValidator: { (roles?: string[]): cpauthInterface } = (roles = ["Administrator", "Veterinarian", "Staff", "Receptionist"]) => {
  return async (req: ERequest, res: EResponse, next: ENextFunction) => {
    try {
      const access_token = req.cookies?.["token"] || req.headers.authorization?.split(" ")[1];
      if (access_token) {
        const decoded = jwt.verify(access_token, JWT_SECRET) as any;
        if (decoded && roles.includes(decoded.role)) {
          req.authResponse = decoded;
          req.authenticated = true;
          return next();
        }
      }
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
