import graphql from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { IContext, IParent } from './common.js';
const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: async (parent: IParent, _, context: IContext) => {
        return await context.prisma.user.findUnique({
          where: { id: parent.authorId },
        });
      },
    },
  }),
});
