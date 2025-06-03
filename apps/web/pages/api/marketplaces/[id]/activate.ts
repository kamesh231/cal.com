import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@calcom/features/auth/lib/getServerSession';
import prisma from '@calcom/prisma';
import { defaultResponder } from '@calcom/lib/server';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res });
  if (!session) return res.status(401).end();
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const marketplace = await prisma.marketplace.update({ where: { id: id as string }, data: { status: 'active' } });
    return marketplace;
  }
  res.status(405).end();
}

export default defaultResponder(handler);
