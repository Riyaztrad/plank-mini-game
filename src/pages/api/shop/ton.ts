import type { NextApiRequest, NextApiResponse } from 'next';
import { isHashValid } from '../../../lib/hash';
import prisma from '../../../lib/prisma';

type Data = { purchaseId: number } | { error: string };

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

    const newPurchase = await prisma.shopItemPurchase.create({
      data: {
        shop_item_id: dbShopItem.id,
        user_id: dbUser.telegram_id,
        price: dbShopItem.price,
      },
    });

    return res.status(200).json({ purchaseId: newPurchase.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
