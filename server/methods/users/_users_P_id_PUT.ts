
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET single user by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    await dbConnect();
    const currentUser = await User.findOne({ email: authUser?.email });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = await params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json(
        { error: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.json(
      { error: 'Failed to fetch user' });
  }
}

// PUT update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    await dbConnect();
    const currentUser = await User.findOne({ email: authUser?.email });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = await params;
    const data = req.body;

    // Validate role if provided
    if (data.role) {
      const validRoles = ['veterinarian', 'admin', 'staff', 'receptionist'];
      if (!validRoles.includes(data.role)) {
        return res.status(400).json(
          { error: 'Invalid role. Must be one of: veterinarian, admin, staff, receptionist' });
      }
    }

    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await User.findOne({ 
        email: data.email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json(
          { error: 'A user with this email already exists' });
      }
      data.email = data.email.toLowerCase();
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    } else {
      // Don't update password if not provided
      delete data.password;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json(
        { error: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.json(
      { error: 'Failed to update user', details: error.message });
  }
}

// DELETE user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    await dbConnect();
    const currentUser = await User.findOne({ email: authUser?.email });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = await params;

    // Prevent admin from deleting themselves
    if (currentUser._id.toString() === id) {
      return res.status(400).json(
        { error: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json(
        { error: 'User not found' });
    }
    
    return res.status(500).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.json(
      { error: 'Failed to delete user' });
  }
}

