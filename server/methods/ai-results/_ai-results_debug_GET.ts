import dbConnect from '@/lib/mongodb';
import AIResult from '@/models/AIResult';
import { ERequest, EResponse } from "../../types";

// GET - Debug endpoint to check all AI results in database
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

    let query: any = {};
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (type) {
      query.type = type;
    }

    // Get all results
    const allResults = await AIResult.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    // Get counts by type
    const countsByType = await AIResult.aggregate([
      ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get unique patient IDs
    const uniquePatientIds = await AIResult.distinct('patientId');

    // Get sample results
    const sampleResults = allResults.slice(0, 5).map(result => ({
      _id: result._id,
      patientId: result.patientId,
      type: result.type,
      title: result.title,
      createdAt: result.createdAt,
      hasContent: !!result.content,
      contentLength: result.content?.length || 0
    }));

    return res.status(500).json({
      total: allResults.length,
      countsByType: countsByType.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      uniquePatientIds: uniquePatientIds.length,
      sampleResults,
      allResults: allResults.map(result => ({
        _id: result._id.toString(),
        patientId: result.patientId,
        patientIdType: typeof result.patientId,
        type: result.type,
        title: result.title,
        content: result.content, // Include full content
        createdAt: result.createdAt,
        aiModel: result.aiModel,
        metadata: result.metadata,
        contentPreview: result.content?.substring(0, 100) || 'No content'
      }))
    });
  } catch (error) {
    console.error('Debug API Error:', error);
    return res.json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

