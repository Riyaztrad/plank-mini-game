import type { NextApiRequest, NextApiResponse } from 'next';
import { Friend } from '../../../../types/user.interface';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';
import {
  DIRECT_REFERRED_POINTS_REWARD,
  DIRECT_REFERRER_POINTS_REWARD,
} from '../../../../data/constants';

type Data = { friends: Friend[] } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hash = req.headers['hash'];
  if (!hash) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const data = Object.fromEntries(new URLSearchParams(hash as string));
  const isValid = await isHashValid(data);
  if (!isValid) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const referredUsers = await prisma.referral.findMany({
      where: {
        referrer_id: userId.toString(),
      },
      include: {
        referred: {
          include: {
            referreds: true,
          },
        },
      },
      take: 50,
    });

    const friends: Friend[] = referredUsers.map((user: any) => ({
      id: user.referred.telegram_id,
      username: user.referred.telegram_username,
      totalReferrals: user.referred.referreds.length,
      friendPoints: DIRECT_REFERRED_POINTS_REWARD,
      yourPoints: DIRECT_REFERRER_POINTS_REWARD,
    }));

    return res.status(200).json({ friends });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
