import { PrismaClient } from '@prisma/client';

export type Args<T = never> = {
  [k in keyof T]: T[k];
};

export interface Context {
  prisma: PrismaClient;
}
