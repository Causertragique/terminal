import React, { useState } from 'react';
import { useTranslation } from '../helpers/useTranslation';
import type { Selectable } from 'kysely';
import type { Categories } from '../helpers/schema';
import type { Difficulty } from '../pages/quiz';
import { Button } from './Button';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import styles from './QuizSetup.module.css';
import { BookOpen, BarChart, Zap } from 'lucide-react';

interface QuizSetupProps {
  categories: Selectable<Categories>[];
  onStartQuiz: (category: Selectable<Categories>, difficulty: Difficulty) => void;
}

export const QuizSetup = ({ categories, onStartQuiz }: QuizSetupProps) => {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleStart = () => {
    if (selectedCategoryId && selectedDifficulty) {
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      if (selectedCategory) {
        onStartQuiz(selectedCategory, selectedDifficulty);
      }
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className={styles.setupContainer}>
      <h1 className={styles.title}>{t('quiz.title')}</h1>
      <p className={styles.description}>
        {t('quiz.setupDescription')}
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('quiz.chooseCategory')}</h2>
        <div className={styles.categoryGrid}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryCard} ${selectedCategoryId === category.id ? styles.selected : ''}`}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryDescription}>{category.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('quiz.selectDifficulty')}</h2>
        <ToggleGroup
          type="single"
          value={selectedDifficulty ?? ''}
          onValueChange={(value) => {
            if (value) setSelectedDifficulty(value as Difficulty);
          }}
          className={styles.difficultyGroup}
        >
          <ToggleGroupItem value="beginner" aria-label={t('practice.beginner')}>
            <BookOpen size={16} /> {t('practice.beginner')}
          </ToggleGroupItem>
          <ToggleGroupItem value="intermediate" aria-label={t('practice.intermediate')}>
            <BarChart size={16} /> {t('practice.intermediate')}
          </ToggleGroupItem>
          <ToggleGroupItem value="advanced" aria-label={t('practice.advanced')}>
            <Zap size={16} /> {t('practice.advanced')}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Button
        onClick={handleStart}
        disabled={!selectedCategoryId || !selectedDifficulty}
        size="lg"
        className={styles.startButton}
      >
        {t('button.startQuiz')}
      </Button>
    </div>
  );
};