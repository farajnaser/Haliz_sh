import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({
      data: { 
        id: "default", 
        storeName: "HALIZ", 
        storeNameAr: "هاليز", 
        whatsappNumber: "218922612675",
        facebook: "https://www.facebook.com/share/18Pwmj1cvH/",
        tiktok: "https://www.tiktok.com/@haliz.sh6?_r=1&_t=ZS-96B7G0VXPc1"
      },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: { ...body, id: "default" } });
  } else {
    settings = await prisma.settings.update({ where: { id: settings.id }, data: body });
  }
  return NextResponse.json(settings);
}
