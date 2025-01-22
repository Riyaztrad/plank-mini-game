import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { isHashValid } from '../../../lib/hash';
import { SquadData } from '../../../types/squad.interface';

type Data = { squad: SquadData } | { error: string };

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
    const { squadId } = req.query;
    const userId: string = req.query.user?.toString() || '';

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
        telegram_id: userId,
      },
    });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const squadPointsUsers = await prisma.user.findMany({
      where: {
        squads: {
          some: {
            squad_id: +squadId,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
      take: 20,
      select: {
        telegram_id: true,
        telegram_username: true,
        points: true,
      },
    });

    const squadMaxScoreUsers = await prisma.user.findMany({
      where: {
        squads: {
          some: {
            squad_id: +squadId,
          },
        },
      },
      orderBy: {
        max_score: 'desc',
      },
      take: 20,
      select: {
        telegram_id: true,
        telegram_username: true,
        max_score: true,
      },
    });

    const ranking = await prisma.user.count({
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

    const totalUsers = await prisma.user.count({
      where: {
        squads: {
          some: {
            squad_id: +squadId,
          },
        },
      },
    });

    let handle = dbSquad.handle;
    if (handle.startsWith('@')) {
      handle = handle.slice(1);
    }

    return res.status(200).json({
      squad: {
        id: +dbSquad.id,
        title: decodeURI(dbSquad.title),
        description: decodeURI(dbSquad.description),
        pointsUsers: squadPointsUsers.map((user) => ({
          id: user.telegram_id,
          username: user.telegram_username,
          points: user.points,
        })),
        maxScoreUsers: squadMaxScoreUsers.map((user) => ({
          id: user.telegram_id,
          username: user.telegram_username,
          points: user.max_score,
        })),
        totalUsers,
        handle: handle,
        ranking: ranking,
        externalUrl: `https://t.me/${handle}`,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
