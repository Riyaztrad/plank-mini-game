import type { NextApiRequest, NextApiResponse } from 'next';

import { INACTIVITY_DAYS } from '../../../../data/constants';
import prisma from '../../../../lib/prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    // console.log(
    //   'lower than',
    //   new Date(now.getTime() - (INACTIVITY_DAYS - 1) * 24 * 60 * 60 * 1000).toISOString()
    // );
    // console.log(
    //   'greater than',
    //   new Date(now.getTime() - (INACTIVITY_DAYS + 1) * 24 * 60 * 60 * 1000).toISOString()
    // );
    await prisma.$transaction(async (tx) => {
      const usersNearExpiry = await tx.user.findMany({
        where: {
          write_access: {
            equals: true,
          },
          last_daily_claim: {
            lt: new Date(now.getTime() - (INACTIVITY_DAYS - 1) * 24 * 60 * 60 * 1000),
            gt: new Date(now.getTime() - (INACTIVITY_DAYS + 1) * 24 * 60 * 60 * 1000),
          },
          notifications: {
            none: {
              type: 'INACTIVITY_WARNING',
              createdAt: {
                gt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
              },
            },
          },
        },
        select: { telegram_id: true },
      });

      console.log('[NOTIFICATIONS] inactivityWarning', usersNearExpiry.length);

      await tx.notification.createMany({
        data: usersNearExpiry.map((user) => ({
          userId: user.telegram_id,
          type: 'INACTIVITY_WARNING',
        })),
      });
    });

    return response.json({ success: true });
  } catch (error) {
    console.error('Failed to create notifications:', error);
    return response.status(500).json({
      success: false,
      error: 'Failed to create notifications',
    });
  }
}
export const dynamic = 'force-dynamic';
export const maxDuration = 15;
