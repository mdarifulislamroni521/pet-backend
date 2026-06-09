import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET all veterinarians (authenticated users only)
export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;

    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    const searchParams = { get: (key: string) => req.query[key] as string };
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    let searchFilter: any = { role: 'veterinarian' };

    if (search.trim()) {
      // Search by name, email, specialization, or license number
      searchFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch veterinarians with search filter
    const veterinarians = await User.find(searchFilter)
      .select('name email specialization licenseNumber image')
      .limit(limit)
      .sort({ name: 1 });

    return res.status(200).json(veterinarians);
  } catch (error) {
    console.error('Error fetching veterinarians:', error);
    return res.json(
      { error: 'Failed to fetch veterinarians' });
  }
}
