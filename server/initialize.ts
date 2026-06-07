import { ENextFunction, ERequest, EResponse } from "./types";
import authMiddleware from "./middlewares/auth";

const initialize = async (req: ERequest, res: EResponse, next: ENextFunction) => {
  try {
    req.authResponse = null;
    req.host_name = "localhost";
    next();
  } catch {
    return res.status(500).json({ message: "Init error" });
  }
};

export default initialize;
