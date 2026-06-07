import { ERequest, EResponse } from "../../types";

import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';

export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const pets = await Pet.find({}).sort({ createdAt: -1 });
    return res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return res.status(500).json({ error: 'Failed to fetch pets' });
  }
}

export async function POST(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const body = req.body;
    
    // Debug: Log the incoming data
    console.log('Incoming pet data:', JSON.stringify(body, null, 2));
    
    // Clean up the data
    const cleanedData: any = {
      name: body.name,
      species: body.species,
      breed: body.breed,
      gender: body.gender,
      ownerName: body.ownerName,
      ownerEmail: body.ownerEmail,
      ownerPhone: body.ownerPhone ? body.ownerPhone.trim() : '',
      medicalHistory: body.medicalHistory || [],
      allergies: body.allergies || [],
      currentMedications: body.currentMedications || [],
      vaccinations: body.vaccinations || [],
      status: body.status || 'active',
    };
    
    // Optional fields
    if (body.dateOfBirth) {
      cleanedData.dateOfBirth = body.dateOfBirth;
    }
    if (body.age && body.age.trim()) {
      cleanedData.age = body.age.trim();
    }
    if (body.weight) {
      cleanedData.weight = body.weight;
    }
    if (body.weightUnit) {
      cleanedData.weightUnit = body.weightUnit;
    }
    if (body.color && body.color.trim()) {
      cleanedData.color = body.color.trim();
    }
    if (body.microchipNumber && body.microchipNumber.trim()) {
      cleanedData.microchipNumber = body.microchipNumber.trim();
    }
    if (body.ownerAddress && body.ownerAddress.trim()) {
      cleanedData.ownerAddress = body.ownerAddress.trim();
    }
    if (body.spayedNeutered !== undefined) {
      cleanedData.spayedNeutered = body.spayedNeutered;
    }
    if (body.assignedVet && body.assignedVet.trim()) {
      cleanedData.assignedVet = body.assignedVet.trim();
    }
    if (body.notes && body.notes.trim()) {
      cleanedData.notes = body.notes.trim();
    }
    
    console.log('Cleaned pet data:', JSON.stringify(cleanedData, null, 2));
    
    const pet = new Pet(cleanedData);
    
    // Validate the pet before saving
    const validationError = pet.validateSync();
    if (validationError) {
      console.error('Validation error details:', validationError);
      const errorMessages: string[] = [];
      if (validationError.errors) {
        Object.keys(validationError.errors).forEach(key => {
          errorMessages.push(`${key}: ${validationError.errors[key].message}`);
        });
      }
      return res.json({ 
        error: 'Pet validation failed', 
        details: errorMessages.length > 0 ? errorMessages.join(', ') : validationError.message 
      });
    }
    
    await pet.save();
    
    return res.status(201).json(pet);
  } catch (error: any) {
    console.error('Error creating pet:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: 'Duplicate entry',
        details: `${field} already exists`
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorMessages: string[] = [];
      if (error.errors) {
        Object.keys(error.errors).forEach(key => {
          errorMessages.push(`${key}: ${error.errors[key].message}`);
        });
      }
      return res.status(400).json({ 
        error: 'Pet validation failed', 
        details: errorMessages.length > 0 ? errorMessages.join(', ') : error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to create pet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


