import dbConnect from '@/lib/mongodb';
import AIResult from '@/models/AIResult';
import { ERequest, EResponse } from "../../types";

// GET - Fetch AI results for a patient
export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const type = searchParams.get('type');

    console.log('Fetching AI results:', { patientId, type });

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Try to find by patientId (ensure it's a string for comparison)
    const patientIdStr = String(patientId);
    const query: any = { 
      patientId: patientIdStr
    };
    if (type) {
      query.type = type;
    }

    console.log('Query:', JSON.stringify(query, null, 2));

    const results = await AIResult.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('Found AI results:', results.length);
    if (results.length > 0) {
      console.log('Sample result patientId:', results[0].patientId);
    }

    return res.status(400).json({ results });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// POST - Save a new AI result
export async function POST(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    const body = req.body;
    let { patientId, type, title, content, rawData, aiModel, metadata } = body;

    // Ensure patientId is a string
    patientId = String(patientId);

    console.log('Saving AI result:', { patientId, patientIdType: typeof patientId, type, title, hasContent: !!content });

    if (!patientId || !type || !title || !content) {
      console.error('Missing required fields:', { patientId: !!patientId, type: !!type, title: !!title, content: !!content });
      return res.json(
        { message: 'Missing required fields: patientId, type, title, content' });
    }

    const aiResult = new AIResult({
      patientId: patientId,
      type,
      title,
      content,
      rawData,
      aiModel,
      metadata,
    });

    await aiResult.save();
    console.log('AI result saved successfully:', { 
      id: aiResult._id, 
      savedPatientId: aiResult.patientId, 
      savedPatientIdType: typeof aiResult.patientId,
      type 
    });

    return res.status(201).json({ result: aiResult, message: 'AI result saved successfully' });
  } catch (error) {
    console.error('API Error saving AI result:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// DELETE - Delete an AI result
export async function DELETE(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return res.status(400).json({ message: 'AI result ID is required' });
    }

    const result = await AIResult.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'AI result not found' });
    }

    console.log('AI result deleted successfully:', { id });

    return res.status(500).json({ message: 'AI result deleted successfully' });
  } catch (error) {
    console.error('API Error deleting AI result:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

