import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';
import { allowedOrigins, MAX_GAME_SCORE } from '../../../../data/constants';
import { generateRandomError, isKeyValid } from '../../../../lib/server-utils';
import { decrypt } from '../../../../lib/crypto';
import type { User } from '../../../../types/user.interface';

type Data = { result: string } | { error: string };

export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || req.headers.referer;
  if (!allowedOrigins.includes(origin as string)) {
    return res.status(403).json({ error: 'Unathorized' });
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
    const { points, gameId, key } = req.body;
    const { userId } = req.query;
    const userData = JSON.parse(data.user);

    if (
      !userId ||
      !gameId ||
      points === null ||
      points === undefined ||
      userId !== `${userData?.id}` ||
      !key
    ) {
      console.log('userId', userId, 'gameId', gameId, 'points', points, 'key', key);
      const randError = generateRandomError(req);

      return res.status(randError.status).json({ error: randError.error });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    if (game.user_id !== dbUser.telegram_id) {
      return res.status(404).json({ error: 'Game does not belong to user' });
    }
    if (game.status === 'completed') {
      console.log('[error]: game was already completed', 'gameId', gameId);
      return res.status(404).json({ error: 'Game not found' }); // purposefully returning 404 to avoid leaking information
    }
    const latestPendingGame = await prisma.game.findFirst({
      where: { user_id: dbUser.telegram_id, status: 'pending' },
      orderBy: { created_at: 'desc' },
    });
    if (latestPendingGame && latestPendingGame?.id !== gameId) {
      console.log(
        '[error]: not the latest pending game',
        'latestPendingGame?.id',
        latestPendingGame?.id,
        'gameId',
        gameId
      );
      return res.status(404).json({ error: 'Game not found' }); // purposefully returning 404 to avoid leaking information
    }

    try {
      const first3 = dbUser.telegram_id.toString().slice(0, 3);
      const decryptedKey = decrypt(key, `${first3}${process.env.NEXT_PUBLIC_SECRET_TOKEN}`);

      const user: User = {
        id: dbUser.telegram_id,
        first_name: dbUser.telegram_first_name,
        last_name: dbUser.telegram_last_name,
        username: dbUser.telegram_username,
        walletAddress: dbUser.wallet_address || '',
        code: dbUser.referral_code || '',
        points: dbUser.points,
        gems: dbUser.gems,
        maxScore: dbUser.max_score,
        pointsRanking: 0,
        maxScoreRanking: 0,
        league: {
          id: 0,
          title: '',
          image: '',
        },
        boosts: [],
      };

      if (!isKeyValid(decryptedKey, user)) throw new Error('Invalid key');
    } catch (error) {
      console.log('[error]: ', 'Invalid key', error);
      const randError = generateRandomError(req);

      return res.status(randError.status).json({ error: randError.error });
    }

    const pointsToAdd = Math.min(points, MAX_GAME_SCORE);

    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: {
          telegram_id: userId.toString(),
        },
        data: {
          points: {
            increment: pointsToAdd,
          },
          max_score: Math.max(dbUser.max_score, pointsToAdd),
        },
      });

      await prisma.game.update({
        where: {
          id: gameId,
        },
        data: {
          score: pointsToAdd,
          status: 'completed',
        },
      });
    });

    return res.status(200).json({ result: 'OK' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
