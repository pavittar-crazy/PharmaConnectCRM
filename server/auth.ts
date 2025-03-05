import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  try {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  } catch (error) {
    console.error('Error in hashPassword:', error);
    throw new Error('Failed to hash password');
  }
}

export async function comparePasswords(supplied: string, stored: string) {
  try {
    if (!stored || !stored.includes('.')) {
      console.error('Invalid stored password format');
      return false;
    }
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('Error in comparePasswords:', error);
    return false;
  }
}