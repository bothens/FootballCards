// src/components/CardSortAndFilter/CardSortAndFilter.tsx

import React from 'react';
import { SearchInput } from '../Common/SearchInput';
import type { QueryParams } from '../../types/ui/types';

interface CardSortAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterOptions?: { label: string; value: QueryParams['filter'] }[];
  sortOptions?: { label: string; value: QueryParams['sort'] }[];
  onFilterChange?: (filter: QueryParams['filter']) => void;
  onSortChange?: (sort: QueryParams['sort']) => void;
}

export const CardSortAndFilter: React.FC<CardSortAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterOptions = [
    { label: 'Common', value: 'common' },
    { label: 'Rare', value: 'rare' },
    { label: 'Legendary', value: 'legendary' },
  ],
  sortOptions = [
    { label: 'Pris ↑', value: 'price_asc' },
    { label: 'Pris ↓', value: 'price_desc' },
    { label: 'Namn ↑', value: 'name_asc' },
    { label: 'Namn ↓', value: 'name_desc' },
  ],
  onFilterChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      {/* Search */}
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Sök spelare eller lag..."
        className="w-full sm:w-64"
      />

      {/* Filter + Sort */}
      <div className="flex flex-wrap gap-2">
        {/* Filter-knappar */}
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange?.(opt.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-colors"
          >
            {opt.label}
          </button>
        ))}

        {/* Sort-knappar */}
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange?.(opt.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
