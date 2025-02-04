import type { NextApiRequest, NextApiResponse } from 'next';
import { isHashValid } from '../../../lib/hash';
import { telegramBot } from '../../../lib/bot';
import prisma from '../../../lib/prisma';

type Data = { invoiceLink: string; purchaseId: number } | { error: string };

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
    let { shopItemId, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const dbShopItem = await prisma.shopItem.findUnique({
      where: { id: shopItemId },
      include: { boosts: true },
    });
    if (!dbShopItem) {
      return res.status(404).json({ error: 'Boost not found' });
    }
    const dbUser = await prisma.user.findUnique({ where: { telegram_id: userId.toString() } });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const params = {
      title: `Purchase ${dbShopItem.title}`,
      description: `Purchase ${dbShopItem.title} for ${dbShopItem.price} STARS`,
      payload: '{}',
      provider: '', // Provider token must be empty for Telegram Stars
      currency: 'XTR',
      prices: [{ amount: dbShopItem.price, label: dbShopItem.title }],
    };

    const invoiceLink = await telegramBot.api.createInvoiceLink(
      params.title,
      params.description,
      params.payload,
      params.provider,
      params.currency,
      params.prices
    );

    const newPurchase = await prisma.shopItemPurchase.create({
      data: {
        shop_item_id: dbShopItem.id,
        user_id: dbUser.telegram_id,
        price: dbShopItem.price,
      },
    });

    return res.status(200).json({ invoiceLink, purchaseId: newPurchase.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
