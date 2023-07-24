import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { profileType } from './profile.js';
import { Context } from './share.js';
import { postType } from './post.js';

export interface ISubscriberOnAuthor {
  subscriberId: string;
  authorId: string;
}

export interface IUserInput {
  name: string;
  balance: number;
}
export interface IUser {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo?: ISubscriberOnAuthor[];
  subscribedToUser?: ISubscriberOnAuthor[];
}

export const userType: GraphQLObjectType<IUser, Context> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType,
      resolve: async (parent: IUser, _args, { profileByUserIdLoader }: Context) => {
        return await profileByUserIdLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (parent: IUser, _args, { postsByUserIdLoader }: Context) => {
        return await postsByUserIdLoader.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (parent: IUser, _args, { userLoader }: Context) => {
        return await userLoader.loadMany(
          (parent.userSubscribedTo || []).map(({ authorId }) => authorId),
        );
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (parent: IUser, _args, { userLoader }: Context) => {
        return await userLoader.loadMany(
          (parent.subscribedToUser || []).map(({ subscriberId }) => subscriberId),
        );
      },
    },
  }),
});

export const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
