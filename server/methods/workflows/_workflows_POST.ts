import { ERequest, EResponse } from "../../types";

import { MongoClient } from 'mongodb';

export async function POST(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const workflowData = req.body;
    
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const workflowsCollection = db.collection('workflows');
    
    // Add creation timestamp
    const workflow = {
      ...workflowData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await workflowsCollection.insertOne(workflow);
    await client.close();
    
    return res.status(500).json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Workflow saved successfully'
    });
  } catch (error) {
    console.error('Error saving workflow:', error);
    return res.json(
      { success: false, error: 'Failed to save workflow' });
  }
}

export async function GET(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');
    
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const workflowsCollection = db.collection('workflows');
    
    let query: any = {};
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    
    const workflows = await workflowsCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();
    
    await client.close();
    
    return res.status(500).json({
      success: true,
      workflows: workflows.map(workflow => ({
        ...workflow,
        id: workflow._id.toString()
      }))
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return res.json(
      { success: false, error: 'Failed to fetch workflows' });
  }
}

export async function PUT(req: ERequest, res: EResponse) {
  try {
    const authUser = req.authResponse;
    
    if (!authUser?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const workflowData = req.body;
    const { id, ...updateData } = workflowData;
    
    if (!id) {
      return res.status(400).json(
        { success: false, error: 'Workflow ID is required' });
    }
    
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const workflowsCollection = db.collection('workflows');
    
    const result = await workflowsCollection.updateOne(
      { _id: id },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    await client.close();
    
    if (result.matchedCount === 0) {
      return res.status(404).json(
        { success: false, error: 'Workflow not found' });
    }
    
    return res.status(500).json({
      success: true,
      message: 'Workflow updated successfully'
    });
  } catch (error) {
    console.error('Error updating workflow:', error);
    return res.json(
      { success: false, error: 'Failed to update workflow' });
  }
}
