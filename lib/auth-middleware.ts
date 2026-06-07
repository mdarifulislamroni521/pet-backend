import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from './mongodb';
import User from '../models/User';
import { getPermissionsForRole, hasPermission } from './permissions';
import type { UserRole } from './permissions';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export interface AuthResult {
  user: any;
  permissions: ReturnType<typeof getPermissionsForRole>;
  hasPermission: (permissionPath: string) => boolean;
}

export async function requireAuth(): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    
    await dbConnect();
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new Error('User not found');
    }

    const permissions = getPermissionsForRole(user.role as UserRole);

    return {
      user,
      permissions,
      hasPermission: (permissionPath: string) => hasPermission(user.role as UserRole, permissionPath)
    };
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

export async function requirePermission(permissionPath: string): Promise<AuthResult> {
  const auth = await requireAuth();

  if (!auth.hasPermission(permissionPath)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return auth;
}

export async function requireAnyPermission(permissionPaths: string[]): Promise<AuthResult> {
  const auth = await requireAuth();

  const hasAnyPermission = permissionPaths.some(path => auth.hasPermission(path));

  if (!hasAnyPermission) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return auth;
}
