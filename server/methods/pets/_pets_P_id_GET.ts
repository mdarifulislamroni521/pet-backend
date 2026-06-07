
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import { ERequest, EResponse } from '../../types';
export async function GET(
  req: ERequest,
  res: EResponse
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const { id } = await req.params;
    const pet = await Pet.findById(id);
    
    if (!pet) {
      return res.status(404).json(
        { error: 'Pet not found' });
    }
    
    return res.status(200).json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    return res.json(
      { error: 'Failed to fetch pet' });
  }
}

export async function PUT(
  req: ERequest,
  res: EResponse
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const body = req.body;
    
    const { id } = await req.params;
    const pet = await Pet.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!pet) {
      return res.status(404).json(
        { error: 'Pet not found' });
    }
    
    return res.status(200).json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    return res.json(
      { error: 'Failed to update pet' });
  }
}

export async function DELETE(
  req: ERequest,
  res: EResponse
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    
    if (!pet) {
      return res.status(404).json(
        { error: 'Pet not found' });
    }
    
    return res.status(500).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return res.json(
      { error: 'Failed to delete pet' });
  }
}


