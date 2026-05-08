import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

let rawPrisma = createPrismaClient();

// Safeguard for model naming issues
if (!(rawPrisma as any).partner && (rawPrisma as any).Partner) {
  (rawPrisma as any).partner = (rawPrisma as any).Partner;
}

export const prisma = rawPrisma;

// Debug available models
if (process.env.NODE_ENV !== "production") {
  console.log("Prisma Models:", Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
}

// Debug available models
if (process.env.NODE_ENV !== "production") {
  console.log("Prisma Models:", Object.keys(rawPrisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
}
