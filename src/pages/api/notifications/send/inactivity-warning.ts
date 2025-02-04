import type { NextApiRequest, NextApiResponse } from 'next';

import {
  INACTIVITY_DAYS,
  MAX_USERS_PER_BATCH,
  NOTIFICATIONS_MESSAGES,
  SLEEP_TIME,
} from '../../../../data/constants';
import prisma from '../../../../lib/prisma';
import { sendNotification } from '../../../../lib/telegram';
import { sleep } from '../../../../lib/utils';

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
    const notifications = await prisma.notification.findMany({
      where: {
        type: 'INACTIVITY_WARNING',
        sent: false,
        user: {
          write_access: true,
          last_daily_claim: {
            lt: new Date(now.getTime() - (INACTIVITY_DAYS - 1) * 24 * 60 * 60 * 1000),
            gt: new Date(now.getTime() - (INACTIVITY_DAYS + 1) * 24 * 60 * 60 * 1000),
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            telegram_id: true,
          },
        },
      },
      take: MAX_USERS_PER_BATCH,
    });
    let successCount = 0;
    let errorCount = 0;
    for (const notification of notifications) {
      try {
        await sendNotification(
          notification.user.telegram_id,
          NOTIFICATIONS_MESSAGES.INACTIVITY_WARNING
        );

        // Mark notification as sent
        await prisma.notification.update({
          where: { id: notification.id },
          data: {
            sent: true,
            sentAt: new Date(),
          },
        });
        successCount++;
        await sleep(SLEEP_TIME);
      } catch (error) {
        console.error(`Failed to send message to user ${notification.user.telegram_id}:`, error);
        errorCount++;
      }
    }
    console.log(
      '[NOTIFICATIONS] Send: inactivityWarning',
      notifications.length,
      successCount,
      errorCount
    );
    return response.json({
      success: true,
      message: `Processed ${notifications.length} notifications. Success: ${successCount}, Errors: ${errorCount}`,
    });
  } catch (error) {
    console.error('Failed to process notifications:', error);
    return response.status(500).json({
      success: false,
      error: 'Failed to process notifications',
    });
  }
}
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
