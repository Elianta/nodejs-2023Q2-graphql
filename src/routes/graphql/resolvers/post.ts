import { Context, Args } from '../types/share.js';

const getPost = async ({ id }: Args<{ id: string }>, { prisma }: Context) => {
  return await prisma.post.findUnique({ where: { id } });
};

const getPosts = async (_args: Args, { prisma }: Context) => {
  return await prisma.post.findMany();
};

export default {
  post: getPost,
  posts: getPosts,
};
