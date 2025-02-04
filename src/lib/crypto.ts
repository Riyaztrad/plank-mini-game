import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-cbc';

export function encrypt(text: string, secretKey: string) {
  const key = Buffer.from(secretKey.padEnd(32, '0')).slice(0, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(text: string, secretKey: string) {
  const key = Buffer.from(secretKey.padEnd(32, '0')).slice(0, 32);
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function generateKey(userId: string) {
  const now = new Date();
  return `${now.getUTCFullYear()}:${String(now.getUTCMonth() + 1).padStart(2, '0')}:${String(
    now.getUTCDate()
  ).padStart(2, '0')}:${String(now.getUTCHours()).padStart(2, '0')}:${String(
    now.getUTCMinutes()
  ).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}:${userId}`;
}
