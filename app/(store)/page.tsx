export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/store/HeroBanner";
import BrandStory from "@/components/store/BrandStory";
import CollectionSection from "@/components/store/CollectionSection";
import FeaturedProductsSection from "@/components/store/FeaturedProductsSection";
import EverydayStyleSection from "@/components/store/EverydayStyleSection";
import ForYouSection from "@/components/store/ForYouSection";
import InstagramGallery from "@/components/store/InstagramGallery";
import StoreFooter from "@/components/store/StoreFooter";

export default async function Home() {
  // Fetch categories
  const categories = await prisma.category.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" }
    ],
    take: 8,
  });

  // Fetch "For You" products (could be a different logic, using the same for now)
  const forYouProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <main className="min-h-screen bg-white overflow-hidden flex flex-col items-center">
      {/* 1. Hero Section */}
      <HeroBanner featuredProducts={featuredProducts.slice(0, 3)} />

      {/* 2. Brand Intro Section */}
      <BrandStory />

      {/* 3. Collection Section */}
      <CollectionSection categories={categories} />

      {/* 4. Featured Products Section */}
      <FeaturedProductsSection products={featuredProducts} />

      {/* 5. Everyday Style Section */}
      <EverydayStyleSection />

      {/* 6. For You Section */}
      <ForYouSection products={forYouProducts} />

      {/* 7. Instagram Gallery */}
      <InstagramGallery />
    </main>
  );
}
