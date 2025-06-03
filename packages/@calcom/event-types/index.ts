import prisma from '@calcom/prisma';

async function countBookingsThisWeek(staffId: string) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  return prisma.booking.count({
    where: {
      staffId,
      startTime: { gte: startOfWeek },
      status: 'ACCEPTED',
    },
  });
}

function isWorkingThatDay(start: Date) {
  return true;
}

function hasNoOverlap(start: Date, duration: number, staffId: string) {
  return prisma.booking.count({
    where: {
      staffId,
      startTime: { lte: start },
      endTime: { gte: start },
    },
  }).then((c) => c === 0);
}

export async function allocateStaff(serviceId: string, start: Date) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return null;
  const eligible = await prisma.staff.findMany({
    where: {
      vendorId: service.vendorId,
      skills: { some: { id: service.requiredSkillId } },
    },
    select: { id: true },
  });
  const results = [] as { id: string; weeklyCount: number }[];
  for (const e of eligible) {
    const working = isWorkingThatDay(start);
    const noOverlap = await hasNoOverlap(start, service.durationMin, e.id);
    if (!working || !noOverlap) continue;
    const weeklyCount = await countBookingsThisWeek(e.id);
    results.push({ id: e.id, weeklyCount });
  }
  results.sort((a,b)=>a.weeklyCount-b.weeklyCount || a.id.localeCompare(b.id));
  return results[0] ?? null;
}
