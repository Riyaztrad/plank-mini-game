import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Task } from '../../types/task.interface';
import { isHashValid } from '../../lib/hash';

type Data = { tasks: Task[] } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
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
    // Get the userId from the request query params
    const userId: string = req.query.user?.toString() || '';

    if (!userId) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify that the address is in the database to prevent unauthorized access
    const user = await prisma.user.findUnique({
      where: {
        telegram_id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Retrieve all the tasks
    const dbTasks = await prisma.task.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: { enabled: true },
      include: {
        boosts: {
          include: {
            boost: true,
          },
        },
      },
    });

    // Retrieve the tasks completed by the user
    const completedTasks = await prisma.userTask.findMany({
      where: {
        user_id: userId,
      },
      select: {
        task_id: true,
      },
    });

    const dbBoosts = await prisma.boost.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const completedTaskIds = new Set(completedTasks.map((m: any) => m.task_id));

    const tasks: Task[] = dbTasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      externalUrl: task.external_url,
      socialMedia: task.social_media,
      points: task.points,
      completed: completedTaskIds.has(task.id),
      boosts: dbBoosts.map((boost: any) => ({
        id: boost.id,
        name: boost.name,
        amount: task.boosts.find((taskBoost: any) => taskBoost.boost.id === boost.id)?.amount || 0,
      })),
    }));

    return res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
