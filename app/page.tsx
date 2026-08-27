import { Suspense } from "react";
import FrameworkReleases from "@/components/Releases/FrameworkReleases";
import ReleasesLoading from "@/components/Skeleton";

export default function Page() {
  return (
    <main className="relative overflow-hidden">
      <section className="hero relative" aria-labelledby="hero-heading">
        <div className="hero-atmosphere absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1200px] px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32">
          <div className="max-w-3xl animate-fade-up">
            <div className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              Next.js changelog
            </div>
            <h1
              id="hero-heading"
              className="max-w-3xl text-balance text-5xl font-normal leading-[1.02] tracking-[0.004em] text-paper sm:text-7xl"
            >
              Latest Next.js releases, in one clear line.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-ash sm:text-lg">
              Read Next.js release notes, compare stable and canary builds, and
              follow every change back to GitHub.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#releases"
                className="button-primary inline-flex items-center px-4 py-2.5 text-sm font-[510] tracking-[-0.011em]"
              >
                View current releases
                <span
                  aria-hidden="true"
                  className="ml-2 text-base leading-none"
                >
                  ↓
                </span>
              </a>
              <a
                href="https://nextjs.org/"
                rel="noopener noreferrer"
                target="_blank"
                className="button-ghost inline-flex items-center px-4 py-2.5 text-sm"
              >
                nextjs.org{" "}
                <span aria-hidden="true" className="ml-2">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="releases"
        aria-labelledby="releases-heading"
        className="mx-auto max-w-[1200px] scroll-mt-20 px-5 pb-24 sm:px-8 sm:pb-32"
      >
        <div className="mb-8 flex flex-col gap-3 border-t border-graphite pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
              release stream
            </p>
            <h2
              id="releases-heading"
              className="mt-2 text-3xl font-[510] tracking-[-0.035em] text-paper sm:text-4xl"
            >
              Next.js release notes and version history
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-fog sm:text-right">
            Browse the last year of GitHub releases by channel or version.
          </p>
        </div>

        <Suspense fallback={<ReleasesLoading />}>
          <FrameworkReleases />
        </Suspense>
      </section>
    </main>
  );
}
