import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export const createDataLoaders = (prisma: PrismaClient) => {
  const batchProfileByUserId = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    return ids.map((id) => profiles.find((profile) => profile.userId === id));
  };

  return {
    profileByUserIdLoader: new DataLoader(batchProfileByUserId),
  };
};
