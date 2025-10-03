"use client";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiSearch,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as semver from "semver";
import ReleaseStats from "@/components/ReleaseStats";
import type { Release } from "@/utils/api";
import ReleaseFilter, { type FilterOptions } from "./ReleaseFilter";
import "./markdown.css";
import { generatePageNumbers } from "@/utils/pagination";
import { formatCommitHash, getReleaseType } from "@/utils/releases";

interface FilteredReleasesProps {
  releases: Release[];
}

const transformTextWithLinks = (
  text: string,
  linkPattern: RegExp,
  getLinkProps: (match: string) => { href: string; text: string },
): React.ReactNode => {
  const words = text.split(" ");

  return words.reduce<React.ReactNode>((acc, word, idx) => {
    const match = word.match(linkPattern);
    let element: React.ReactNode = word;

    if (match) {
      const { href } = getLinkProps(word);
      const hasComma = word.endsWith(",");
      const cleanWord = hasComma ? word.slice(0, -1) : word;

      element = (
        <React.Fragment key={cleanWord}>
          <Link href={href} rel="nofollow" target="_blank">
            <span className="text-blue-500">{hasComma ? cleanWord : word}</span>
          </Link>
          {hasComma && ","}
        </React.Fragment>
      );
    }

    return idx === 0 ? (
      element
    ) : (
      <>
        {acc} {element}
      </>
    );
  }, null);
};

const CustomListItem = ({ children }: any) => {
  if (
    !Array.isArray(children) ||
    children.length === 0 ||
    typeof children[0] !== "string"
  ) {
    return <li>{children}</li>;
  }

  const text = children[0];
  const transformed = transformTextWithLinks(text, /#\d+/, (word) => ({
    href: `https://github.com/vercel/next.js/pull/${word.replace(/[()#]/g, "")}`,
    text: word,
  }));

  return <li>{transformed}</li>;
};

const CustomParagraph = ({ children }: any) => {
  if (
    !Array.isArray(children) ||
    children.length === 0 ||
    typeof children[0] !== "string"
  ) {
    return <p>{children}</p>;
  }

  const text = children[0];
  const transformed = transformTextWithLinks(text, /@\w+/, (word) => ({
    href: `https://github.com/${word.replace(/[@(),]/g, "")}`,
    text: word,
  }));

  return <p>{transformed}</p>;
};

const ReleaseCard = ({
  release,
  isLatest,
}: {
  release: Release;
  isLatest?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const releaseType = getReleaseType(release);
  const badgeClass =
    releaseType === "stable" ? "badge-success" : "badge-warning";

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
    <div className="flex flex-col justify-center w-full h-full p-4 border-accent2 border rounded-lg bg-dark hover:border-gray-600 transition-all duration-200">
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold mb-2">{release.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {isLatest && (
              <span className="badge badge-sm badge-primary animate-pulse">
                🌟 LATEST
              </span>
            )}
            <span className={`badge badge-sm ${badgeClass}`}>
              {releaseType.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4 flex-shrink-0">
          <button
            onClick={copyToClipboard}
            className="btn btn-ghost btn-xs"
            aria-label="Copy release notes"
            title="Copy release notes"
            type="button"
          >
            {copied ? (
              <FiCheck className="w-4 h-4 text-green-500" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
          </button>
          <Link
            href={release.html_url}
            rel="nofollow"
            target="_blank"
            aria-label="Go to release"
            title="Go to release"
          >
            <FiExternalLink className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
          </Link>
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center mt-3">
        <Image
          src={release.author.avatar_url}
          alt="author image"
          className="w-7 h-7 rounded-full mr-2"
          width={100}
          height={100}
        />
        <p>
          <b>{release.author.login}</b> released this{" "}
          {moment(release.created_at).fromNow()}
        </p>
        <p className="ml-2 text-blue-500">
          <Link
            href={`https://github.com/vercel/next.js/commit/${release.target_commitish}`}
            rel="nofollow"
            target="_blank"
          >
            {formatCommitHash(release.target_commitish)}
          </Link>
        </p>
      </div>

      <div className="divider"></div>

      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            li: CustomListItem,
            p: CustomParagraph,
          }}
        >
          {release.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const PaginationButton = ({
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
      <span className="join-item btn btn-sm !bg-dark btn-disabled !border-opacity-100">
        {page}
      </span>
    );
  }

  return (
    <button
      className={`join-item btn btn-sm !bg-dark ${currentPage === page ? "text-primary" : ""}`}
      onClick={() => onClick(page)}
      type="button"
    >
      {page}
    </button>
  );
};

const Pagination = ({
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
    <div className="flex justify-center mt-8">
      <div className="join">
        <button
          className="join-item btn btn-sm !bg-dark"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          type="button"
        >
          «
        </button>

        {pageNumbers.map((page, idx) => (
          <PaginationButton
            key={typeof page === "string" ? `ellipsis-${idx}` : `page-${page}`}
            page={page}
            currentPage={currentPage}
            onClick={onPageChange}
          />
        ))}

        <button
          className="join-item btn btn-sm !bg-dark"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          type="button"
        >
          »
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ searchTerm }: { searchTerm?: string }) => (
  <div className="text-center py-8">
    <p className="text-lg text-gray-400">
      {searchTerm
        ? `No releases found matching "${searchTerm}"`
        : "No releases match the current filter criteria."}
    </p>
    <p className="text-sm text-gray-500 mt-2">
      {searchTerm
        ? "Try a different search term or adjust your filters."
        : "Try enabling more release types in the filter above."}
    </p>
  </div>
);

export default function FilteredReleases({ releases }: FilteredReleasesProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    showStable: true,
    showCanary: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
          }
          break;
        case "ArrowLeft":
          if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
          break;
        case "Escape":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage]);

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
        } catch (error) {}

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

  const paginatedReleases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReleases.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReleases, currentPage]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredReleases.length);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ReleaseStats releases={releases} />

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by version (e.g. 13, 13.4, v13.4.6)..."
              value={searchInput}
              onChange={handleSearchChange}
              className="input input-bordered input-sm w-full pl-9 bg-dark focus:outline-none focus:border-primary h-8"
            />
            {searchInput !== searchTerm && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner loading-xs"></span>
            )}
          </div>
          <button
            onClick={toggleSortOrder}
            className="btn btn-primary btn-sm gap-2 flex-shrink-0 hover:btn-primary"
            title="Toggle sort order"
            type="button"
          >
            {sortOrder === "newest" ? (
              <>
                <FiArrowDown className="w-4 h-4" />
                Newest First
              </>
            ) : (
              <>
                <FiArrowUp className="w-4 h-4" />
                Oldest First
              </>
            )}
          </button>
        </div>
      </div>

      <ReleaseFilter onFilterChange={handleFilterChange} />

      {filteredReleases.length > 0 && (
        <div className="text-sm text-gray-400 mb-4">
          Showing {startItem}-{endItem} of {filteredReleases.length} releases
        </div>
      )}

      <div className="w-full min-h-[400px]">
        {filteredReleases.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {paginatedReleases.map((release, index) => (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  isLatest={currentPage === 1 && index === 0}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            <div className="mt-8 text-center text-sm text-gray-500">
              <p className="mb-2">⌨️ Keyboard Shortcuts:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <kbd className="kbd kbd-sm">←</kbd> Previous
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="kbd kbd-sm">→</kbd> Next
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="kbd kbd-sm">Esc</kbd> Scroll to Top
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
