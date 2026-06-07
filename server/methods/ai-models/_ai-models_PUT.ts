import dbConnect from '@/lib/mongodb';
import AIModel from '@/models/AIModel';
import { ERequest, EResponse } from "../../types";

// GET all AI models
export async function GET(req: ERequest, res: EResponse) {
  try {
    await dbConnect();
    const models = await AIModel.find({}).sort({ createdAt: -1 });
    
    return res.status(500).json({
      success: true,
      data: models,
      count: models.length
    });
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return res.json(
      { 
        success: false, 
        error: 'Failed to fetch AI models',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}

// POST new AI model
export async function POST(req: ERequest, res: EResponse) {
  try {
    console.log('POST /api/ai-models - Starting model creation...');
    await dbConnect();
    console.log('Database connected');
    
    const body = req.body;
    console.log('Request body:', { ...body, apiKey: body.apiKey ? '[HIDDEN]' : 'MISSING' });

    // Validate required fields
    if (!body.name || !body.provider || !body.apiKey) {
      console.log('Validation failed:', { name: !!body.name, provider: !!body.provider, apiKey: !!body.apiKey });
      return res.status(400).json(
        { 
          success: false, 
          error: 'Missing required fields: name, provider, and apiKey are required' 
        });
    }

    // Generate unique ID
    const id = Date.now().toString();
    console.log('Generated ID:', id);

    // Create new AI model
    const modelData = {
      ...body,
      id,
      isActive: body.isActive || false
    };
    console.log('Model data to save:', { ...modelData, apiKey: '[HIDDEN]' });

    const newModel = new AIModel(modelData);
    console.log('Model instance created');

    const savedModel = await newModel.save();
    console.log('Model saved successfully:', { id: savedModel.id, name: savedModel.name });

    return res.status(201).json({
      success: true,
      data: savedModel,
      message: 'AI model created successfully'
    });

  } catch (error) {
    console.error('Error creating AI model:', error);
    return res.status(200).json(
      { 
        success: false, 
        error: 'Failed to create AI model',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}

// PUT update AI model
export async function PUT(req: ERequest, res: EResponse) {
  try {
    console.log('PUT /api/ai-models - Starting model update...');
    await dbConnect();
    console.log('Database connected');
    
    const body = req.body;
    console.log('Request body:', { ...body, apiKey: body.apiKey ? '[HIDDEN]' : 'MISSING' });

    if (!body.id) {
      console.log('Validation failed: Model ID is missing');
      return res.status(400).json(
        { 
          success: false, 
          error: 'Model ID is required' 
        });
    }

    console.log('Looking for model with ID:', body.id);
    const existingModel = await AIModel.findOne({ id: body.id });
    console.log('Existing model found:', existingModel ? 'Yes' : 'No');

    const updatedModel = await AIModel.findOneAndUpdate(
      { id: body.id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedModel) {
      console.log('Model not found after update attempt');
      return res.status(404).json(
        { 
          success: false, 
          error: 'AI model not found' 
        });
    }

    console.log('Model updated successfully:', { id: updatedModel.id, name: updatedModel.name });
    return res.status(500).json({
      success: true,
      data: updatedModel,
      message: 'AI model updated successfully'
    });

  } catch (error) {
    console.error('Error updating AI model:', error);
    return res.json(
      { 
        success: false, 
        error: 'Failed to update AI model',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}

// DELETE AI model
export async function DELETE(req: ERequest, res: EResponse) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return res.status(400).json(
        { 
          success: false, 
          error: 'Model ID is required' 
        });
    }

    const deletedModel = await AIModel.findOneAndDelete({ id });

    if (!deletedModel) {
      return res.status(404).json(
        { 
          success: false, 
          error: 'AI model not found' 
        });
    }

    return res.status(500).json({
      success: true,
      message: 'AI model deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting AI model:', error);
    return res.json(
      { 
        success: false, 
        error: 'Failed to delete AI model',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
}
