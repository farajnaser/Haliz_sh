const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { nameAr: true, name: true, slug: true, retailPrice: true },
    take: 5
  });
  console.log(JSON.stringify(products, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
