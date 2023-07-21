import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql } from 'graphql';
import memberTypeResolver from './resolvers/memberType.js';
import postResolver from './resolvers/post.js';
import userResolver from './resolvers/user.js';
import profileResolver from './resolvers/profile.js';
import { createDataLoaders } from './dataLoaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const dataLoaders = createDataLoaders(fastify.prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return await graphql({
        schema: gqlSchema,
        source: req.body.query,
        rootValue: {
          ...memberTypeResolver,
          ...postResolver,
          ...userResolver,
          ...profileResolver,
        },
        variableValues: req.body.variables,
        contextValue: { prisma: fastify.prisma, ...dataLoaders },
      });
    },
  });
};

export default plugin;
