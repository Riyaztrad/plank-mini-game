import type { NextApiRequest, NextApiResponse } from 'next';
import { isHashValid } from '../../lib/hash';

type Data = { ok: boolean } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body.hash) {
    return res.status(400).json({
      error: 'Missing required field hash',
    });
  }

  if (!process.env.BOT_TOKEN) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  const data = Object.fromEntries(new URLSearchParams(req.body.hash));
  const isValid = await isHashValid(data);

  if (isValid) {
    return res.status(200).json({ ok: true });
  }

  return res.status(403).json({ error: 'Invalid hash' });
}
