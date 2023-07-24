import { Context, Args } from '../types/share.js';

export const getMemberType = async (
  { id }: Args<{ id: string }>,
  { prisma }: Context,
) => {
  return await prisma.memberType.findUnique({
    where: {
      id,
    },
  });
};

const getMemberTypes = async (_args: Args, { prisma }: Context) => {
  return await prisma.memberType.findMany();
};

export default {
  memberType: getMemberType,
  memberTypes: getMemberTypes,
};
