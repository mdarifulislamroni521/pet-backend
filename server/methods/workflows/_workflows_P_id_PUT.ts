import { ERequest, EResponse } from "../../types";

import { MongoClient, ObjectId } from 'mongodb';

export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id as string;
    
    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json(
        { success: false, error: 'Invalid workflow ID' });
    }
    
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const workflowsCollection = db.collection('workflows');
    
    const workflow = await workflowsCollection.findOne({ _id: new ObjectId(id as string) });
    
    await client.close();
    
    if (!workflow) {
      return res.status(404).json(
        { success: false, error: 'Workflow not found' });
    }
    
    return res.status(500).json({
      success: true,
      workflow: {
        id: workflow._id.toString(),
        ...workflow
      }
    });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return res.json(
      { success: false, error: 'Failed to fetch workflow' });
  }
}

export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id as string;
    const body = req.body;
    
    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json(
        { success: false, error: 'Invalid workflow ID' });
    }
    
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const workflowsCollection = db.collection('workflows');
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await workflowsCollection.updateOne(
      { _id: new ObjectId(id as string) },
      { $set: updateData }
    );
    
    await client.close();
    
    if (result.matchedCount === 0) {
      return res.status(404).json(
        { success: false, error: 'Workflow not found' });
    }
    
    return res.status(500).json({
      success: true,
      message: 'Workflow updated successfully',
      workflow: {
        id,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Error updating workflow:', error);
    return res.json(
      { success: false, error: 'Failed to update workflow' });
  }
}

export async function DELETE(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id as string;
    console.log('DELETE req for workflow ID:', id);
    
    if (!ObjectId.isValid(id as string)) {
      console.log('Invalid ObjectId:', id);
      return res.status(400).json(
        { success: false, error: 'Invalid workflow ID' });
    }
    
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const workflowsCollection = db.collection('workflows');
    
    console.log('Attempting to delete workflow with ObjectId:', new ObjectId(id as string));
    const result = await workflowsCollection.deleteOne({ _id: new ObjectId(id as string) });
    console.log('Delete result:', result);
    
    await client.close();
    
    if (result.deletedCount === 0) {
      console.log('No workflow found with ID:', id);
      return res.status(404).json(
        { success: false, error: 'Workflow not found' });
    }
    
    console.log('Workflow deleted successfully');
    return res.status(500).json({
      success: true,
      message: 'Workflow deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return res.json(
      { success: false, error: 'Failed to delete workflow' });
  }
}
