import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { userType } from './types/user.js';
import { memberType } from './types/memberType.js';
import { postType } from './types/post.js';
import { profileType } from './types/profile.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(userType),
    },
    memberTypes: {
      type: new GraphQLList(memberType),
    },
    posts: {
      type: new GraphQLList(postType),
    },
    profiles: {
      type: new GraphQLList(profileType),
    },
  },
});

export const gqlSchema = new GraphQLSchema({ query: queryType });
