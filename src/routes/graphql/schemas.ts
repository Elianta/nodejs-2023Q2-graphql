import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { changeUserInputType, createUserInputType, userType } from './types/user.js';
import { memberType, memberTypeId } from './types/memberType.js';
import { changePostInputType, createPostInputType, postType } from './types/post.js';
import {
  changeProfileInputType,
  createProfileInputType,
  profileType,
} from './types/profile.js';
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
  fields: {
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
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userType,
      args: {
        dto: { type: createUserInputType },
      },
    },
    createPost: {
      type: postType,
      args: {
        dto: { type: createPostInputType },
      },
    },
    createProfile: {
      type: profileType,
      args: {
        dto: { type: createProfileInputType },
      },
    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    changeUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changeUserInputType },
      },
    },
    changePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changePostInputType },
      },
    },
    changeProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changeProfileInputType },
      },
    },
    subscribeTo: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  },
});

export const gqlSchema = new GraphQLSchema({ query: queryType, mutation: mutationType });
