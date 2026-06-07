import { ENextFunction, ERequest, EResponse } from "../types";

const authMiddleware = {
  CpAuthValidator: (req: ERequest, res: EResponse, next: ENextFunction) => {
    if (req.authResponse && req.authResponse.tokenID) {
      next(); // task is authenticated
    } else {
      res.status(401).json({
        message: "Unauthorized access. Please provide a valid user.",
      });
    }
  },
  UserValidator: (req: ERequest, res: EResponse, next: ENextFunction) => {
    if (req.authResponse && req.authResponse.tokenID) {
      next(); // task is authenticated
    } else {
      res.status(401).json({
        message: "Unauthorized access. Please provide a valid user.",
      });
    }
  },
  reqHeaderInit: async (
    req: ERequest,
    res: EResponse,
    headers?: { [key: string]: any }
  ) => {
    try {
      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          res.set(key, value);
        }
      } else {
        for (const [key, value] of Object.entries(req.headers)) {
          res.set(key, value);
        }
      }
      return true;
    } catch {
      return true;
    }
  },
};

export default authMiddleware;
