import { Context, Args } from '../types/share.js';

const getUser = async ({ id }: Args<{ id: string }>, { prisma }: Context) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getUsers = async (_args: Args, { prisma }: Context) => {
  return await prisma.user.findMany();
};

export default {
  user: getUser,
  users: getUsers,
};
