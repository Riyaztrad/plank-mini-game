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
    const { userId, purchaseId } = req.body;
    const boc = req.body?.boc || '';

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
    const lastPurchase = await prisma.shopItemPurchase.findFirst({
      orderBy: { created_at: 'desc' },
    });
    let apiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates?allowed_updates=["pre_checkout_query"]`;
    if (lastPurchase?.update_id) {
      apiUrl += `&offset=${lastPurchase.update_id}`;
    }
    const response = await axios.get(apiUrl, {
      params: {
        // offset: 0, // Set offset if needed (optional)
        // limit: 100, // Set limit if needed (optional, defaults to 100)
        // timeout: 0, // Set timeout if needed (optional, defaults to 0)
        allowed_updates: ['pre_checkout_query'],
      },
    });

    console.log('Got response from Telegram:', response.data);
    if (response.data.result.length === 0 || response.data.ok !== true) {
      return res.status(200).json({ hasConfirmed: false });
    }

    const updates = [...response.data.result];
    let foundQueryId = '';
    let updateId = '';
    updates.forEach((update: any) => {
      let from = update?.pre_checkout_query?.from?.id?.toString() || '';
      console.log('Update from:', from, ' and userId is:', userId.toString());
      if (from === userId.toString()) {
        foundQueryId = update.pre_checkout_query.id;
        updateId = update?.update_id?.toString();
      }
    });

    if (foundQueryId === '') {
      return res.status(200).json({ hasConfirmed: false });
    }

    telegramBot.api.answerPreCheckoutQuery(foundQueryId, true);
    const dbResult = await updateBoostsInDb(dbPurchase, dbUser, updateId);

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
