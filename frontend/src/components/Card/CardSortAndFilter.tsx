import React from 'react';
import { SearchInput } from '../Common/SearchInput';
import type { QueryParams } from '../../types/ui/types';
import { useI18n } from '../../hooks/useI18n';

interface CardSortAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterOptions?: { label: string; value: QueryParams['filter'] }[];
  sortOptions?: { label: string; value: QueryParams['sort'] }[];
  onFilterChange?: (filter: QueryParams['filter']) => void;
  onSortChange?: (sort: QueryParams['sort']) => void;
  onReset?: () => void;  // Callback for reset
}

export const CardSortAndFilter: React.FC<CardSortAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterOptions = [
    { label: 'Common', value: 'common' },
    { label: 'Rare', value: 'rare' },
    { label: 'Epic', value: 'epic' },
    { label: 'Legendary', value: 'legendary' },
    { label: 'Skiller', value: 'skiller' },
    { label: 'Historical Moment', value: 'historical_moment' },
  ],
  sortOptions = [
    { label: 'Pris asc', value: 'price_asc' },
    { label: 'Pris desc', value: 'price_desc' },
    { label: 'Namn asc', value: 'name_asc' },
    { label: 'Namn desc', value: 'name_desc' },
  ],
  onFilterChange,
  onSortChange,
  onReset,  // Get reset callback
}) => {
  const { t } = useI18n();

  const localizedFilterOptions = filterOptions.map((opt) => {
    const label =
      opt.value === 'common'
        ? t('common')
        : opt.value === 'rare'
        ? t('rare')
        : opt.value === 'epic'
        ? t('epic')
        : opt.value === 'legendary'
        ? t('legendary')
        : opt.value === 'skiller'
        ? t('skiller')
        : opt.value === 'historical_moment'
        ? t('historicalMoment')
        : opt.label;
    return { ...opt, label };
  });

  const localizedSortOptions = sortOptions.map((opt) => {
    const label =
      opt.value === 'price_asc'
        ? t('priceAsc')
        : opt.value === 'price_desc'
        ? t('priceDesc')
        : opt.value === 'name_asc'
        ? t('nameAsc')
        : opt.value === 'name_desc'
        ? t('nameDesc')
        : opt.label;
    return { ...opt, label };
  });

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      {/* Search */}
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={t('searchPlaceholder')}
        className="w-full sm:w-64"
      />

      {/* Filter + Sort */}
      <div className="flex flex-wrap gap-4">
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-xs font-bold uppercase text-zinc-500">
            {t('filterBy')}
          </label>
          <select
            id="filter"
            onChange={(e) => onFilterChange?.(e.target.value as QueryParams['filter'])}
            defaultValue=""
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-bold focus:outline-none"
          >
            <option value="" disabled>
              {t('chooseFilter')}
            </option>
            {localizedFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-bold uppercase text-zinc-500">
            {t('sortBy')}
          </label>
          <select
            id="sort"
            onChange={(e) => onSortChange?.(e.target.value as QueryParams['sort'])}
            defaultValue=""
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-bold focus:outline-none"
          >
            <option value="" disabled>
              {t('chooseSort')}
            </option>
            {localizedSortOptions.map((opt) => (
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
            {t('reset')}
          </button>
        </div>
      </div>
    </div>
  );
};
