import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { userType } from './types/user.js';
import { memberType, memberTypeId } from './types/memberType.js';
import { postType } from './types/post.js';
import { profileType } from './types/profile.js';
import { UUIDType } from './types/uuid.js';

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
  fields: () => ({
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    users: {
      type: new GraphQLList(userType),
    },
    memberType: {
      type: memberType,
      args: {
        id: {
          type: new GraphQLNonNull(memberTypeId),
        },
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    posts: {
      type: new GraphQLList(postType),
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
    },
  }),
});

export const gqlSchema = new GraphQLSchema({ query: queryType });
