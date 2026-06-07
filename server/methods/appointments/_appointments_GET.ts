import dbConnect from '@/lib/mongodb';
import { hasPermission, UserRole } from "@/lib/permissions";
import Appointment from '@/models/Appointment';
import { ERequest, EResponse } from "../../types";

export async function GET(req: ERequest, res: EResponse) {
  try {
    // Check if user can read appointments
    if (!hasPermission(req.authResponse?.role as UserRole, 'appointments.canRead')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    await dbConnect();
    const appointments = await Appointment.find({}).sort({ appointmentDate: -1 });
    return res.status(200).json(appointments);
  } catch (error: any) {
    console.error('Error fetching appointments:', error);

    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (error.message === 'Forbidden: Insufficient permissions') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    return res.json(
      { error: 'Failed to fetch appointments' });
  }
}

export async function POST(req: ERequest, res: EResponse) {
  try {
    // Check if user can create appointments
    if (!hasPermission(req.authResponse?.role as UserRole, 'appointments.canCreate')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    await dbConnect();
    const body = req.body;
    
    const appointment = new Appointment(body);
    await appointment.save();
    
    return res.status(201).json(appointment);
  } catch (error: any) {
    console.error('Error creating appointment:', error);

    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (error.message === 'Forbidden: Insufficient permissions') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    return res.status(200).json(
      { error: 'Failed to create appointment' });
  }
}
