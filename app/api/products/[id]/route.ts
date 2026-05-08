import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, ...rest } = body;

  const profit = (rest.retailPrice || 0) - (rest.wholesalePrice || 0);

  // Generate new slug if name changed
  let slug: string | undefined;
  if (name) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (existing && existing.name !== name) {
      slug = slugify(name);
      let uniqueSlug = slug;
      let counter = 1;
      while (
        await prisma.product.findFirst({
          where: { slug: uniqueSlug, NOT: { id } },
        })
      ) {
        uniqueSlug = `${slug}-${counter++}`;
      }
      slug = uniqueSlug;
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      ...(slug && { slug }),
      profit,
      ...rest,
    },
    include: { category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
