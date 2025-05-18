export default function ShimmerPokemonCard() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full aspect-[3/4] animate-pulse"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-600 shadow-md bg-gray-800/60">
              <div className="w-full h-full flex flex-col items-center justify-between p-2">
                <div className="w-full h-full flex-1 rounded-md bg-gray-700" />
                <div className="w-full h-4 mt-2 rounded bg-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
