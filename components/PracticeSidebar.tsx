import React from 'react';
import { Selectable } from 'kysely';
import { useTranslation } from '../helpers/useTranslation';
import { Categories, PracticeExercises } from '../helpers/schema';
import { useCategories } from '../helpers/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';
import { Progress } from './Progress';
import { Skeleton } from './Skeleton';
import { CheckCircle2, Circle } from 'lucide-react';
import styles from './PracticeSidebar.module.css';

interface PracticeSidebarProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (level: string) => void;
  exercises: Selectable<PracticeExercises>[];
  isLoading: boolean;
  selectedExerciseId: number | null;
  onSelectExercise: (id: number) => void;
  completedExercises: Set<number>;
  progress: number;
  className?: string;
}

export const PracticeSidebar = ({
  selectedCategoryId,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  exercises,
  isLoading,
  selectedExerciseId,
  onSelectExercise,
  completedExercises,
  progress,
  className,
}: PracticeSidebarProps) => {
  const { t } = useTranslation();
  const { data: categories, isFetching: isFetchingCategories } =
    useCategories();

  return (
    <aside className={`${styles.sidebar} ${className || ''}`}>
      <div className={styles.controls}>
        <div className={styles.selectGroup}>
          <label htmlFor="category-select">{t('practice.categoryLabel')}</label>
          {isFetchingCategories ? (
            <Skeleton style={{ height: '2.5rem' }} />
          ) : (
            <Select
              value={selectedCategoryId?.toString() || ''}
              onValueChange={value => onSelectCategory(Number(value))}
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder={t('practice.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className={styles.selectGroup}>
          <label htmlFor="difficulty-select">{t('practice.difficultyLabel')}</label>
          <Select
            value={selectedDifficulty}
            onValueChange={onSelectDifficulty}
            disabled={!selectedCategoryId}
          >
            <SelectTrigger id="difficulty-select">
              <SelectValue placeholder={t('practice.difficultyPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('practice.allLevels')}</SelectItem>
              <SelectItem value="beginner">{t('practice.beginner')}</SelectItem>
              <SelectItem value="intermediate">{t('practice.intermediate')}</SelectItem>
              <SelectItem value="advanced">{t('practice.advanced')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span>{t('practice.progress')}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className={styles.exerciseListContainer}>
        <h3 className={styles.listTitle}>{t('practice.exercises')}</h3>
        <ul className={styles.exerciseList}>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className={styles.skeletonItem}>
                <Skeleton style={{ height: '1.25rem', width: '1.25rem', borderRadius: 'var(--radius-full)' }} />
                <Skeleton style={{ height: '1rem', flex: 1 }} />
              </li>
            ))
          ) : (
            exercises.map(exercise => (
              <li
                key={exercise.id}
                className={`${styles.exerciseItem} ${
                  selectedExerciseId === exercise.id ? styles.selected : ''
                }`}
                onClick={() => onSelectExercise(exercise.id)}
              >
                {completedExercises.has(exercise.id) ? (
                  <CheckCircle2 className={styles.completedIcon} />
                ) : (
                  <Circle className={styles.todoIcon} />
                )}
                <span className={styles.exerciseTitle}>{exercise.title}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
};