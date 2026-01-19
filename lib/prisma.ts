
// [STEP 1] Import PrismaClient from '@prisma/client'
// import { PrismaClient } from ...

import { PrismaClient } from "@prisma/client";

// [STEP 2] Create a type for the global object to include prisma
// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// [STEP 3] Export the prisma instance
// It should check if globalForPrisma.prisma exists, if not create a new PrismaClient()
// Optional: Add { log: ['query'] } to the PrismaClient constructor to see SQL logs
// export const prisma = ... || new PrismaClient(...)

// [STEP 4] Save the instance to global if not in production
// if (process.env.NODE_ENV !== 'production') ...

const globalForPrisma = global as unknown as {prisma: PrismaClient};

let prismaInstance;
try {
  prismaInstance = globalForPrisma.prisma || new PrismaClient({ log: ['query'] });
} catch (e) {
  console.error('FAILED TO INITIALIZE PRISMA CLIENT:', e);
  // Fallback or rethrow depending on desired behavior, for now we log
  throw e;
}

export const prisma = prismaInstance;

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;