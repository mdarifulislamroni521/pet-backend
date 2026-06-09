import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';

export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const id = req.params.id as string;
    const patient = await Patient.findById(id);
    
    if (!patient) {
      return res.status(404).json(
        { error: 'Patient not found' });
    }
    
    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return res.json(
      { error: 'Failed to fetch patient' });
  }
}

export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const body = req.body;
    
    const id = req.params.id as string;
    const patient = await Patient.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json(
        { error: 'Patient not found' });
    }
    
    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return res.json(
      { error: 'Failed to update patient' });
  }
}

export async function DELETE(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const id = req.params.id as string;
    const patient = await Patient.findByIdAndDelete(id);
    
    if (!patient) {
      return res.status(404).json(
        { error: 'Patient not found' });
    }
    
    return res.status(500).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return res.json(
      { error: 'Failed to delete patient' });
  }
}
