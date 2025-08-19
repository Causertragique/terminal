import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from '../helpers/useTranslation';
import { PracticeSidebar } from '../components/PracticeSidebar';
import { ExerciseDetails } from '../components/ExerciseDetails';
import { FakeTerminal } from '../components/FakeTerminal';
import { usePracticeExercises } from '../helpers/usePracticeExercises';
import { useSession } from '../helpers/useSession';
import { usePracticeProgress } from '../helpers/usePracticeProgress';
import { Selectable } from 'kysely';
import { PracticeExercises } from '../helpers/schema';
import styles from './practice.module.css';
import { Skeleton } from '../components/Skeleton';

export default function PracticePage() {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null,
  );

  const { sessionId } = useSession();
  const { mutate: updateUserProgress } = usePracticeProgress();

  const {
    data: exercises,
    isFetching: isFetchingExercises,
    error: exercisesError,
  } = usePracticeExercises({
    categoryId: selectedCategoryId ?? undefined,
    difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
  });

  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    // When exercises load, select the first one if none is selected
    if (exercises && exercises.length > 0 && selectedExerciseId === null) {
      setSelectedExerciseId(exercises[0].id);
    }
    // If exercises are empty (e.g., category changed), reset selection
    if (exercises && exercises.length === 0) {
      setSelectedExerciseId(null);
    }
  }, [exercises, selectedExerciseId]);

  const handleSelectExercise = (exerciseId: number) => {
    setSelectedExerciseId(exerciseId);
  };

  const handleExerciseComplete = (exerciseId: number) => {
    if (!sessionId) {
      console.error('Session ID not available to record progress.');
      return;
    }
    console.log(`Exercise ${exerciseId} completed!`);
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
    updateUserProgress({
      sessionId,
      exerciseId,
      completed: true,
      attempts: 1, // This could be tracked more accurately in a real scenario
    });

    // Move to the next exercise
    const currentIndex = exercises?.findIndex(e => e.id === exerciseId);
    if (
      exercises &&
      currentIndex !== undefined &&
      currentIndex < exercises.length - 1
    ) {
      setSelectedExerciseId(exercises[currentIndex + 1].id);
    }
  };

  const currentExercise =
    exercises?.find(e => e.id === selectedExerciseId) || null;

  const progress =
    exercises && exercises.length > 0
      ? (completedExercises.size / exercises.length) * 100
      : 0;

  const renderContent = () => {
    if (!selectedCategoryId) {
      return (
        <div className={styles.placeholder}>
          <h2>{t('practice.welcomeTitle')}</h2>
          <p>{t('practice.welcomeDescription')}</p>
        </div>
      );
    }

    if (isFetchingExercises) {
      return (
        <div className={styles.loadingContainer}>
          <Skeleton style={{ height: '10rem', marginBottom: 'var(--spacing-8)' }} />
          <Skeleton style={{ height: '20rem' }} />
        </div>
      );
    }

    if (exercisesError) {
      return (
        <div className={styles.placeholder}>
          <h2>{t('practice.errorTitle')}</h2>
          <p>{t('practice.errorDescription')}</p>
        </div>
      );
    }

    if (!currentExercise) {
      return (
        <div className={styles.placeholder}>
          <h2>{t('practice.noExercisesTitle')}</h2>
          <p>{t('practice.noExercisesDescription')}</p>
        </div>
      );
    }

    return (
      <>
        <ExerciseDetails exercise={currentExercise} />
        <FakeTerminal
          key={currentExercise.id}
          exercise={currentExercise}
          onCommandSuccess={() => handleExerciseComplete(currentExercise.id)}
        />
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>{t('practice.title')} - {t('home.title')}</title>
        <meta
          name="description"
          content={t('practice.description')}
        />
      </Helmet>
      <div className={styles.pageLayout}>
        <PracticeSidebar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={id => {
            setSelectedCategoryId(id);
            setSelectedExerciseId(null); // Reset exercise on category change
          }}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={level => {
            setSelectedDifficulty(level);
            setSelectedExerciseId(null); // Reset exercise on difficulty change
          }}
          exercises={exercises || []}
          isLoading={isFetchingExercises}
          selectedExerciseId={selectedExerciseId}
          onSelectExercise={handleSelectExercise}
          completedExercises={completedExercises}
          progress={progress}
        />
        <main className={styles.mainContent}>{renderContent()}</main>
      </div>
    </>
  );
}