import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET all users (admin only)
export async function GET(req: ERequest, res: EResponse) {
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

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(500).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.json(
      { error: 'Failed to fetch users' });
  }
}

// POST create new user (admin only)
export async function POST(req: ERequest, res: EResponse) {
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

    const data = req.body;
    
    // Validate required fields
    if (!data.email || !data.name || !data.role) {
      return res.status(400).json(
        { error: 'Email, name, and role are required' });
    }

    // Validate role
    const validRoles = ['veterinarian', 'admin', 'staff', 'receptionist'];
    if (!validRoles.includes(data.role)) {
      return res.status(400).json(
        { error: 'Invalid role. Must be one of: veterinarian, admin, staff, receptionist' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json(
        { error: 'A user with this email already exists' });
    }

    // Require password to be provided
    if (!data.password || data.password.trim().length === 0) {
      return res.status(400).json(
        { error: 'Password is required' });
    }

    if (data.password.length < 6) {
      return res.status(400).json(
        { error: 'Password must be at least 6 characters long' });
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = new User({
      email: data.email.toLowerCase(),
      name: data.name,
      password: hashedPassword,
      role: data.role,
      specialization: data.specialization,
      licenseNumber: data.licenseNumber,
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json(
      { error: 'Failed to create user', details: error.message });
  }
}

