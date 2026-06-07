import { ERequest, EResponse } from "../../types";
import dbConnect from '@/lib/mongodb';

export async function GET(req: ERequest, res: EResponse) {
  try {
    await dbConnect();
    return res.status(500).json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.json(
      { 
        success: false, 
        error: 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}
