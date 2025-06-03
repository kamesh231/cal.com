import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@calcom/features/auth/lib/getServerSession';
import { getPrismaForMarketplace } from '@calcom/prisma';
import { defaultResponder } from '@calcom/lib/server';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res });
  if (!session?.marketplaceId) return res.status(401).end();
  const prisma = getPrismaForMarketplace(session.marketplaceId);
  const { id } = req.query;
  if (req.method === 'GET') {
    return prisma.vendor.findUnique({ where: { id: id as string } });
  }
  if (req.method === 'PATCH') {
    return prisma.vendor.update({ where: { id: id as string }, data: req.body });
  }
  if (req.method === 'DELETE') {
    await prisma.vendor.delete({ where: { id: id as string } });
    return { id };
  }
  res.status(405).end();
}

export default defaultResponder(handler);
