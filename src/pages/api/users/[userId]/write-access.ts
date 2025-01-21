import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';
import { allowedOrigins } from '../../../../data/constants';
// import { DAILY_SCORE_CAP } from '../../../../data/constants';

type Data = { result: string } | { error: string };

export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hash = req.headers.hash;
  if (!hash) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const data = Object.fromEntries(new URLSearchParams(hash as string));
  const isValid = await isHashValid(data);
  if (!isValid) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { writeAccess } = req.body;
    const { userId } = req.query;
    if (!userId) {
      return res.status(404).json({ error: 'User ID is required' });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.update({
      where: {
        telegram_id: userId.toString(),
      },
      data: {
        write_access: writeAccess,
      },
    });

    return res.status(200).json({ result: 'OK' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
