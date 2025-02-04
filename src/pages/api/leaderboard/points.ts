import type { NextApiRequest, NextApiResponse } from 'next';
import { LeaderboardUser } from '../../../types/user.interface';
import prisma from '../../../lib/prisma';
import { getUserLeague } from '../../../lib/utils/league';

type Data = { leaderboard: LeaderboardUser[] } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get user's league
    const { league: userLeague, upperRank, lowerRank, hasZeroScore } = await getUserLeague(userId);
    if (!userLeague) {
      return res.status(404).json({ error: 'No league found for user' });
    }

    let users;
    if (hasZeroScore) {
      users = await prisma.user.findMany({
        where: {
          max_score: 0,
        },
        select: {
          telegram_id: true,
          telegram_username: true,
          points: true,
        },
        take: 50,
      });
    } else {
      // Get users within the same rank range (same league)
      users = await prisma.user.findMany({
        where: {
          OR: [
            // Include the queried user explicitly
            { telegram_id: userId },
            // Include users in the same league
            {
              AND: [
                {
                  max_score: {
                    lte: (
                      await prisma.user.findFirst({
                        skip: upperRank - 1,
                        orderBy: { max_score: 'desc' },
                        select: { max_score: true },
                      })
                    )?.max_score,
                  },
                },
                {
                  max_score: {
                    gt:
                      (
                        await prisma.user.findFirst({
                          skip: lowerRank,
                          orderBy: { max_score: 'desc' },
                          select: { max_score: true },
                        })
                      )?.max_score || 0,
                  },
                },
              ],
            },
          ],
        },
        select: {
          telegram_id: true,
          telegram_username: true,
          points: true,
        },
        orderBy: {
          points: 'desc',
        },
        take: 50,
      });
    }

    const leaderboard: LeaderboardUser[] = users.map((user) => ({
      id: user.telegram_id,
      username: user.telegram_username,
      points: user.points,
    }));

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
