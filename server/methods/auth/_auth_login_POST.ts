import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { ERequest, EResponse } from '../../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

const authLoginPOST = async (req: ERequest, res: EResponse) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone_number: user.phone,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '30d' });

    const response = {
      token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

    // Set cookie
    res.cookie("access_token", token, {
      maxAge: 30 * (24 * 60 * 60 * 1000), // 30 Days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    
    // Legacy token cookie for frontend backward compatibility
    res.cookie("token", token, {
      maxAge: 30 * (24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("user_name", user.name, {
      maxAge: 30 * (24 * 60 * 60 * 1000), // 30 Days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export default authLoginPOST;
