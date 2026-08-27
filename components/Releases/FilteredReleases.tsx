"use client";

import Image from "next/image";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiExternalLink,
  FiLoader,
  FiSearch,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as semver from "semver";
import ReleaseStats from "@/components/ReleaseStats";
import type { Release } from "@/utils/api";
import ReleaseFilter, { type FilterOptions } from "./ReleaseFilter";
import { generatePageNumbers } from "@/utils/pagination";
import { formatRelativeTime, getReleaseType } from "@/utils/releases";

interface FilteredReleasesProps {
  releases: Release[];
}

const alertLabels = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
} as const;

type AlertType = keyof typeof alertLabels;

const alertPattern = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

const MarkdownLink = ({
  href,
  children,
}: React.ComponentProps<"a">) => (
  <a href={href} rel="nofollow noopener noreferrer" target="_blank">
    {children}
  </a>
);

const getTextContent = (children: React.ReactNode): string => {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  if (React.isValidElement(children)) {
    const element = children as React.ReactElement<{
      children?: React.ReactNode;
    }>;
    return getTextContent(element.props.children);
  }

  return "";
};

const getAlertType = (children: React.ReactNode): AlertType | null => {
  const match = getTextContent(children).match(alertPattern);
  return match ? (match[1].toUpperCase() as AlertType) : null;
};

const stripAlertMarker = (children: React.ReactNode): React.ReactNode => {
  let markerRemoved = false;

  const strip = (child: React.ReactNode): React.ReactNode => {
    if (markerRemoved) return child;

    if (typeof child === "string") {
      const match = child.match(alertPattern);
      if (!match) return child;

      markerRemoved = true;
      return child.slice(match[0].length);
    }

    if (Array.isArray(child)) {
      return child.map((item, index) => (
        <React.Fragment key={index}>{strip(item)}</React.Fragment>
      ));
    }

    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return React.cloneElement(element, {
        children: strip(element.props.children),
      });
    }

    return child;
  };

  return strip(children);
};

const transformText = (text: string): React.ReactNode => {
  const tokenPattern = /(^|[\s([{"'])((?:#\d+)|(?:@[\w-]+))/g;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text)) !== null) {
    const matchStart = match.index;
    const prefix = match[1];
    const token = match[2];
    const tokenStart = matchStart + prefix.length;

    if (matchStart > cursor) parts.push(text.slice(cursor, matchStart));
    if (prefix) parts.push(prefix);

    const href = token.startsWith("#")
      ? `https://github.com/vercel/next.js/pull/${token.slice(1)}`
      : `https://github.com/${token.slice(1)}`;

    parts.push(
      <Link
        key={`${token}-${tokenStart}`}
        href={href}
        rel="nofollow noopener noreferrer"
        target="_blank"
      >
        <span className="text-link">{token}</span>
      </Link>,
    );

    cursor = matchStart + match[0].length;
  }

  return parts.length > 0 ? [...parts, text.slice(cursor)] : text;
};

const transformInlineChildren = (
  children: React.ReactNode,
): React.ReactNode => {
  if (typeof children === "string") return transformText(children);
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>
        {typeof child === "string" ? transformText(child) : child}
      </React.Fragment>
    ));
  }
  return children;
};

const GitHubAlert = ({
  type,
  children,
}: {
  type: AlertType;
  children: React.ReactNode;
}) => (
  <div
    className={`gh-alert gh-alert-${type.toLowerCase()}`}
    data-gh-alert="true"
    role="note"
  >
    <div className="gh-alert-label">{alertLabels[type]}</div>
    <div className="gh-alert-body">{stripAlertMarker(children)}</div>
  </div>
);

const CustomListItem = ({ children }: any) => (
  <li>{transformInlineChildren(children)}</li>
);

const CustomParagraph = ({ children }: any) => {
  const alertType = getAlertType(children);

  if (alertType) {
    return <GitHubAlert type={alertType}>{children}</GitHubAlert>;
  }

  return <p>{transformInlineChildren(children)}</p>;
};

const CustomBlockquote = ({ children }: any) => {
  const childNodes = React.Children.toArray(children);
  const alert = childNodes.find(
    (child) =>
      React.isValidElement(child) &&
      (child.props as { "data-gh-alert"?: string })["data-gh-alert"] === "true",
  );

  if (
    alert &&
    childNodes.filter((child) => typeof child !== "string").length === 1
  ) {
    return alert;
  }

  return <blockquote>{children}</blockquote>;
};

const ReleaseCard = React.memo(
  ({ release, isLatest }: { release: Release; isLatest?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const releaseType = getReleaseType(release);
    const releaseTitle = release.name || release.tag_name;
    const releaseTypeClass =
      releaseType === "stable"
        ? "border-success/50 text-success"
        : "border-coral/50 text-coral";

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(release.body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    return (
      <article
        className="instrument-card flex h-full w-full flex-col justify-center p-5 transition-[border-color] duration-150 hover:border-smoke sm:p-6"
        aria-labelledby={`release-${release.id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {isLatest && (
                <span className="inline-flex items-center gap-1.5 rounded bg-graphite px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
                  <span className="h-1.5 w-1.5 rounded-full bg-acid" />
                  latest
                </span>
              )}
              <span
                className={`rounded border bg-transparent px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${releaseTypeClass}`}
              >
                {releaseType}
              </span>
            </div>
            <h3
              id={`release-${release.id}`}
              className="truncate text-xl font-[510] tracking-[-0.025em] text-paper sm:text-2xl"
            >
              {releaseTitle}
            </h3>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-1">
            <button
              onClick={copyToClipboard}
              className="button-icon inline-flex h-8 w-8 items-center justify-center"
              aria-label="Copy release notes"
              title="Copy release notes"
              type="button"
            >
              <span
                className="t-icon-swap"
                data-state={copied ? "b" : "a"}
                aria-hidden="true"
              >
                <span className="t-icon" data-icon="a">
                  <FiCopy className="h-4 w-4" />
                </span>
                <span className="t-icon text-success" data-icon="b">
                  <FiCheck className="h-4 w-4" />
                </span>
              </span>
            </button>
            <Link
              href={release.html_url}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`View ${releaseTitle} on GitHub`}
              title="Go to release"
              className="button-icon inline-flex h-8 w-8 items-center justify-center"
            >
              <FiExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-row flex-wrap items-center gap-2 text-sm text-fog">
          <Link
            href={`https://github.com/${encodeURIComponent(release.author.login)}`}
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="inline-flex items-center gap-2 text-mist transition-colors hover:text-link"
          >
            <Image
              src={release.author.avatar_url}
              alt={`${release.author.login}'s GitHub avatar`}
              className="h-7 w-7 rounded-full border border-graphite"
              width={100}
              height={100}
            />
            <span className="font-medium">{release.author.login}</span>
          </Link>
          <time dateTime={release.created_at}>
            released this {formatRelativeTime(release.created_at)}
          </time>
          {/*<p className="ml-2 text-blue-500">*/}
          {/*  <Link*/}
          {/*    href={`https://github.com/vercel/next.js/commit/${release.target_commitish}`}*/}
          {/*    rel="nofollow"*/}
          {/*    target="_blank"*/}
          {/*  >*/}
          {/*    {formatCommitHash(release.target_commitish)}*/}
          {/*  </Link>*/}
          {/*</p>*/}
        </div>

        <div className="my-5 border-t border-graphite" />

        <div className="release-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: MarkdownLink,
              blockquote: CustomBlockquote,
              li: CustomListItem,
              p: CustomParagraph,
            }}
          >
            {release.body}
          </ReactMarkdown>
        </div>
      </article>
    );
  },
);

ReleaseCard.displayName = "ReleaseCard";

const PaginationButton = React.memo(
  ({
    page,
    currentPage,
    onClick,
  }: {
    page: number | string;
    currentPage: number;
    onClick: (page: number) => void;
  }) => {
    if (typeof page === "string") {
      return (
        <span className="inline-flex h-8 min-w-8 items-center justify-center border-y border-graphite bg-carbon px-2 font-mono text-xs text-ash first:border-l last:border-r">
          {page}
        </span>
      );
    }

    return (
      <button
        className={`inline-flex h-8 min-w-8 items-center justify-center border-y border-graphite bg-carbon px-2 font-mono text-xs transition-colors duration-150 hover:bg-obsidian hover:text-paper first:border-l last:border-r ${currentPage === page ? "text-acid" : "text-fog"}`}
        onClick={() => onClick(page)}
        type="button"
        aria-current={currentPage === page ? "page" : undefined}
      >
        {page}
      </button>
    );
  },
);

PaginationButton.displayName = "PaginationButton";

const Pagination = React.memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    return (
      <nav className="mt-8 flex justify-center" aria-label="Release pages">
        <div className="flex items-center">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-l border border-graphite bg-carbon text-fog transition-colors duration-150 hover:bg-obsidian hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            type="button"
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers.map((page, idx) => (
            <PaginationButton
              key={
                typeof page === "string" ? `ellipsis-${idx}` : `page-${page}`
              }
              page={page}
              currentPage={currentPage}
              onClick={onPageChange}
            />
          ))}

          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-r border border-l-0 border-graphite bg-carbon text-fog transition-colors duration-150 hover:bg-obsidian hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            type="button"
            aria-label="Next page"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

const EmptyState = ({ searchTerm }: { searchTerm?: string }) => (
  <div className="instrument-card px-6 py-14 text-center">
    <p className="text-lg text-mist">
      {searchTerm
        ? `No releases found matching "${searchTerm}"`
        : "No releases match the current filter criteria."}
    </p>
    <p className="mt-2 text-sm text-ash">
      {searchTerm
        ? "Try a different search term or adjust your filters."
        : "Try enabling more release types in the filter above."}
    </p>
  </div>
);

function SortTabs({
  value,
  onChange,
}: {
  value: "newest" | "oldest";
  onChange: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const movePill = (animate: boolean) => {
      const tab = barRef.current?.querySelector<HTMLButtonElement>(
        `[data-sort="${value}"]`,
      );
      const pill = pillRef.current;

      if (!tab || !pill) return;

      if (!animate) {
        pill.style.transition = "none";
      }
      pill.style.transform = `translateX(${tab.offsetLeft}px)`;
      pill.style.width = `${tab.offsetWidth}px`;
      if (!animate) {
        void pill.offsetWidth;
        pill.style.removeProperty("transition");
      }
    };

    movePill(false);
    const handleResize = () => movePill(false);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value]);

  return (
    <div
      ref={barRef}
      className="t-tabs w-full self-stretch sm:w-auto sm:self-auto"
      role="tablist"
      aria-label="Sort releases"
    >
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
      <button
        className="t-tab text-xs"
        type="button"
        role="tab"
        aria-selected={value === "newest"}
        data-sort="newest"
        onClick={() => value !== "newest" && onChange()}
      >
        Newest first
      </button>
      <button
        className="t-tab text-xs"
        type="button"
        role="tab"
        aria-selected={value === "oldest"}
        data-sort="oldest"
        onClick={() => value !== "oldest" && onChange()}
      >
        Oldest first
      </button>
    </div>
  );
}

export default function FilteredReleases({ releases }: FilteredReleasesProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    showStable: true,
    showCanary: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredReleases = useMemo(() => {
    let filtered = releases.filter((release) => {
      const releaseType = getReleaseType(release);
      const matchesFilter =
        releaseType === "stable" ? filters.showStable : filters.showCanary;

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const releaseName = release.name.toLowerCase();
        const releaseTag = release.tag_name.toLowerCase();

        if (
          releaseName.includes(searchLower) ||
          releaseTag.includes(searchLower)
        ) {
          return matchesFilter;
        }

        try {
          const cleanSearch = searchTerm.trim().replace(/^v/i, "");

          const releaseVersion = semver.coerce(release.tag_name);

          if (releaseVersion) {
            const searchParts = cleanSearch.split(".");

            if (searchParts.length === 1) {
              const range = `${searchParts[0]}.x`;
              if (semver.satisfies(releaseVersion, range)) {
                return matchesFilter;
              }
            } else if (searchParts.length === 2) {
              const range = `${searchParts[0]}.${searchParts[1]}.x`;
              if (semver.satisfies(releaseVersion, range)) {
                return matchesFilter;
              }
            } else {
              const searchVersion = semver.coerce(cleanSearch);
              if (searchVersion && semver.eq(releaseVersion, searchVersion)) {
                return matchesFilter;
              }
            }
          }
        } catch {}

        return false;
      }

      return matchesFilter;
    });

    if (sortOrder === "oldest") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [releases, filters, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredReleases.length / itemsPerPage);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        startTransition(() => {
          setCurrentPage(newPage);
        });
      }
    },
    [totalPages],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          handlePageChange(currentPage + 1);
          break;
        case "ArrowLeft":
          handlePageChange(currentPage - 1);
          break;
        case "Escape":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
      }
    },
    [currentPage, handlePageChange],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const paginatedReleases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReleases.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReleases, currentPage]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredReleases.length);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <ReleaseStats releases={releases} />

      <div className="mb-6 flex flex-col items-stretch gap-3 border-b border-graphite pb-6 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            type="text"
            aria-label="Search releases by version"
            placeholder="Search by version, for example 15.5.4"
            value={searchInput}
            onChange={handleSearchChange}
            className="control-input w-full pl-10 pr-10 text-sm"
          />
          {searchInput !== searchTerm && (
            <FiLoader
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-fog"
              aria-label="Updating search"
            />
          )}
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 self-stretch md:w-auto md:flex-row md:items-center md:self-auto">
          <SortTabs value={sortOrder} onChange={toggleSortOrder} />
          <ReleaseFilter onFilterChange={handleFilterChange} />
        </div>
      </div>

      {filteredReleases.length > 0 && (
        <div className="mb-4 flex items-center justify-between gap-4 text-xs text-ash">
          Showing {startItem}-{endItem} of {filteredReleases.length} releases
          <span className="font-mono uppercase tracking-[0.1em] text-ash">
            page {currentPage} / {totalPages}
          </span>
        </div>
      )}

      <div className="w-full min-h-[400px]">
        {filteredReleases.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <ol
              aria-label="Next.js release notes"
              className={`flex flex-col gap-5 transition-opacity duration-150 ${isPending ? "opacity-60" : "opacity-100"}`}
            >
              {paginatedReleases.map((release, index) => (
                <li key={release.id}>
                  <ReleaseCard
                    release={release}
                    isLatest={currentPage === 1 && index === 0}
                  />
                </li>
              ))}
            </ol>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            <div className="mt-10 border-t border-graphite pt-5 text-center text-xs text-ash">
              <p className="mb-3 font-mono uppercase tracking-[0.12em]">
                Keyboard shortcuts
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <kbd className="rounded border border-graphite bg-carbon px-1.5 py-1 font-mono text-[10px] text-mist">
                    ←
                  </kbd>{" "}
                  Previous
                </span>
                <span className="inline-flex items-center gap-2">
                  <kbd className="rounded border border-graphite bg-carbon px-1.5 py-1 font-mono text-[10px] text-mist">
                    →
                  </kbd>{" "}
                  Next
                </span>
                <span className="inline-flex items-center gap-2">
                  <kbd className="rounded border border-graphite bg-carbon px-1.5 py-1 font-mono text-[10px] text-mist">
                    Esc
                  </kbd>{" "}
                  Scroll to top
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
