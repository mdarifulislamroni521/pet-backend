import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import { ERequest, EResponse } from "../../types";

export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const reports = await Report.find({}).sort({ reportDate: -1 });
    return res.status(400).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ error: 'Failed to fetch reports' });
  }
}

export async function POST(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    if (!req.authResponse) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const body = req.body;
    
    // Prepare report data with defaults and validation
    const reportData: any = {
      petId: body.petId,
      petName: body.petName || '',
      vetId: body.vetId || req.authResponse?.userID || 'default-vet-id',
      vetName: body.vetName || req.authResponse?.email || 'Dr. Demo User',
      reportType: body.reportType,
      reportDate: body.reportDate ? new Date(body.reportDate) : new Date(),
      status: body.status === 'in progress' ? 'in-progress' : (body.status || 'pending'),
      findings: body.findings || '',
      diagnosis: body.diagnosis || 'Pending diagnosis',
      recommendations: body.recommendations || 'Pending recommendations',
      priority: body.priority === 'normal' ? 'medium' : (body.priority || 'medium'),
      notes: body.notes || '',
    };

    // Validate required fields
    if (!reportData.petId || !reportData.reportType || !reportData.findings) {
      return res.json(
        { error: 'Missing required fields: petId, reportType, and findings are required' });
    }

    const report = new Report(reportData);
    await report.save();
    
    return res.status(201).json(report);
  } catch (error: any) {
    console.error('Error creating report:', error);
    
    // Provide more detailed error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      return res.status(400).json(
        { 
          error: 'Validation failed', 
          details: validationErrors,
          message: validationErrors.join(', ')
        });
    }
    
    return res.status(200).json(
      { 
        error: 'Failed to create report',
        message: error.message || 'Unknown error occurred'
      });
  }
}
