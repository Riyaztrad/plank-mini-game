import type { NextApiRequest, NextApiResponse } from 'next';
import { ShopItem } from '../../../types/boost.interface';
import prisma from '../../../lib/prisma';
import { isHashValid } from '../../../lib/hash';

type Data = { items: ShopItem[] } | { error: string };

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
    // Retrieve all the shop items
    const dbItems = await prisma.shopItem.findMany({
      where: { enabled: true },
      include: {
        boosts: true,
      },
    });

    const items: ShopItem[] = dbItems.map((item: any) => ({
      id: item.id,
      text: item.title,
      description: item.description,
      type: item.type,
      price: item.price,
      tonPrice: item.ton_price,
      amount: item.boosts.length > 0 ? item.boosts[0].amount : 1, // Might need to change this if there are multiple boosts with mutliple amounts
      requiredLeague: item.league_id,
      blocked: item.blocked,
    }));

    return res.status(200).json({ items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
