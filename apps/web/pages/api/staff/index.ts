import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@calcom/features/auth/lib/getServerSession';
import { getPrismaForMarketplace } from '@calcom/prisma';
import { defaultResponder } from '@calcom/lib/server';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res });
  if (!session?.marketplaceId) return res.status(401).end();
  const prisma = getPrismaForMarketplace(session.marketplaceId);
  if (req.method === 'GET') {
    return prisma.staff.findMany();
  }
  if (req.method === 'POST') {
    return prisma.staff.create({ data: { ...req.body, vendorId: session.vendorId!, teamId: req.body.teamId } });
  }
  res.status(405).end();
}

export default defaultResponder(handler);
