import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@calcom/features/auth/lib/getServerSession';
import { getPrismaForMarketplace } from '@calcom/prisma';
import { defaultResponder } from '@calcom/lib/server';
import { allocateStaff } from '@calcom/event-types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res });
  if (!session?.marketplaceId) return res.status(401).end();
  const prisma = getPrismaForMarketplace(session.marketplaceId);
  if (req.method === 'POST') {
    const { serviceId, preferredStart } = req.body;
    const staff = await allocateStaff(serviceId, new Date(preferredStart));
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return res.status(404).end();
    const end = new Date(new Date(preferredStart).getTime() + service.durationMin * 60000);
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        staffId: staff?.id ?? null,
        vendorId: service.vendorId,
        startTime: new Date(preferredStart),
        endTime: end,
        title: service.name,
      },
    });
    return booking;
  }
  res.status(405).end();
}

export default defaultResponder(handler);
