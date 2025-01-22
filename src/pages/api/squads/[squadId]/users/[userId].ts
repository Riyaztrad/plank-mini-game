import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';
import { isHashValid } from '../../../../../lib/hash';
import { SquadUserRanking } from '../../../../../types/squad.interface';

type Data = { user: SquadUserRanking } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
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
    const { squadId, userId } = req.query;
    if (!squadId || !userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const dbSquad = await prisma.squad.findUnique({
      where: {
        id: +squadId,
      },
    });
    if (!dbSquad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pointsRanking = await prisma.user.count({
      where: {
        squads: {
          some: {
            squad_id: +squadId,
          },
        },
        points: {
          gte: dbUser.points,
        },
      },
    });

    const maxScoreRanking = await prisma.user.count({
      where: {
        squads: {
          some: {
            squad_id: +squadId,
          },
        },
        max_score: {
          gte: dbUser.max_score,
        },
      },
    });

    return res.status(200).json({
      user: {
        pointsRanking: pointsRanking,
        maxScoreRanking: maxScoreRanking,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
