
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

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
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json(
        { error: 'Appointment not found' });
    }
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.json(
      { error: 'Failed to fetch appointment' });
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
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json(
        { error: 'Appointment not found' });
    }
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.json(
      { error: 'Failed to update appointment' });
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
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return res.status(404).json(
        { error: 'Appointment not found' });
    }
    
    return res.status(500).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res.json(
      { error: 'Failed to delete appointment' });
  }
}
