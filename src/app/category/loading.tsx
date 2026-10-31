export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#f7faf7]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Heading Skeleton */}
        <div className="mb-8 animate-pulse rounded-2xl bg-white p-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gray-200" />

            <div className="space-y-3">
              <div className="h-7 w-40 rounded bg-gray-200" />
              <div className="h-4 w-64 max-w-full rounded bg-gray-100" />
            </div>
          </div>
        </div>

        {/* Sort Skeleton */}
        <div className="mb-6 flex justify-between">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-10 w-48 rounded-xl bg-gray-200" />
        </div>

        {/* Product Card Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4"
            >
              <div className="h-32 rounded-xl bg-gray-200" />
              <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
              <div className="mt-5 h-8 rounded bg-gray-100" />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}