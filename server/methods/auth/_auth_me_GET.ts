import * as jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { ERequest, EResponse } from '../../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

const authMeGET = async (req: ERequest, res: EResponse) => {
  try {
    const token = req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMeGET;
