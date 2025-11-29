import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="h-8 bg-brand-500/20 rounded-full w-48 mx-auto mb-8 animate-pulse"></div>
            <div className="h-16 bg-white/10 rounded-lg w-3/4 max-w-2xl mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded-lg w-2/3 max-w-xl mx-auto mb-12 animate-pulse"></div>
            <div className="flex justify-center gap-4">
              <div className="h-12 bg-brand-500/30 rounded-full w-48 animate-pulse"></div>
              <div className="h-12 bg-white/10 rounded-full w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-10 bg-slate-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

