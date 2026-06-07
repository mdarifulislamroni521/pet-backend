import { ERequest, EResponse } from "../../types";
import dbConnect from '@/lib/mongodb';
import AIModel from '@/models/AIModel';

// GET active AI model
export async function GET(req: ERequest, res: EResponse) {
  try {
    await dbConnect();
    const activeModel = await AIModel.findOne({ isActive: true });
    
    return res.status(500).json({
      success: true,
      data: activeModel
    });
  } catch (error) {
    console.error('Error fetching active AI model:', error);
    return res.json(
      { 
        success: false, 
        error: 'Failed to fetch active AI model',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}

// POST set active AI model
export async function POST(req: ERequest, res: EResponse) {
  try {
    await dbConnect();
    const body = req.body;

    if (!body.id) {
      return res.status(400).json(
        { 
          success: false, 
          error: 'Model ID is required' 
        });
    }

    // First, set all models to inactive
    await AIModel.updateMany({}, { isActive: false });

    // Then, set the specified model as active
    const activeModel = await AIModel.findOneAndUpdate(
      { id: body.id },
      { isActive: true },
      { new: true }
    );

    if (!activeModel) {
      return res.status(404).json(
        { 
          success: false, 
          error: 'AI model not found' 
        });
    }

    return res.status(500).json({
      success: true,
      data: activeModel,
      message: 'Active AI model set successfully'
    });

  } catch (error) {
    console.error('Error setting active AI model:', error);
    return res.json(
      { 
        success: false, 
        error: 'Failed to set active AI model',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}
