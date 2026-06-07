import { ENextFunction, ERequest, EResponse } from "../types";

const authMiddleware = {
  UserValidator: (req: ERequest, res: EResponse, next: ENextFunction) => {
    if (req.authResponse && req.authResponse.email) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized access." });
    }
  }
};
export default authMiddleware;
