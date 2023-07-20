import { PrismaClient } from '@prisma/client';

export type NoArgs = Record<string, never>;

export interface Context {
  prisma: PrismaClient;
}
