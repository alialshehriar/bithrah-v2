import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
    };
  }

  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
