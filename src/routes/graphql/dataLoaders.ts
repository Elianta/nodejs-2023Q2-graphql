import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from './types/memberType.js';

export const createDataLoaders = (prisma: PrismaClient) => {
  const batchUserById = async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    return ids.map((id) => users.find((user) => user.id === id));
  };

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

  const batchPostsByUserId = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    return ids.map((id) => posts.filter((post) => post.authorId === id));
  };

  return {
    userLoader: new DataLoader(batchUserById),
    profileByUserIdLoader: new DataLoader(batchProfileByUserId),
    memberTypeLoader: new DataLoader(batchMemberType),
    postsByUserIdLoader: new DataLoader(batchPostsByUserId),
  };
};
