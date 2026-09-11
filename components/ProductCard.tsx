"use client";

import { AlloyWheel } from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import { SiWhatsapp } from "react-icons/si";

export function ProductCard({ product, index, priority = false }: { product: AlloyWheel; index: number; priority?: boolean }) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);

  return (
    <div
      className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 fill-mode-both h-full"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => router.push(`/product?id=${product.id}`)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-slate-800/50">
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            {product.brand}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${isWished ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}
            style={{ fontVariationSettings: isWished ? '"FILL" 1' : '"FILL" 0' }}
          >
            favorite
          </span>
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
          loading={priority ? "eager" : "lazy"}
        />

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 md:p-5 border-t border-slate-100 dark:border-slate-800/50 relative bg-white dark:bg-slate-900">
        <div className="flex-1">
          <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm md:text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {product.size}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {product.pcd}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {product.finish}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          {/* <div className="flex items-end gap-2">
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.originalPrice && (
              <p className="text-xs font-medium text-slate-400 line-through mb-0.5">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div> */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const params = new URLSearchParams({
                item: product.name,
                size: product.size,
                pcd: product.pcd,
                finish: product.finish,
                price: product.price.toString(),
                image: product.image
              });
              router.push(`/order?${params.toString()}`);
            }}
            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] text-sm font-extrabold tracking-wide transition-all duration-300 hover:bg-[#25D366] hover:text-white dark:hover:text-white active:scale-[0.98] group-hover:bg-[#25D366] group-hover:text-white dark:group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(37,211,102,0.3)]"
          >
            <SiWhatsapp className="text-[16px]" />
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
