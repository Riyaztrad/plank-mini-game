import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';

type Data = { result: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
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
    const { squadId } = req.query;
    const { userId } = req.body;
    if (!userId || !squadId) {
      return res.status(400).json({ error: 'User ID and squad ID are required' });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    const dbSquad = await prisma.squad.findUnique({
      where: {
        id: +squadId,
      },
    });
    if (!dbUser || !dbSquad) {
      return res.status(404).json({ error: 'User or squad not found' });
    }

    await prisma.userSquad.delete({
      where: {
        userSquadId: {
          user_id: userId,
          squad_id: +squadId,
        },
      },
    });

    return res.status(200).json({ result: 'OK' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
