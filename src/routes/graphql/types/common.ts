import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

export interface IParent {
  id: string | MemberTypeId;
  authorId?: string;
  userId?: string;
  memberTypeId?: string;
}

export interface IContext {
  prisma: PrismaClient;
}
