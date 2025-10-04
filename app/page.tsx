import Link from "next/link";
import { Suspense, useId } from "react";
import FrameworkReleases from "@/components/Releases/FrameworkReleases";
import ReleasesLoading from "@/components/Skeleton";

export default function Page() {
  return (
    <main className="flex items-center justify-between p-5 sm:p-16 text-zinc-200 w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <div
          className={
            "flex flex-col bg-bgSVG bg-no-repeat bg-center justify-center items-center h-[400px] animate-fade-in"
          }
        >
          <h1
            className={
              "font-extrabold text-[3rem] sm:text-[4rem] text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-slide-up"
            }
          >
            Next.js Changelog
          </h1>
          <p
            className={
              "text-center text-lg text-gray-300 mt-2 animate-slide-up-delay"
            }
          >
            Stay up to date with the latest releases of Next.js framework and
            packages.
          </p>
          <div className={"mt-8 flex gap-4 animate-slide-up-delay-2"}>
            <Link
              href={"https://nextjs.org/"}
              target={"_blank"}
              rel={"nofollow"}
            >
              <button
                className="btn bg-white text-black hover:bg-gray-200 hover:scale-105 border-none transition-all duration-200 ease-in-out shadow-lg"
                type={"button"}
              >
                Visit Next.js
              </button>
            </Link>
            <a href="#releases">
              <button
                className="btn btn-outline hover:scale-105 transition-all duration-200 ease-in-out"
                type={"button"}
              >
                View Releases
              </button>
            </a>
          </div>
        </div>

        <div
          id="#releases"
          className="flex flex-col items-center justify-center mt-[4rem] w-full max-w-7xl mx-auto scroll-mt-20"
        >
          <div className="w-full px-4">
            <Suspense fallback={<ReleasesLoading />}>
              <FrameworkReleases />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
