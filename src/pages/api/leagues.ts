import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { League } from '../../types/league.interface';
import { isHashValid } from '../../lib/hash';

type Data = { leagues: League[] } | { error: string };

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
    // Get the userId from the request query params
    const userId: string = req.query.user?.toString() || '';
    if (!userId) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify that the address is in the database to prevent unauthorized access
    const user = await prisma.user.findUnique({
      where: {
        telegram_id: userId,
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Retrieve all the leagues
    const dbLeagues = await prisma.league.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: { enabled: true },
    });

    // // Retrieve the leagues completed by the user
    // const claimedLeagues = await prisma.userLeague.findMany({
    //   where: {
    //     user_id: userId,
    //   },
    //   select: {
    //     league_id: true,
    //   },
    // });
    // const claimedLeagueIds = new Set(claimedLeagues.map((m: any) => m.league_id));

    const leagues: League[] = dbLeagues.map((league: any) => ({
      id: league.id,
      title: league.title,
      description: league.description,
      image: `/planets/${league.title.toLowerCase()}.png`,
      points: league.points,
      requiredScore: league.required_score,
      rewardsPool: league.rewards_pool,
      // completed: claimedLeagueIds.has(league.id),
      completed: false, // not used anymore
    }));

    return res.status(200).json({ leagues });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
