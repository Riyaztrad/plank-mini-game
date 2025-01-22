import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { isHashValid } from '../../../../lib/hash';
import { DAILY_CHECKIN_PLAYS_REWARD, FIVE_DAY_TIME_REWARD } from '../../../../data/constants';
import { DailyRewards } from '../../../../types/reward.interface';

type Data = { rewards: DailyRewards } | { error: string };

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
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    if (!dbUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check if user has already claimed the daily reward
    const now = new Date();
    const lastCheckIn = dbUser.last_daily_claim ? new Date(dbUser.last_daily_claim) : null;
    if (lastCheckIn && now.getTime() - lastCheckIn.getTime() < 24 * 60 * 60 * 1000) {
      console.log("User already claimed today's daily reward");
      return res.status(200).json({
        rewards: {
          displayDrawer: false,
          consecutiveDays: dbUser.consecutive_days,
          points: 0,
          playCoins: 0,
          timeCoins: 0,
        },
      });
    }

    let newConsecutiveDays = dbUser.consecutive_days + 1;
    if (lastCheckIn && now.getTime() - lastCheckIn.getTime() >= 48 * 60 * 60 * 1000) {
      newConsecutiveDays = 1;
    }

    const addedPoints = newConsecutiveDays % 5 === 0 ? 50 : (newConsecutiveDays % 5) * 10;
    const addedPlayCoins = DAILY_CHECKIN_PLAYS_REWARD;
    const addedTimeCoins = newConsecutiveDays % 5 === 0 ? FIVE_DAY_TIME_REWARD : 0;

    console.log('Adding daily reward points and days: ', addedPoints);
    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { telegram_id: userId.toString() },
        data: {
          points: {
            increment: addedPoints,
          },
          last_daily_claim: new Date(),
          consecutive_days: newConsecutiveDays,
        },
      });

      console.log('Adding daily reward boosts', DAILY_CHECKIN_PLAYS_REWARD);
      await prisma.userBoost.upsert({
        where: {
          userBoostId: {
            user_id: dbUser.telegram_id,
            boost_id: 0,
          },
        },
        update: {
          amount: {
            increment: addedPlayCoins,
          },
        },
        create: {
          user_id: dbUser.telegram_id,
          boost_id: 0,
          amount: addedPlayCoins,
        },
      });

      console.log('Adding 5 day time reward', FIVE_DAY_TIME_REWARD);
      await prisma.userBoost.upsert({
        where: {
          userBoostId: {
            user_id: dbUser.telegram_id,
            boost_id: 1,
          },
        },
        update: {
          amount: {
            increment: addedTimeCoins,
          },
        },
        create: {
          user_id: dbUser.telegram_id,
          boost_id: 1,
          amount: addedTimeCoins,
        },
      });
    });

    const rewards: DailyRewards = {
      displayDrawer: true,
      consecutiveDays: newConsecutiveDays,
      points: addedPoints,
      playCoins: addedPlayCoins,
      timeCoins: addedTimeCoins,
    };

    return res.status(200).json({ rewards });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
