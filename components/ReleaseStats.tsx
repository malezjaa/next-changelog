"use client";

import { useMemo } from "react";
import NumberFlow from "@number-flow/react";
import { FiActivity, FiAlertTriangle, FiCheck, FiClock } from "react-icons/fi";
import type { Release } from "@/utils/api";
import { getReleaseType } from "@/utils/releases";

interface StatsProps {
  releases: Release[];
}

export default function ReleaseStats({ releases }: StatsProps) {
  const stats = useMemo(() => {
    const stableCount = releases.filter(
      (release) => getReleaseType(release) === "stable",
    ).length;
    const canaryCount = releases.filter(
      (release) => getReleaseType(release) === "canary",
    ).length;
    const latestRelease = releases[0];

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

  const statItems = [
    {
      label: "Total releases",
      value: <NumberFlow className="release-stat-number" value={stats.total} />,
      detail: "past 12 months",
      icon: FiActivity,
      color: "text-mist",
    },
    {
      label: "Stable channel",
      value: (
        <NumberFlow className="release-stat-number" value={stats.stable} />
      ),
      detail: "production ready",
      icon: FiCheck,
      color: "text-success",
    },
    {
      label: "Canary channel",
      value: (
        <NumberFlow className="release-stat-number" value={stats.canary} />
      ),
      detail: "early access builds",
      icon: FiAlertTriangle,
      color: "text-coral",
    },
    {
      label: "Latest release",
      value: stats.latest,
      detail: stats.latestDate,
      icon: FiClock,
      color: "text-link",
    },
  ];

  return (
    <section className="mb-10 w-full" aria-labelledby="telemetry-heading">
      <div className="mb-3 flex items-center justify-between">
        <h3
          id="telemetry-heading"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-fog"
        >
          release telemetry
        </h3>
        <span className="font-mono text-[11px] text-ash">source / GitHub</span>
      </div>
      <div className="instrument-card grid grid-cols-2 overflow-hidden md:grid-cols-4">
        {statItems.map(({ label, value, detail, icon: Icon, color }) => (
          <div
            key={label}
            className="border-b border-graphite p-4 last:border-b-0 sm:p-5 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-fog">{label}</p>
              <Icon
                className={`h-4 w-4 shrink-0 ${color}`}
                aria-hidden="true"
              />
            </div>
            <p className="mt-5 truncate text-2xl font-[510] tracking-[-0.04em] text-paper sm:text-3xl">
              {typeof value === "string" ? value : value}
            </p>
            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-ash">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
