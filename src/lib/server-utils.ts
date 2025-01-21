import 'server-only';
import type { NextApiRequest } from 'next';

import { ALLOWED_GAME_TIMESTAMP_DIFF } from '../data/constants';
import type { User } from '../types/user.interface';

export function isKeyValid(decryptedKey: string, user: User) {
  const [year, month, day, hour, minute, second, timestampUserId] = decryptedKey.split(':');
  if (timestampUserId !== `${user.id}`) return false;

  const timestampDate = new Date(
    Date.UTC(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10) - 1,
      Number.parseInt(day, 10),
      Number.parseInt(hour, 10),
      Number.parseInt(minute, 10),
      Number.parseInt(second, 10)
    )
  );

  const now = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    )
  );
  const diffInSeconds = Math.abs((now.getTime() - timestampDate.getTime()) / 1000);

  console.log('[diffInSeconds]: ', diffInSeconds);

  return diffInSeconds <= ALLOWED_GAME_TIMESTAMP_DIFF;

  // NOT TIME BASED
  // const userId = `${user.id}`;
  // const secret = process.env.NEXT_PUBLIC_SECRET_TOKEN || '';
  // const username = user.first_name || user.username || secret;

  // const startUserId = userId.slice(0, 3);
  // const endUserId = userId.slice(-3);

  // const rawKey = `${startUserId}:${username}:${secret}:${endUserId}`;

  // return decryptedKey === rawKey;
}

/* Error made to confuse those users who are trying to hack/reverse engineer the game. Use only in controlled error cases. */
export function generateRandomError(req: NextApiRequest) {
  const random = deterministicRandom(req);
  console.log('[random]: ', random);

  if (random < 0.1) {
    return { error: 'Not Found', status: 404 };
  }
  if (random < 0.2) {
    return { error: 'Unauthorized', status: 403 };
  }
  if (random < 0.3) {
    return { error: 'Session expired', status: 401 };
  }
  if (random < 0.4) {
    return { error: 'Bad Request', status: 400 };
  }
  if (random < 0.5) {
    return { error: 'Internal Server Error', status: 500 };
  }
  if (random < 0.6) {
    return { error: 'Service Unavailable', status: 503 };
  }
  if (random < 0.7) {
    return { error: 'Missing required fields', status: 400 };
  }
  if (random < 0.8) {
    return { error: 'Too Many Requests', status: 429 };
  }
  if (random < 0.9) {
    return { error: 'User not found', status: 404 };
  }
  return { error: 'Method Not Allowed', status: 405 };
}
function deterministicRandom(req: NextApiRequest): number {
  const url = req.url || '';
  const method = req.method || '';
  const headers = Object.fromEntries(Object.entries(req.headers));
  const searchParams = url.startsWith('http') ? Object.fromEntries(new URL(url).searchParams) : {};

  let body = '';
  try {
    body = JSON.stringify(body);
  } catch (e) {
    console.error('Could not stringify body:', e);
  }

  const requestData = JSON.stringify({
    url,
    method,
    headers,
    searchParams,
    body,
  });

  let hash = 0x811c9dc5; // FNV offset basis
  const prime = 0x01000193; // FNV prime

  for (let i = 0; i < requestData.length; i++) {
    const char = requestData.charCodeAt(i);
    hash ^= char;
    hash = Math.imul(hash, prime);

    // Additional mixing
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
  }

  const random = (Math.abs(hash) % 1000000) / 1000000;

  return random;
}
