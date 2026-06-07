import { ERequest, EResponse } from "../../types";

export async function GET(req: ERequest, res: EResponse) {
  const isDemo = process.env.demo === 'true';
  return res.json({ isDemo });
}

