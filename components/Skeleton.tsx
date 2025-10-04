export default function Skeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border border-accent2 rounded-lg bg-dark animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 bg-lighter rounded w-24"></div>
              <div className="h-8 bg-lighter rounded w-16"></div>
              <div className="h-3 bg-lighter rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="h-12 bg-dark border border-accent2 rounded flex-1 animate-pulse"></div>
        <div className="h-12 bg-dark border border-accent2 rounded w-36 animate-pulse"></div>
      </div>

      <div className="mb-6">
        <div className="h-6 bg-dark rounded w-32 mb-3 animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-6 bg-dark rounded w-24 animate-pulse"></div>
          <div className="h-6 bg-dark rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="mb-6 p-4 border border-accent2 rounded-lg bg-dark animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-6 bg-lighter rounded w-48 mb-3"></div>
              <div className="flex gap-2">
                <div className="h-5 bg-lighter rounded w-20"></div>
                <div className="h-5 bg-lighter rounded w-16"></div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className="h-8 w-8 bg-lighter rounded"></div>
              <div className="h-8 w-8 bg-lighter rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-lighter rounded-full"></div>
            <div className="h-4 bg-lighter rounded w-48"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-lighter rounded w-full"></div>
            <div className="h-4 bg-lighter rounded w-5/6"></div>
            <div className="h-4 bg-lighter rounded w-4/6"></div>
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-dark border border-accent2 rounded-lg animate-pulse">
        <div className="h-4 bg-lighter rounded w-64 mx-auto"></div>
      </div>
    </div>
  );
}
