export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-soft animate-pulse">
      <div className="aspect-square bg-cream-dark skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-cream-dark rounded-full w-1/3 skeleton" />
        <div className="h-4 bg-cream-dark rounded-full w-4/5 skeleton" />
        <div className="h-4 bg-cream-dark rounded-full w-3/5 skeleton" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-cream-dark rounded-full w-1/3 skeleton" />
          <div className="w-9 h-9 bg-cream-dark rounded-full skeleton" />
        </div>
      </div>
    </div>
  );
}
