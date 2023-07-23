import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  graphql,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType, MemberTypeId } from './types/member.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

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
      // console.log(">>>>>>>>>>", prisma)
      const query = new GraphQLObjectType({
        name: 'Query',
        fields: {
          user: {
            type: UserType,
            args: {
              id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (parent, args: { id: string }) => {
              return await prisma.user.findUnique({
                where: { id: args.id },
              });
            },
          },

          users: {
            type: new GraphQLList(UserType),
            resolve: async () => {
              return await prisma.user.findMany();
            },
          },

          post: {
            type: PostType,
            args: {
              id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (parent, args: { id: string }) => {
              return await prisma.post.findUnique({
                where: {
                  id: args.id,
                },
              });
            },
          },

          posts: {
            type: new GraphQLList(PostType),
            resolve: async () => {
              return await prisma.post.findMany();
            },
          },

          profile: {
            type: ProfileType,
            args: {
              id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (parent, args: { id: string }) => {
              return await prisma.profile.findUnique({
                where: {
                  id: args.id,
                },
              });
            },
          },

          profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async () => {
              return await prisma.profile.findMany();
            },
          },

          memberType: {
            type: MemberType,
            args: {
              id: { type: new GraphQLNonNull(MemberTypeId) },
            },
            resolve: async (parent, args: { id: string }) => {
              return await prisma.memberType.findUnique({
                where: {
                  id: args.id,
                },
              });
            },
          },

          memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async () => {
              return await prisma.memberType.findMany();
            },
          },
        },
      });

      const schema = new GraphQLSchema({
        query,
        // mutation,
      });
      const source = req.body.query;
      const variableValues = req.body.variables;

      const { data, errors } = await graphql({
        schema,
        source,
        variableValues,
        contextValue: { prisma },
      });

      return { data, errors };
    },
  });
};

export default plugin;
