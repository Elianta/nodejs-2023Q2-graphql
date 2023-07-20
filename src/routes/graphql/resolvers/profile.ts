import { Context, NoArgs } from '../types/share.js';

const getProfiles = async (_args: NoArgs, { prisma }: Context) => {
  return await prisma.profile.findMany();
};

export default {
  profiles: getProfiles,
};
