export default function Skeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="h-8 bg-dark rounded w-48 mb-3 animate-pulse"></div>
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
          <div className="h-6 bg-lighter rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-lighter rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-lighter rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}
