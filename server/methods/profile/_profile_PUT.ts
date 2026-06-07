import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    await dbConnect();

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: authUser?.userID === 'demo-user' ? null : authUser?.userID }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // For demo user, just return success without updating database
    if (authUser?.userID === 'demo-user') {
      return res.json({ 
        message: 'Profile updated successfully',
        user: {
          id: authUser?.userID,
          name,
          email,
          role: authUser?.role
        }
      });
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      authUser?.userID,
      { 
        name: name.trim(),
        email: email.toLowerCase().trim()
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
