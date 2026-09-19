import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 bg-stone-200 rounded-sm w-1/3" />
        <div className="h-4 bg-stone-200 rounded-sm w-5/6" />
        <div className="h-3.5 bg-stone-200 rounded-sm w-1/2" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 bg-stone-200 rounded-sm w-1/3" />
          <div className="h-9 bg-stone-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export const PageLoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading AmarBazaar...',
}) => {
  return (
    <div className="min-h-[450px] flex flex-col items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
        </div>
      </div>
      <p className="mt-4 text-stone-600 font-medium text-sm animate-pulse">{message}</p>
    </div>
  );
};
