import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Admin User
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@haliz.com" },
    update: {},
    create: {
      email: "admin@haliz.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Store Settings
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "HALIZ",
      storeNameAr: "هاليز",
      whatsappNumber: "966500000000",
    },
  });
  console.log("✅ Store settings ready");

  console.log("\n🎉 Done! Log in at /admin/login");
  console.log("📧 admin@haliz.com  🔑 admin123");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
