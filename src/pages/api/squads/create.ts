import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { isHashValid } from '../../../lib/hash';
import axios from 'axios';

type Data = { result: string } | { error: string };

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
    let { handle } = req.body;
    if (!handle) {
      return res.status(400).json({ error: 'Squad handle is required' });
    }

    if (!handle.startsWith('@')) {
      handle = `@${handle}`;
    }

    const dbSquad = await prisma.squad.findFirst({
      where: {
        handle: handle as string,
      },
    });
    if (!dbSquad) {
      const { channelId, title, description } = await getCommunityDetails(handle);

      if (!channelId) {
        return res.status(404).json({ error: 'Community not found' });
      }

      await prisma.squad.create({
        data: {
          channel_id: channelId,
          handle,
          title,
          description,
        },
      });
    }

    return res.status(200).json({ result: 'OK' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getCommunityDetails = async (handle: string) => {
  const url = `https://api.telegram.org/bot${'7252746660:AAHLQwWDRyjMqF5tqAuvTXQL1Fb7GMqjBnY'}/getChat?chat_id=${handle}`;
  const response = await axios.get(url);

  const { ok } = response.data;
  if (!ok) {
    return { channelId: '', title: '', description: '' };
  } else {
    const { id, title, description } = response.data.result;
    return {
      channelId: id.toString().slice(1),
      title: encodeURI(title),
      description: encodeURI(description),
    };
  }
};
