import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { isHashValid } from '../../../lib/hash';
import { telegramBot } from '../../../lib/bot';
import prisma from '../../../lib/prisma';

type Data = { hasConfirmed: boolean } | { error: string };

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
    const { userId, purchaseId, boc } = req.body;

    if (!userId || !purchaseId) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const dbPurchase = await prisma.shopItemPurchase.findUnique({
      where: { id: purchaseId },
      include: {
        shopItem: {
          include: {
            boosts: true,
          },
        },
      },
    });
    if (!dbPurchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    const dbUser = await prisma.user.findUnique({ where: { telegram_id: userId.toString() } });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dbResult = await updateBoostsInDb(dbPurchase, dbUser, boc);

    return res.status(200).json({ hasConfirmed: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const updateBoostsInDb = async (dbPurchase: any, dbUser: any, updateId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.shopItemPurchase.update({
      where: { id: dbPurchase.id },
      data: { confirmed: true, update_id: updateId },
    });

    for (const boost of dbPurchase.shopItem.boosts) {
      console.log('Will upsert:', boost);
      await tx.userBoost.upsert({
        where: {
          userBoostId: {
            user_id: dbUser.telegram_id,
            boost_id: boost.boostId,
          },
        },
        update: {
          amount: {
            increment: boost.amount,
          },
        },
        create: {
          user_id: dbUser.telegram_id,
          boost_id: boost.id,
          amount: boost.amount,
        },
      });
    }
  });
};
