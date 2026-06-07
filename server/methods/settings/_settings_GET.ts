import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    // Get or create settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        systemTitle: 'AI Pet Clinic',
        clinicName: 'AI Pet Clinic',
        clinicAddress: '',
        clinicEmail: '',
        clinicPhone: '',
      });
      await settings.save();
    }

    return res.status(200).json(settings);

  } catch (error) {
    console.error('Settings fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updates = req.body;

    await dbConnect();

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updates },
      { upsert: true, new: true }
    );

    return res.json({ 
      message: 'Settings updated successfully',
      settings 
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
