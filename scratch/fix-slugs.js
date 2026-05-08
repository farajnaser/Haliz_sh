const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const dotenv = require('dotenv');
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories found:', categories.length);

  for (const cat of categories) {
    let newSlug = cat.slug;
    const nameAr = cat.nameAr || '';
    const nameEn = cat.name || '';

    if (nameAr.includes('مكياج') || nameEn.toLowerCase().includes('makeup')) newSlug = 'makeup';
    if (nameAr.includes('عناية') || nameEn.toLowerCase().includes('skin')) newSlug = 'skincare';
    if (nameAr.includes('إكسسوار') || nameAr.includes('اكسسوار') || nameEn.toLowerCase().includes('access')) newSlug = 'accessories';
    if (nameAr.includes('عطر') || nameAr.includes('عطور') || nameEn.toLowerCase().includes('perfume')) newSlug = 'perfumes';

    if (newSlug !== cat.slug) {
      console.log(`Updating ${cat.name} slug: ${cat.slug} -> ${newSlug}`);
      await prisma.category.update({
        where: { id: cat.id },
        data: { slug: newSlug }
      });
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
