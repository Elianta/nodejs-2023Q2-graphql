import { Context, NoArgs } from '../types/share.js';

const getMemberTypes = async (_args: NoArgs, { prisma }: Context) => {
  return await prisma.memberType.findMany();
};

export default {
  memberTypes: getMemberTypes,
};
