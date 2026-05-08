import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "createdAt-desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (category) where.category = { slug: category };
  if (featured === "true") where.featured = true;
  if (status) {
    where.status = status;
  } else {
    where.status = "ACTIVE";
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameAr: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [sortField, sortDir] = sort.split("-");
  const orderBy: Record<string, string> = {};
  orderBy[sortField || "createdAt"] = sortDir || "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, nameAr, ...rest } = body;

  const slug = slugify(name);
  let uniqueSlug = slug;
  let counter = 1;

  while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  const profit = (rest.retailPrice || 0) - (rest.wholesalePrice || 0);

  const product = await prisma.product.create({
    data: {
      name,
      nameAr,
      slug: uniqueSlug,
      profit,
      ...rest,
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
