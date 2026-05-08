import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  image: string | null;
}

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.nameAr || category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 16vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-3">
          <p className="text-white font-semibold text-sm text-center drop-shadow-lg">
            {category.nameAr || category.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
