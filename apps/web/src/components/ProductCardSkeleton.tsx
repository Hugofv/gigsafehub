import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-14 h-14 rounded-xl bg-slate-200"></div>
            <div className="flex-1">
              <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="h-6 bg-slate-200 rounded w-12 mb-1"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="h-10 bg-slate-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-2.5 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
        <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

