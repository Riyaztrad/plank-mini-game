import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { isHashValid } from '../../../lib/hash';
import { Boost } from '../../../types/boost.interface';
import { Task, User } from '@prisma/client';

export interface CompleteTaskResponse {
  points: number;
  boosts: Boost[];
}

type Data = { rewards: CompleteTaskResponse } | { error: string };

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
    const { taskId } = req.query;
    const { userId } = req.body;
    if (!userId || !taskId) {
      return res.status(400).json({ error: 'User ID and task ID are required' });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        telegram_id: userId.toString(),
      },
    });
    const dbTask = await prisma.task.findUnique({
      where: {
        id: +taskId,
      },
      include: {
        boosts: {
          include: {
            boost: true,
          },
        },
      },
    });
    if (!dbUser || !dbTask) {
      return res.status(404).json({ error: 'User or task not found' });
    }

    const canComplete = await canCompleteTask(dbUser, dbTask);
    if (!canComplete) {
      return res.status(404).json({ error: 'Task requirements not met' });
    }

    await prisma.userTask.create({
      data: {
        user_id: userId,
        task_id: +taskId,
      },
    });

    await prisma.user.update({
      where: {
        telegram_id: userId.toString(),
      },
      data: {
        points: {
          increment: dbTask.points,
        },
      },
    });

    await prisma.$transaction(
      dbTask.boosts.map((taskBoost) => {
        return prisma.userBoost.upsert({
          where: {
            userBoostId: {
              user_id: userId,
              boost_id: taskBoost.boostId, // The boostId from the task
            },
          },
          update: {
            amount: {
              increment: taskBoost.amount, // Increase the existing amount by the task's reward amount
            },
          },
          create: {
            user_id: userId,
            boost_id: taskBoost.boostId,
            amount: taskBoost.amount, // Set the initial amount for this boost
          },
        });
      })
    );
    return res.status(200).json({
      rewards: {
        points: dbTask.points,
        boosts: dbTask.boosts.map((taskBoost) => {
          return {
            id: taskBoost.boostId,
            name: taskBoost.boost.name,
            amount: taskBoost.amount,
          };
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const canCompleteTask = async (dbUser: User, dbTask: Task) => {
  if (dbTask.social_media !== 'friends') {
    return true;
  }

  const totalFriends = await prisma.referral.count({
    where: {
      referrer_id: dbUser.telegram_id,
    },
  });

  const requiredFriends = parseInt(dbTask.description, 10);
  if (totalFriends >= requiredFriends) {
    return true;
  } else return false;
};
