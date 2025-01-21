import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { isHashValid } from '../../lib/hash';
import { Squad } from '../../types/squad.interface';

type Data = { squads: Squad[] } | { error: string };

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

    const dbSquads = await prisma.squad.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        title: true,
        handle: true,
        _count: {
          select: { users: true },
        },
      },
      take: 10,
    });

    const userSquads = await prisma.userSquad.findMany({
      where: {
        user_id: userId,
      },
    });

    const userSquadsIds = new Set(userSquads.map((m: any) => m.squad_id));

    const squads: Squad[] = dbSquads.map((squad: any) => ({
      id: +squad.id,
      title: decodeURI(squad.title),
      handle: squad.handle,
      joined: userSquadsIds.has(squad.id),
      totalUsers: squad._count.users,
    }));

    return res.status(200).json({ squads });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
