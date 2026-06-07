
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const { id } = await params;
    
    const report = await Report.findById(id).lean();
    
    if (!report) {
      return res.status(404).json(
        { message: 'Report not found' });
    }
    return res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return res.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const { id } = await params;
    const body = req.body;
    
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedReport) {
      return res.status(404).json(
        { message: 'Report not found' });
    }
    
    return res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    return res.json(
      { message: 'Internal server error' });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    const { id } = await params;
    
    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return res.status(404).json(
        { message: 'Report not found' });
    }
    
    return res.status(500).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return res.json(
      { message: 'Internal server error' });
  }
}
