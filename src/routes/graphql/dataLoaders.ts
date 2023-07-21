import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from './types/memberType.js';

export const createDataLoaders = (prisma: PrismaClient) => {
  const batchProfileByUserId = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    return ids.map((id) => profiles.find((profile) => profile.userId === id));
  };

  const batchMemberType = async (ids: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as MemberTypeId[] } },
    });

    return ids.map((id) => memberTypes.find((memberType) => memberType.id === id));
  };

  return {
    profileByUserIdLoader: new DataLoader(batchProfileByUserId),
    memberTypeLoader: new DataLoader(batchMemberType),
  };
};
