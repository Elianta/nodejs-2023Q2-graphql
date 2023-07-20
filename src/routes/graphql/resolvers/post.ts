import { Context, NoArgs } from '../types/share.js';

const getPosts = async (_args: NoArgs, { prisma }: Context) => {
  return await prisma.post.findMany();
};

export default {
  posts: getPosts,
};
