import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { TelegramUser, User } from '../../types/user.interface';
import {
  DIRECT_REFERRED_COINS_REWARD,
  DIRECT_REFERRED_POINTS_REWARD,
  DIRECT_REFERRER_COINS_REWARD,
  DIRECT_REFERRER_POINTS_REWARD,
  INDIRECT_REFERRER_POINTS_REWARD,
} from '../../data/constants';
import { isHashValid } from '../../lib/hash';
import { getUserLeague } from '../../lib/utils/league';
import { getLeaguePointsRanking, getLeagueScoreRanking } from '../../lib/utils/ranking';
type Data = { user: User } | { error: string };

export const dynamic = 'force-dynamic';

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
    const { user, referralCode } = req.body;
    if (!user) {
      return res.status(500).json({ error: 'Internal server error user' });
    }

    const okResponse = await prisma.$transaction(
      async (tx: any) => {
        const userExists = await tx.user.findUnique({
          where: {
            telegram_id: user.id,
          },
        });

        if (userExists) {
          console.log('User already exists');
          return true;
        }

        if (referralCode) {
          console.log('Referral code is: ', referralCode);
          const referrers = await prisma.user.findMany({
            where: {
              referral_code: referralCode,
            },
          });

          if (referrers.length > 0) {
            const referrer = referrers[0];
            await createUser(tx, user, DIRECT_REFERRED_POINTS_REWARD, DIRECT_REFERRED_COINS_REWARD);
            await updateReferrers(tx, referrer.telegram_id);
            await createReferral(tx, user.id, referrer.telegram_id);
          } else {
            await createUser(tx, user, 0, 0);
          }
        } else {
          console.log('No referral code');
          await createUser(tx, user, 0, 0);
        }

        return true;
      },
      {
        timeout: 12000,
      }
    );

    if (!okResponse) {
      return res.status(500).json({ error: 'Internal server error okResponse' });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: user.id.toString(),
      },
      include: {
        boosts: {
          include: {
            boost: true,
          },
        },
      },
    });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's league and boundaries
    const { league: userLeague, upperRank, lowerRank } = await getUserLeague(dbUser.telegram_id);
    if (!userLeague) {
      return res.status(404).json({ error: 'No league found for user' });
    }

    const pointsRanking = await getLeaguePointsRanking(dbUser.points, upperRank, lowerRank);
    const maxScoreRanking = await getLeagueScoreRanking(dbUser.max_score, upperRank, lowerRank);

    const dbBoosts = await prisma.boost.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return res.status(200).json({
      user: {
        id: dbUser.telegram_id,
        first_name: dbUser.telegram_first_name,
        last_name: dbUser.telegram_last_name,
        username: dbUser.telegram_username,
        walletAddress: dbUser?.wallet_address || '',
        points: dbUser.points,
        gems: dbUser.gems,
        maxScore: dbUser.max_score,
        code: dbUser?.referral_code || '',
        pointsRanking: pointsRanking,
        maxScoreRanking: maxScoreRanking,
        boosts: dbBoosts.map((boost: any) => ({
          id: boost.id,
          name: boost.name,
          amount:
            dbUser.boosts.find((userBoost: any) => userBoost.boost.id === boost.id)?.amount || 0,
        })),
        league: {
          id: userLeague?.id || 0,
          title: userLeague?.title || '',
          image: `/planets/${userLeague?.title.toLowerCase()}.png`,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error error' });
  }
}

const createUser = async (
  tx: any,
  user: TelegramUser,
  referredRewardPoints: number,
  referredRewardCoins: number
) => {
  console.log('Creating user');
  try {
    const newCode = Math.random().toString(36).slice(2, 8);

    await tx.user.upsert({
      where: { telegram_id: user.id },
      update: {
        telegram_first_name: user.first_name,
        telegram_last_name: user.last_name,
        telegram_username: user.username || user.first_name.replace(/\s+/g, ''),
      },
      create: {
        telegram_id: user.id,
        telegram_first_name: user.first_name,
        telegram_last_name: user.last_name,
        telegram_username: user.username || user.first_name.replace(/\s+/g, ''),
        referral_code: newCode,
        points: referredRewardPoints,
      },
    });

    await tx.userBoost.upsert({
      where: {
        userBoostId: {
          user_id: user.id,
          boost_id: 0,
        },
      },
      update: {
        amount: {
          increment: 5,
        },
      },
      create: {
        user_id: user.id,
        boost_id: 0,
        amount: 5,
      },
    });

    await tx.userBoost.upsert({
      where: {
        userBoostId: {
          user_id: user.id,
          boost_id: 1,
        },
      },
      update: {
        amount: {
          increment: referredRewardCoins,
        },
      },
      create: {
        user_id: user.id,
        boost_id: 1,
        amount: referredRewardCoins,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateReferrers = async (tx: any, telegram_id: string) => {
  try {
    console.log('Direct referral is: ', telegram_id);
    // Direct referral gets points and time coin
    await tx.user.update({
      where: {
        telegram_id,
      },
      data: {
        points: {
          increment: DIRECT_REFERRER_POINTS_REWARD,
        },
      },
    });

    // Create notification for direct referral
    await tx.notification.create({
      data: {
        userId: telegram_id,
        type: 'REFERRAL_JOINED',
      },
    });

    await tx.userBoost.upsert({
      where: {
        userBoostId: {
          user_id: telegram_id,
          boost_id: 1,
        },
      },
      update: {
        amount: {
          increment: DIRECT_REFERRER_COINS_REWARD,
        },
      },
      create: {
        user_id: telegram_id,
        boost_id: 1,
        amount: DIRECT_REFERRER_COINS_REWARD,
      },
    });

    const parentReferrals = await tx.referral.findMany({
      where: {
        referred_id: telegram_id,
      },
    });
    if (parentReferrals.length === 0) return true;

    const parentReferral = parentReferrals[0];
    console.log('Parent referral is: ', parentReferral.referrer_id);

    // Indirect (parent) referral gets points
    await tx.user.update({
      where: {
        telegram_id: parentReferral.referrer_id,
      },
      data: {
        points: {
          increment: INDIRECT_REFERRER_POINTS_REWARD,
        },
      },
    });

    // Create notification for indirect referral
    await tx.notification.create({
      data: {
        userId: parentReferral.referrer_id,
        type: 'INDIRECT_REFERRAL',
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createReferral = async (tx: any, newUserId: string, referrerUserId: string) => {
  try {
    await tx.referral.create({
      data: {
        referrer_id: referrerUserId,
        referred_id: newUserId,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
