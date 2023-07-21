import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { memberType } from './memberType.js';
import { Context } from './share.js';
import { MemberTypeId } from '../types/memberType.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberType,
      resolve: async (parent: IProfile, _args, { memberTypeLoader }: Context) => {
        return await memberTypeLoader.load(parent.memberTypeId);
      },
    },
  }),
});
