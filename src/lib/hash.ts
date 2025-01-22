import { createHash, createHmac, webcrypto } from 'crypto';

export async function isHashValid(data: Record<string, string>) {
  if (process.env.NODE_ENV === 'development') return true;

  const botToken = process.env.BOT_TOKEN;
  const encoder = new TextEncoder();

  const sortedData = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');

  // Secret key derived from BOT_TOKEN
  const secretKey = createHash('sha256').update(botToken).digest();

  // Generate hash
  const hmac = createHmac('sha256', secretKey.toString());
  const calculatedHash = hmac.update(sortedData).digest('hex');
  // const checkString = Object.keys(data)
  //   .filter((key) => key !== 'hash')
  //   .map((key) => `${key}=${data[key]}`)
  //   .sort()
  //   .join('\n');

  // const secretKey = await webcrypto.subtle.importKey(
  //   'raw',
  //   encoder.encode('WebAppData'),
  //   { name: 'HMAC', hash: 'SHA-256' },
  //   true,
  //   ['sign']
  // );

  // const secret = await webcrypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken));

  // const signatureKey = await webcrypto.subtle.importKey(
  //   'raw',
  //   secret,
  //   { name: 'HMAC', hash: 'SHA-256' },
  //   true,
  //   ['sign']
  // );

  // const signature = await webcrypto.subtle.sign('HMAC', signatureKey, encoder.encode(checkString));

  // const hex = Buffer.from(signature).toString('hex');

  return data.hash === calculatedHash;
}
