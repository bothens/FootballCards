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
  onReset?: () => void;  // Callback för reset
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
  onReset,  // Get reset callback
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      {/* Search */}
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Sök spelare ..."
        className="w-full sm:w-64"
      />

      {/* Filter + Sort */}
      <div className="flex flex-wrap gap-4">
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-xs font-bold uppercase text-zinc-500">
            {filterOptions.length ? 'Filter' : 'Välj Filter'}
          </label>
          <select
            id="filter"
            onChange={(e) => onFilterChange?.(e.target.value as QueryParams['filter'])}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-bold focus:outline-none"
          >
            <option value="" disabled selected>
              Välj Filter
            </option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-bold uppercase text-zinc-500">
            {sortOptions.length ? 'Sort' : 'Välj Sortering'}
          </label>
          <select
            id="sort"
            onChange={(e) => onSortChange?.(e.target.value as QueryParams['sort'])}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-bold focus:outline-none"
          >
            <option value="" disabled selected>
              Välj Sortering
            </option>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-xs font-bold uppercase rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
