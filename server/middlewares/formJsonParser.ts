import { ENextFunction, ERequest, EResponse } from "../types";

const formJsonParser = async (req: ERequest, res: EResponse, next: ENextFunction) => {
  try {
    if (req.is("multipart/form-data")) {
      const parsedBody: any = { ...req.body };
      for (const key in req.body) {
        try { parsedBody[key] = JSON.parse(req.body[key]); } catch {}
      }
      req.body = parsedBody;
    }
    return next();
  } catch { return next(); }
};

export default formJsonParser;
