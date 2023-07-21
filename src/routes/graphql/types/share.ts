import { PrismaClient } from '@prisma/client';
import { createDataLoaders } from '../dataLoaders.js';

export type Args<T = never> = {
  [k in keyof T]: T[k];
};

type DataLoaders = ReturnType<typeof createDataLoaders>;

export interface Context extends DataLoaders {
  prisma: PrismaClient;
}
