import type { NextApiRequest, NextApiResponse } from 'next';

import { EXPIRE_MAX_HOURS } from '../../../../data/constants';
import prisma from '../../../../lib/prisma';

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  if (request.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const now = new Date();
    // console.log(
    //   'lower than',
    //   new Date(now.getTime() - (EXPIRE_MAX_HOURS - 1) * 60 * 60 * 1000).toISOString()
    // );
    // console.log(
    //   'greater than',
    //   new Date(now.getTime() - EXPIRE_MAX_HOURS * 60 * 60 * 1000).toISOString()
    // );
    await prisma.$transaction(async (tx) => {
      const usersNearExpiry = await tx.user.findMany({
        where: {
          write_access: {
            equals: true,
          },
          last_daily_claim: {
            lt: new Date(now.getTime() - (EXPIRE_MAX_HOURS - 0) * 60 * 60 * 1000),
            gt: new Date(now.getTime() - EXPIRE_MAX_HOURS * 59 * 60 * 1000),
          },
          notifications: {
            none: {
              type: 'DAILY_CHECK_IN_EXPIRES',
              createdAt: {
                gt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
              },
            },
          },
        },
        select: { telegram_id: true },
      });

      console.log('[NOTIFICATIONS] dailyCheckInExpires', usersNearExpiry.length);

      await tx.notification.createMany({
        data: usersNearExpiry.map((user) => ({
          userId: user.telegram_id,
          type: 'DAILY_CHECK_IN_EXPIRES',
        })),
      });
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to create notifications:', error);
    return res.status(500).json({ error: 'Failed to create notifications' });
  }
}
export const dynamic = 'force-dynamic';
export const maxDuration = 15;
