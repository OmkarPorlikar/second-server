// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();


import { PrismaClient } from '../prisma/generated/prisma-client-js/index.js'
const prisma = new PrismaClient()

export { prisma };
