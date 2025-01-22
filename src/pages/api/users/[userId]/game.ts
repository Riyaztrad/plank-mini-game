import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';
import { allowedOrigins } from '../../../../data/constants';
import { generateRandomError, isKeyValid } from '../../../../lib/server-utils';
import { decrypt } from '../../../../lib/crypto';
import type { User } from '../../../../types/user.interface';

type Data = { gameId: string } | { error: string };

export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || req.headers.referer;
  if (!allowedOrigins.includes(origin as string)) {
    console.log('[error]: ', 'Unathorized', origin);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const hash = req.headers['hash'];
  if (!hash) {
    console.log('[error]: ', 'No hash');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const data = Object.fromEntries(new URLSearchParams(hash as string));
  const isValid = await isHashValid(data);
  if (!isValid) {
    console.log('[error]: ', 'Invalid hash', data);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { userId } = req.query;
    const { key } = req.body;
    const userData = JSON.parse(data.user);

    if (!userId || userId !== `${userData?.id}` || !key) {
      console.log(
        '[error]: ',
        'Invalid params',
        'userId',
        userId,
        'key',
        key,
        'userData',
        userData
      );
      const randError = generateRandomError(req);

      return res.status(randError.status).json({ error: randError.error });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    if (!dbUser) {
      console.log('[error]: ', 'User not found', userId);
      return res.status(400).json({ error: 'User not found' });
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

    const newGame = await prisma.game.create({
      data: {
        user_id: dbUser.telegram_id,
        score: 0,
        status: 'in-progress',
      },
    });

    await prisma.userBoost.upsert({
      where: {
        userBoostId: {
          user_id: dbUser.telegram_id,
          boost_id: 0,
        },
      },
      update: {
        amount: {
          decrement: 1,
        },
      },
      create: {
        user_id: dbUser.telegram_id,
        boost_id: 0,
        amount: 0,
      },
    });

    console.log('Returning new game id: ', newGame.id);

    return res.status(200).json({ gameId: newGame.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
