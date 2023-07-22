import { IProfileInput } from '../types/profile.js';
import { Context, Args } from '../types/share.js';

const getProfile = async ({ id }: Args<{ id: string }>, { prisma }: Context) => {
  return await prisma.profile.findUnique({ where: { id } });
};

const getProfiles = async (_args: Args, { prisma }: Context) => {
  return await prisma.profile.findMany();
};

const createProfile = async (
  { dto }: Args<{ dto: IProfileInput }>,
  { prisma }: Context,
) => {
  return await prisma.profile.create({ data: dto });
};

const deleteProfile = async ({ id }: Args<{ id: string }>, { prisma }: Context) => {
  await prisma.profile.delete({ where: { id } });
  return id;
};

const changeProfile = async (
  { id, dto }: Args<{ id: string; dto: IProfileInput }>,
  { prisma }: Context,
) => {
  return await prisma.profile.update({
    where: { id },
    data: dto,
  });
};

export default {
  profile: getProfile,
  profiles: getProfiles,
  createProfile,
  deleteProfile,
  changeProfile,
};
