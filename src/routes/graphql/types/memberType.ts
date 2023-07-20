import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: UUIDType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
