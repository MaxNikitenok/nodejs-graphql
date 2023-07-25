import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './post.js';
import { IContext, IParent } from './common.js';
import { ProfileType } from './profile.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType as GraphQLObjectType<IParent, IContext>,
      resolve: async (source: IParent, _args, context: IContext) => {
        return await context.prisma.profile.findUnique({ where: { userId: source.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source: IParent, _args, context: IContext) => {
        return await context.prisma.post.findMany({
          where: { authorId: source.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source: IParent, _args, context: IContext) => {
        return await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: source.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source: IParent, _args, context: IContext) => {
        return await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: source.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});
