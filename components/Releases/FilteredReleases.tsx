"use client";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

const EmptyState = () => (
  <div className="text-center py-8">
    <p className="text-lg text-gray-400">
      No releases match the current filter criteria.
    </p>
    <p className="text-sm text-gray-500 mt-2">
      Try enabling more release types in the filter above.
    </p>
  </div>
);

export default function FilteredReleases({ releases }: FilteredReleasesProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    showStable: true,
    showCanary: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredReleases = useMemo(() => {
    return releases.filter((release) => {
      const releaseType = getReleaseType(release);
      return releaseType === "stable" ? filters.showStable : filters.showCanary;
    });
  }, [releases, filters]);

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ReleaseStats releases={releases} />

      <ReleaseFilter onFilterChange={handleFilterChange} />

      {filteredReleases.length > 0 && (
        <div className="text-sm text-gray-400 mb-4">
          Showing {startItem}-{endItem} of {filteredReleases.length} releases
        </div>
      )}

      <div className="w-full min-h-[400px]">
        {filteredReleases.length === 0 ? (
          <EmptyState />
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
          </>
        )}
      </div>
    </div>
  );
}
