import { ERequest, EResponse } from "../../types";

export async function GET(req: ERequest, res: EResponse) {
  const isDemo = process.env.DEMO_MODE === 'true';
  return res.json({ isDemo });
}

