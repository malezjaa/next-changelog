"use client";

import { useMemo } from "react";
import type { Release } from "@/utils/api";
import { getReleaseType } from "@/utils/releases";

interface StatsProps {
  releases: Release[];
}

export default function ReleaseStats({ releases }: StatsProps) {
  const stats = useMemo(() => {
    const stableCount = releases.filter(
      (r) => getReleaseType(r) === "stable",
    ).length;
    const canaryCount = releases.filter(
      (r) => getReleaseType(r) === "canary",
    ).length;

    const latestRelease = releases[0];
    const oldestRelease = releases[releases.length - 1];

    return {
      total: releases.length,
      stable: stableCount,
      canary: canaryCount,
      latest: latestRelease?.name || "N/A",
      latestDate: latestRelease?.created_at
        ? new Date(latestRelease.created_at).toLocaleDateString()
        : "N/A",
    };
  }, [releases]);

  return (
    <div className="w-full mb-8">
      <div className="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-dark border border-accent2 overflow-hidden">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Releases</div>
          <div className="stat-value text-primary">{stats.total}</div>
          <div className="stat-desc">In the last year</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Stable Releases</div>
          <div className="stat-value text-success">{stats.stable}</div>
          <div className="stat-desc">Production ready</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Canary Releases</div>
          <div className="stat-value text-warning">{stats.canary}</div>
          <div className="stat-desc">Experimental features</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Latest Release</div>
          <div className="stat-value text-info text-xl lg:text-2xl truncate">{stats.latest}</div>
          <div className="stat-desc truncate">{stats.latestDate}</div>
        </div>
      </div>
    </div>
  );
}
