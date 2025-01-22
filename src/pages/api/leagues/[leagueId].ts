import type { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '../../../lib/prisma';
// import { isHashValid } from '../../../lib/hash';

type Data = { completed: boolean } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  //   if (req.method !== 'POST') {
  //     return res.status(405).json({ error: 'Method not allowed' });
  //   }

  //   const hash = req.headers['Hash'];
  //   if (!hash) {
  //     return res.status(403).json({ error: 'Unauthorized' });
  //   }
  //   const data = Object.fromEntries(new URLSearchParams(hash as string));
  //   const isValid = await isHashValid(data);
  //   if (!isValid) {
  //     return res.status(403).json({ error: 'Unauthorized' });
  //   }

  //   try {
  //     const { leagueId } = req.query;
  //     const { userId } = req.body;
  //     if (!userId || !leagueId) {
  //       return res.status(400).json({ error: 'User ID and league ID are required' });
  //     }

  //     const dbUser = await prisma.user.findUnique({
  //       where: {
  //         telegram_id: userId.toString(),
  //       },
  //     });
  //     const dbLeague = await prisma.league.findUnique({
  //       where: {
  //         id: +leagueId,
  //       },
  //     });
  //     if (!dbUser || !dbLeague) {
  //       return res.status(404).json({ error: 'User or league not found' });
  //     }

  //     if (dbUser.max_score < dbLeague.required_score) {
  //       return res.status(200).json({
  //         completed: false,
  //       });
  //     }

  //     await prisma.$transaction(async (tx) => {
  //       await tx.userLeague.create({
  //         data: {
  //           user_id: userId,
  //           league_id: +leagueId,
  //         },
  //       });

  //       await tx.user.update({
  //         where: {
  //           telegram_id: userId.toString(),
  //         },
  //         data: {
  //           points: {
  //             increment: dbLeague.points,
  //           },
  //         },
  //       });
  //     });

  return res.status(200).json({
    completed: true,
  });
  //   } catch (error) {
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
}
