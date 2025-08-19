import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from '../helpers/useTranslation';
import styles from './quiz.module.css';
import { useUserSession } from '../helpers/useUserSession';
import { QuizSetup } from '../components/QuizSetup';
import { QuizInProgress } from '../components/QuizInProgress';
import { QuizResults } from '../components/QuizResults';
import { useQuizQuestions } from '../helpers/useQuizQuestions';
import { useCategories } from '../helpers/useCategories';
import { Skeleton } from '../components/Skeleton';
import type { Selectable } from 'kysely';
import type { Categories, QuizQuestions } from '../helpers/schema';

export type QuizState = 'setup' | 'in-progress' | 'results';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const QuizPage = () => {
  const { t } = useTranslation();
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Selectable<Categories> | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizResults, setQuizResults] = useState<{ score: number; total: number; correctAnswers: number; timeTaken: number; answers: Record<number, string>; questions: Selectable<QuizQuestions>[] } | null>(null);

  const { mutate: manageSession, data: sessionData } = useUserSession();
  const { data: categories, isFetching: isFetchingCategories } = useCategories();
  const { data: questions, isFetching: isFetchingQuestions, error: questionsError } = useQuizQuestions({
    categoryId: selectedCategory?.id,
    difficulty: selectedDifficulty ?? undefined,
  });

  useEffect(() => {
    const storedSessionId = localStorage.getItem('quizSessionId');
    manageSession({ sessionId: storedSessionId ?? undefined });
  }, [manageSession]);

  useEffect(() => {
    if (sessionData?.sessionId) {
      setSessionId(sessionData.sessionId);
      localStorage.setItem('quizSessionId', sessionData.sessionId);
    }
  }, [sessionData]);

  const handleStartQuiz = useCallback((category: Selectable<Categories>, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    setQuizState('in-progress');
  }, []);

  const handleQuizComplete = useCallback((finalResults: { score: number; total: number; correctAnswers: number; timeTaken: number; answers: Record<number, string>; questions: Selectable<QuizQuestions>[] }) => {
    setQuizResults(finalResults);
    setQuizState('results');
  }, []);

  const handleRetry = useCallback(() => {
    setQuizResults(null);
    setQuizState('in-progress');
  }, []);

  const handleNewQuiz = useCallback(() => {
    setQuizResults(null);
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setQuizState('setup');
  }, []);

  const renderContent = () => {
    if (!sessionId || isFetchingCategories) {
      return (
        <div className={styles.loadingContainer}>
          <Skeleton style={{ height: '4rem', width: '50%' }} />
          <Skeleton style={{ height: '2rem', width: '80%', marginTop: 'var(--spacing-4)' }} />
          <Skeleton style={{ height: '10rem', width: '100%', marginTop: 'var(--spacing-2)' }} />
        </div>
      );
    }

    switch (quizState) {
      case 'setup':
        return <QuizSetup categories={categories || []} onStartQuiz={handleStartQuiz} />;
      case 'in-progress':
        if (isFetchingQuestions) {
          return (
            <div className={styles.loadingContainer}>
              <Skeleton style={{ height: '4rem', width: '50%' }} />
              <Skeleton style={{ height: '2rem', width: '80%', marginTop: 'var(--spacing-4)' }} />
              <Skeleton style={{ height: '10rem', width: '100%', marginTop: 'var(--spacing-2)' }} />
            </div>
          );
        }
        if (questionsError) {
          return <div className={styles.error}>{t('quiz.errorLoadingQuestions')}</div>;
        }
        if (!questions || questions.length === 0) {
          return (
            <div className={styles.error}>
              <p>{t('quiz.noQuestionsAvailable')}</p>
              <button onClick={handleNewQuiz} className={styles.backButton}>{t('quiz.backToSetup')}</button>
            </div>
          );
        }
        return (
          <QuizInProgress
            questions={questions}
            onQuizComplete={handleQuizComplete}
            categoryName={selectedCategory?.name || 'Quiz'}
          />
        );
      case 'results':
        if (!quizResults || !selectedCategory || !selectedDifficulty || !sessionId) {
          return <div className={styles.error}>{t('quiz.errorDisplayingResults')}</div>;
        }
        return (
          <QuizResults
            results={quizResults}
            category={selectedCategory}
            difficulty={selectedDifficulty}
            sessionId={sessionId}
            onRetry={handleRetry}
            onNewQuiz={handleNewQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('quiz.title')}</title>
        <meta name="description" content={t('quiz.description')} />
      </Helmet>
      <main className={styles.quizPage}>
        <div className={styles.container}>
          {renderContent()}
        </div>
      </main>
    </>
  );
};

export default QuizPage;