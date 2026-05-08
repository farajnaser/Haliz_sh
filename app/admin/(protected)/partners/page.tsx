import { prisma } from "@/lib/prisma";
import PartnersClient from "@/components/admin/PartnersClient";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { shares: true }
      }
    }
  });

  return <PartnersClient initialPartners={partners} />;
}
