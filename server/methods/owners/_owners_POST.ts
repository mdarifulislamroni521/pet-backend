import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import Owner from '@/models/Owner';

// GET all owners
export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const owners = await Owner.find({}).sort({ createdAt: -1 });
    return res.status(200).json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    return res.json(
      { error: 'Failed to fetch owners' });
  }
}

// POST create new owner
export async function POST(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const data = req.body;
    
    // Check if email already exists
    const existingOwner = await Owner.findOne({ email: data.email.toLowerCase() });
    if (existingOwner) {
      return res.status(400).json(
        { error: 'An owner with this email already exists' });
    }
    
    const owner = new Owner(data);
    await owner.save();
    
    return res.status(201).json(owner);
  } catch (error: any) {
    console.error('Error creating owner:', error);
    return res.status(200).json(
      { error: 'Failed to create owner', details: error.message });
  }
}

