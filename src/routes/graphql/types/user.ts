import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { profileType } from './profile.js';
import { Context } from './share.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
}

export const userType = new GraphQLObjectType({
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
  }),
});
