import React from 'react';
import { Search, Tag, X } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Skeleton } from './Skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';
import { Badge } from './Badge';
import type { Selectable } from 'kysely';
import type { Categories } from '../helpers/schema';
import styles from './CommandFilters.module.css';

interface CommandFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Selectable<Categories>[];
  isFetchingCategories: boolean;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  categoriesError: unknown;
}

export const CommandFilters = ({
  searchQuery,
  setSearchQuery,
  categories,
  isFetchingCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  allTags,
  selectedTags,
  setSelectedTags,
  categoriesError,
}: CommandFiltersProps) => {
  const handleTagToggle = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={20} />
        <Input
          type="search"
          placeholder="Search commands by name, syntax, or description..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterControls}>
        <div className={styles.categoryFilters}>
          <span className={styles.filterLabel}>Category:</span>
          <div className={styles.categoryPills}>
            <Button
              variant={selectedCategoryId === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategoryId(null)}
              className={styles.categoryPill}
            >
              All
            </Button>
            {isFetchingCategories &&
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`${styles.categoryPill} ${styles.pillSkeleton}`}
                />
              ))}
                        {!!categoriesError && (
              <span className={styles.errorText}>Failed to load categories.</span>
            )}
            {!isFetchingCategories &&
              categories.map(category => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategoryId === category.id ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={styles.categoryPill}
                >
                  {category.name}
                </Button>
              ))}
          </div>
        </div>

        <div className={styles.tagFilter}>
          <Select onValueChange={handleTagToggle} value="">
            <SelectTrigger className={styles.tagSelectTrigger}>
              <Tag size={16} />
              <SelectValue placeholder="Filter by tags" />
            </SelectTrigger>
            <SelectContent>
              {allTags.length > 0 ? (
                allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    <div className={styles.tagSelectItem}>
                      <span>{tag}</span>
                      {selectedTags.includes(tag) && (
                        <div className={styles.tagSelectedIndicator} />
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-tags" disabled>
                  No tags available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className={styles.activeTags}>
          {selectedTags.map(tag => (
            <Badge key={tag} className={styles.activeTagBadge}>
              {tag}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleTagToggle(tag)}
                className={styles.removeTagButton}
                aria-label={`Remove ${tag} filter`}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};