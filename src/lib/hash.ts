import { webcrypto } from 'crypto';

export async function isHashValid(data: Record<string, string>) {
  if (process.env.NODE_ENV === 'development') return true;

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) throw new Error('BOT_TOKEN is not defined in the environment variables.');

  const encoder = new TextEncoder();

  // Step 1: Create checkString
  const checkString = Object.keys({ ...data, user: JSON.parse(data.user) })
    .filter((key) => key !== 'hash') // Exclude 'hash'
    .map((key) => `${key}=${data[key]}`) // Map key=value pairs
    .sort() // Sort alphabetically
    .join('\n'); // Join with '\n'

  // Step 2: Generate secret key (SHA-256 hash of botToken)
  const secretKey = await webcrypto.subtle.digest(
    'SHA-256',
    encoder.encode(botToken) // Encode botToken
  );

  // Step 3: Generate HMAC-SHA256 using the secretKey and checkString
  const signature = await webcrypto.subtle.sign(
    'HMAC',
    await webcrypto.subtle.importKey('raw', secretKey, { name: 'HMAC', hash: 'SHA-256' }, false, [
      'sign',
    ]),
    encoder.encode(checkString) // Encode checkString
  );

  // Step 4: Compare the calculated hash with the provided hash
  const calculatedHash = Buffer.from(signature).toString('hex');
  return data.hash === calculatedHash;
}
