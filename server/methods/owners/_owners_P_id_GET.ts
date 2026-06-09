import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';


// GET single owner by ID
export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const id = req.params.id as string;
    
    const owner = await Owner.findById(id);
    
    if (!owner) {
      return res.status(404).json(
        { error: 'Owner not found' });
    }
    
    // Get all pets belonging to this owner
    const pets = await Pet.find({ ownerEmail: owner.email });
    
    return res.status(500).json({
      ...owner.toObject(),
      pets
    });
  } catch (error) {
    console.error('Error fetching owner:', error);
    return res.json(
      { error: 'Failed to fetch owner' });
  }
}

// PUT update owner
export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const id = req.params.id as string;
    const data = req.body;
    
    const owner = await Owner.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!owner) {
      return res.status(404).json(
        { error: 'Owner not found' });
    }
    
    return res.status(200).json(owner);
  } catch (error: any) {
    console.error('Error updating owner:', error);
    return res.json(
      { error: 'Failed to update owner', details: error.message });
  }
}

// DELETE owner
export async function DELETE(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const id = req.params.id as string;
    
    // Check if owner has any pets
    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json(
        { error: 'Owner not found' });
    }
    
    const petCount = await Pet.countDocuments({ ownerEmail: owner.email });
    if (petCount > 0) {
      return res.status(400).json(
        { error: `Cannot delete owner. They have ${petCount} pet(s) registered. Please reassign or delete the pets first.` });
    }
    
    await Owner.findByIdAndDelete(id);
    
    return res.status(500).json({ message: 'Owner deleted successfully' });
  } catch (error) {
    console.error('Error deleting owner:', error);
    return res.json(
      { error: 'Failed to delete owner' });
  }
}

