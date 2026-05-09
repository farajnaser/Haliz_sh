import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true, 
      createdBy: { select: { name: true, email: true } },
      owners: { include: { partner: { select: { name: true, email: true } } } }
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    
    const { name, owners, ...rest } = body;

    // Sanitize rest to avoid Prisma errors with relations or non-existent fields
    const allowedFields = [
      "nameAr", "description", "descriptionAr", "retailPrice", 
      "wholesalePrice", "stock", "sku", "barcode", "featured", 
      "images", "categoryId", "status", "salePrice"
    ];
    const updateData: any = {};
    allowedFields.forEach(f => {
      if (rest[f] !== undefined) updateData[f] = rest[f];
    });

    const finalWholesalePrice = updateData.wholesalePrice !== undefined ? updateData.wholesalePrice : (existingProduct.wholesalePrice || 0);
    const finalStock = updateData.stock !== undefined ? updateData.stock : (existingProduct.stock || 0);
    const totalCapitalLimit = finalWholesalePrice * finalStock;

    // Validation: Sum of owners' amounts <= Total Capital
    if (owners && owners.length > 0) {
      const totalOwnersAmount = owners.reduce((acc: number, o: any) => acc + (o.amount || 0), 0);
      if (totalOwnersAmount > totalCapitalLimit && totalCapitalLimit > 0) {
        return NextResponse.json({ 
          error: `إجمالي مبالغ المساهمين (${totalOwnersAmount}) يتجاوز رأس مال المنتج (${totalCapitalLimit})` 
        }, { status: 400 });
      }
    }

    const sellingPrice = (updateData.salePrice !== undefined ? updateData.salePrice : existingProduct.salePrice)
      ? (updateData.salePrice !== undefined ? updateData.salePrice : existingProduct.salePrice)
      : (updateData.retailPrice !== undefined ? updateData.retailPrice : existingProduct.retailPrice);
    
    const profit = (sellingPrice || 0) - finalWholesalePrice;

    // Generate new slug if name changed
    let slug: string | undefined;
    if (name && existingProduct.name !== name) {
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        profit,
        ...updateData,
        owners: {
          deleteMany: {},
          create: (owners || []).map((o: any) => ({
            partnerId: o.partnerId,
            amount: o.amount
          }))
        }
      },
      include: { 
        category: true, 
        createdBy: { select: { name: true, email: true } },
        owners: { include: { partner: { select: { name: true, email: true } } } }
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "حدث خطأ غير متوقع" 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
