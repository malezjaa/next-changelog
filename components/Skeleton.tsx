export default function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-fade-up" aria-busy="true">
      <div className="mb-10 w-full">
        <div className="mb-3 h-3 w-28 animate-pulse rounded bg-obsidian" />
        <div className="instrument-card grid grid-cols-2 overflow-hidden md:grid-cols-4">
          {["w-16", "w-12", "w-12", "w-24"].map((width, index) => (
            <div
              key={`${width}-${index}`}
              className="border-b border-graphite p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-obsidian" />
              <div
                className={`mt-5 h-8 ${width} animate-pulse rounded bg-obsidian`}
              />
              <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-obsidian" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 border-b border-graphite pb-6 md:flex-row md:items-center">
        <div className="h-10 w-full animate-pulse rounded border border-graphite bg-carbon sm:max-w-md" />
        <div className="flex gap-2 self-start md:ml-auto">
          <div className="h-10 w-32 animate-pulse rounded border border-graphite bg-carbon" />
          <div className="h-10 w-36 animate-pulse rounded border border-graphite bg-carbon" />
        </div>
      </div>

      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="instrument-card mb-5 animate-pulse p-5 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <div className="mb-3 h-5 w-20 rounded bg-obsidian" />
              <div className="h-7 w-3/4 rounded bg-obsidian" />
            </div>
            <div className="h-8 w-16 rounded bg-obsidian" />
          </div>
          <div className="mt-5 h-5 w-44 rounded bg-obsidian" />
          <div className="my-5 border-t border-graphite" />
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-obsidian" />
            <div className="h-3.5 w-5/6 rounded bg-obsidian" />
            <div className="h-3.5 w-2/3 rounded bg-obsidian" />
          </div>
        </div>
      ))}
    </div>
  );
}
