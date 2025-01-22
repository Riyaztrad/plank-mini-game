import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { User } from '../../../types/user.interface';
import { isHashValid } from '../../../lib/hash';
import { getUserLeague } from '../../../lib/utils/league';
import { getLeaguePointsRanking, getLeagueScoreRanking } from '../../../lib/utils/ranking';

type Data = { user: User } | { error: string };
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
    return res.status(403).json({ error: 'isHashValid Unauthorized' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
      include: {
        boosts: {
          include: {
            boost: true,
          },
        },
      },
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's league and boundaries
    const { league: userLeague, upperRank, lowerRank } = await getUserLeague(userId.toString());
    if (!userLeague) {
      return res.status(404).json({ error: 'No league found for user' });
    }

    const pointsRanking = await getLeaguePointsRanking(dbUser.points, upperRank, lowerRank);
    const maxScoreRanking = await getLeagueScoreRanking(dbUser.max_score, upperRank, lowerRank);

    const dbBoosts = await prisma.boost.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return res.status(200).json({
      user: {
        id: dbUser.telegram_id,
        first_name: dbUser.telegram_first_name,
        last_name: dbUser.telegram_last_name,
        username: dbUser.telegram_username,
        walletAddress: dbUser?.wallet_address || '',
        points: dbUser.points,
        gems: dbUser.gems,
        maxScore: dbUser.max_score,
        code: dbUser?.referral_code || '',
        pointsRanking: pointsRanking,
        maxScoreRanking: maxScoreRanking,
        boosts: dbBoosts.map((boost: any) => ({
          id: boost.id,
          name: boost.name,
          amount:
            dbUser.boosts.find((userBoost: any) => userBoost.boost.id === boost.id)?.amount || 0,
        })),
        league: {
          id: userLeague?.id || 0,
          title: userLeague?.title || '',
          image: `/planets/${userLeague?.title.toLowerCase()}.png`,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
