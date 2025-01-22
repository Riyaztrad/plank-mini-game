import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';
import { Boost } from '../../../../types/boost.interface';

type Data = { result: string } | { error: string };

export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hash = req.headers['Hash'];
  if (!hash) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const data = Object.fromEntries(new URLSearchParams(hash as string));
  const isValid = await isHashValid(data);
  if (!isValid) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { boosts } = req.body;
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    if (!dbUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    console.log('Will update boosts: ', boosts);

    await prisma.$transaction(
      boosts.map((boost: Boost) => {
        return prisma.userBoost.upsert({
          where: {
            userBoostId: {
              user_id: userId.toString(),
              boost_id: boost.id,
            },
          },
          update: {
            amount: boost.amount,
          },
          create: {
            user_id: userId.toString(),
            boost_id: boost.id,
            amount: boost.amount,
          },
        });
      })
    );

    return res.status(200).json({ result: 'OK' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
