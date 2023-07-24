import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { Context, Args } from '../types/share.js';
import { IUserInput, userType } from '../types/user.js';
import { GraphQLList, GraphQLResolveInfo } from 'graphql';

const getUser = async ({ id }: Args<{ id: string }>, { userLoader }: Context) => {
  return await userLoader.load(id);
};

const getUsers = async (
  _args: Args,
  { prisma, userLoader }: Context,
  info: GraphQLResolveInfo,
) => {
  const parsedResolveInfoFragment = parseResolveInfo(info);
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment as ResolveTree,
    new GraphQLList(userType),
  ) as { fields: { [key in string]: ResolveTree } };

  const users = await prisma.user.findMany({
    include: {
      userSubscribedTo: !!fields.userSubscribedTo,
      subscribedToUser: !!fields.subscribedToUser,
    },
  });

  users.forEach((user) => {
    userLoader.prime(user.id, user);
  });

  return users;
};

const createUser = async ({ dto }: Args<{ dto: IUserInput }>, { prisma }: Context) => {
  return await prisma.user.create({ data: dto });
};

const deleteUser = async ({ id }: Args<{ id: string }>, { prisma }: Context) => {
  await prisma.user.delete({ where: { id } });
  return id;
};

const changeUser = async (
  { id, dto }: Args<{ id: string; dto: Partial<IUserInput> }>,
  { prisma }: Context,
) => {
  return await prisma.user.update({ where: { id }, data: dto });
};

const subscribeTo = async (
  { userId, authorId }: Args<{ userId: string; authorId: string }>,
  { prisma }: Context,
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { userSubscribedTo: { create: { authorId } } },
  });
};

const unsubscribeFrom = async (
  { userId, authorId }: Args<{ userId: string; authorId: string }>,
  { prisma }: Context,
) => {
  await prisma.subscribersOnAuthors.delete({
    where: { subscriberId_authorId: { subscriberId: userId, authorId } },
  });
};

export default {
  user: getUser,
  users: getUsers,
  createUser,
  deleteUser,
  changeUser,
  subscribeTo,
  unsubscribeFrom,
};
