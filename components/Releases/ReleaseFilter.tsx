"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    onFilterChange(filters);
  }, []);

  const handleFilterChange = (key: keyof FilterOptions) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter Releases</h3>
      <div className="flex flex-wrap gap-4">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Stable</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={filters.showStable}
              onChange={() => handleFilterChange("showStable")}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Canary</span>
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              checked={filters.showCanary}
              onChange={() => handleFilterChange("showCanary")}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
