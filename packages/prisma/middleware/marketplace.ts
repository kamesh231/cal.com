import type { PrismaClient } from "@prisma/client";

export default function marketplaceMiddleware(prisma: PrismaClient, marketplaceId: string) {
  prisma.$use(async (params, next) => {
    if (marketplaceId) {
      await prisma.$executeRawUnsafe(
        `SELECT set_config('app.current_marketplace', '${marketplaceId}', true)`
      );
    }
    return next(params);
  });
}
