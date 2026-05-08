import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug: providedSlug, ...rest } = body;

  const slug = providedSlug || slugify(name);

  const category = await prisma.category.create({
    data: { name, slug, ...rest },
  });

  return NextResponse.json(category, { status: 201 });
}
