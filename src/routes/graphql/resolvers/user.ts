import { Context, NoArgs } from '../types/share.js';

const getUsers = async (_args: NoArgs, { prisma }: Context) => {
  return await prisma.user.findMany();
};

export default {
  users: getUsers,
};
