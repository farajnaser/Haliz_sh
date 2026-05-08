import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function AdminSettingsPage() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: "default",
        storeName: "HALIZ",
        storeNameAr: "هاليز",
        whatsappNumber: "966500000000",
      },
    });
  }
  return <SettingsClient settings={settings} />;
}
