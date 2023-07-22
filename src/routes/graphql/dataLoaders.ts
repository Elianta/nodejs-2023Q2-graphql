import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from './types/memberType.js';
import { IUser } from './types/user.js';

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

  const batchPostsByUserId = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    return ids.map((id) => posts.filter((post) => post.authorId === id));
  };

  const batchUserSubscribedTo = async (ids: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: ids as string[] } },
    });

    const authors = await prisma.user.findMany({
      where: {
        subscribedToUser: { some: { subscriberId: { in: ids as string[] } } },
      },
    });

    const authorsMap = new Map<string, IUser>(
      authors.map((author) => [author.id, author]),
    );

    const subscriptionsMap = subscriptions.reduce(
      (acc, { subscriberId, authorId }) => {
        const author = authorsMap.get(authorId) as IUser;
        acc[subscriberId]
          ? acc[subscriberId].push(author)
          : (acc[subscriberId] = [author]);
        return acc;
      },
      {} as Record<string, IUser[]>,
    );

    return ids.map((id) => subscriptionsMap[id]);
  };

  const batchSubscribedToUser = async (ids: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: ids as string[] } },
    });
    const followers = await prisma.user.findMany({
      where: { userSubscribedTo: { some: { authorId: { in: ids as string[] } } } },
    });

    const followersMap = new Map<string, IUser>(
      followers.map((follower) => [follower.id, follower]),
    );

    const subscriptionsMap = subscriptions.reduce(
      (acc, { subscriberId, authorId }) => {
        const follower = followersMap.get(subscriberId) as IUser;
        acc[authorId] ? acc[authorId].push(follower) : (acc[authorId] = [follower]);
        return acc;
      },
      {} as Record<string, IUser[]>,
    );

    return ids.map((id) => subscriptionsMap[id]);
  };

  return {
    profileByUserIdLoader: new DataLoader(batchProfileByUserId),
    memberTypeLoader: new DataLoader(batchMemberType),
    postsByUserIdLoader: new DataLoader(batchPostsByUserId),
    userSubscribedToLoader: new DataLoader(batchUserSubscribedTo),
    subscribedToUserLoader: new DataLoader(batchSubscribedToUser),
  };
};
