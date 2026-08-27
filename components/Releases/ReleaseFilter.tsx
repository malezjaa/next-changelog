"use client";

import { useState } from "react";

export interface FilterOptions {
  showStable: boolean;
  showCanary: boolean;
}

interface ReleaseFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function ReleaseFilter({ onFilterChange }: ReleaseFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    showStable: true,
    showCanary: false,
  });
  const [interacted, setInteracted] = useState<
    Record<keyof FilterOptions, boolean>
  >({
    showStable: false,
    showCanary: false,
  });

  const handleFilterChange = (key: keyof FilterOptions) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    setInteracted((previous) => ({ ...previous, [key]: true }));
    onFilterChange(newFilters);
  };

  return (
    <fieldset className="filter-group w-full sm:w-auto" aria-label="Filter releases">
      <legend className="sr-only">Filter releases</legend>
      <FilterToggle
        label="Stable"
        checked={filters.showStable}
        interacted={interacted.showStable}
        onChange={() => handleFilterChange("showStable")}
      />
      <FilterToggle
        label="Canary"
        checked={filters.showCanary}
        interacted={interacted.showCanary}
        onChange={() => handleFilterChange("showCanary")}
      />
    </fieldset>
  );
}

function FilterToggle({
  label,
  checked,
  interacted,
  onChange,
}: {
  label: string;
  checked: boolean;
  interacted: boolean;
  onChange: () => void;
}) {
  return (
    <button
      className={`filter-option flex-1 justify-center sm:flex-none sm:justify-start${checked ? " is-active" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`Show ${label.toLowerCase()} releases`}
      data-on={checked}
      onClick={onChange}
    >
      <span
        className={`t-toggle${interacted ? " is-init" : ""}`}
        aria-hidden="true"
        data-on={checked}
      >
        <span className="t-toggle-thumb" />
      </span>
      <span>{label}</span>
    </button>
  );
}
