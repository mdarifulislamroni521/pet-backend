import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    await dbConnect();

    // Find user in database
    const user = await User.findById(authUser?.userID);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check current password - user must have a password set
    if (!user.password) {
      return res.status(403).json({ 
        error: 'Password change not allowed. User has no password set. Please contact administrator.' 
      });
    }

    // Verify current password using bcrypt
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await User.findByIdAndUpdate(
      authUser?.userID,
      { password: hashedNewPassword }
    );

    return res.json({ 
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
