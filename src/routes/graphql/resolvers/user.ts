import { Context, Args } from '../types/share.js';
import { IUserInput } from '../types/user.js';

const getUser = async ({ id }: Args<{ id: string }>, { prisma }: Context) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getUsers = async (_args: Args, { prisma }: Context) => {
  return await prisma.user.findMany();
};

const createUser = async ({ dto }: Args<{ dto: IUserInput }>, { prisma }: Context) => {
  return await prisma.user.create({ data: dto });
};

export default {
  user: getUser,
  users: getUsers,
  createUser,
};
