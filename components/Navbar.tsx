import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { BsGithub } from "react-icons/bs";
import ChangelogMark from "@/components/Icons/ChangelogMark";

export default function Navbar() {
  return (
    <nav className="site-nav sticky top-0 z-40 w-full" aria-label="Primary navigation">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Next.js Changelog home"
        >
          <span className="brand-mark flex h-7 w-7 items-center justify-center text-coral">
            <ChangelogMark className="h-6 w-6" />
          </span>
          <span className="text-sm font-medium tracking-[-0.01em] text-paper">
            Next.js <span className="text-ash">changelog</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 text-[13px] text-ash">
          <Link
            href="https://nextjs.org/docs"
            rel="noopener noreferrer"
            target="_blank"
            className="hidden rounded-lg px-3 py-2 transition-colors duration-150 hover:text-paper md:inline-flex"
          >
            Docs <FiArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
          <Link
            href="https://github.com/malezjaa/next-changelog"
            rel="noopener noreferrer"
            target="_blank"
            className="button-ghost inline-flex items-center gap-2 px-3 py-2"
          >
            <BsGithub className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Source</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
