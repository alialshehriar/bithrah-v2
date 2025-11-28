import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a verification token for email verification
 */
export function generateVerificationToken(email: string): string {
  return jwt.sign({ email, type: 'verification' }, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify an email verification token
 */
export function verifyVerificationToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    if (decoded.type === 'verification') {
      return decoded.email;
    }
    return null;
  } catch (error) {
    return null;
  }
}
