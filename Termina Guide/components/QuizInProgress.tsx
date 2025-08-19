import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../helpers/useTranslation';
import type { Selectable } from 'kysely';
import type { QuizQuestions } from '../helpers/schema';
import { Button } from './Button';
import { Progress } from './Progress';
import { QuizQuestion } from './QuizQuestion';
import styles from './QuizInProgress.module.css';
import { TimerIcon } from 'lucide-react';

interface QuizInProgressProps {
  questions: Selectable<QuizQuestions>[];
  categoryName: string;
  onQuizComplete: (results: { score: number; total: number; correctAnswers: number; timeTaken: number; answers: Record<number, string>; questions: Selectable<QuizQuestions>[] }) => void;
}

const QUIZ_DURATION_SECONDS = 10 * 60; // 10 minutes

export const QuizInProgress = ({ questions, categoryName, onQuizComplete }: QuizInProgressProps) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);

  const shuffledQuestions = useMemo(() => {
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswersCount = 0;
    shuffledQuestions.forEach(q => {
      if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctAnswersCount++;
      }
    });
    const total = shuffledQuestions.length;
    const score = total > 0 ? Math.round((correctAnswersCount / total) * 100) : 0;
    const timeTaken = QUIZ_DURATION_SECONDS - timeLeft;

    onQuizComplete({
      score,
      total,
      correctAnswers: correctAnswersCount,
      timeTaken,
      answers,
      questions: shuffledQuestions,
    });
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={styles.quizContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('quiz.categoryQuizTitle', { categoryName })}</h1>
        <div className={styles.timer}>
          <TimerIcon size={16} />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>
      <div className={styles.progressContainer}>
        <span>{t('quiz.questionProgress', { current: currentQuestionIndex + 1, total: shuffledQuestions.length })}</span>
        <Progress value={progress} />
      </div>

      <div className={styles.questionWrapper}>
        <QuizQuestion
          question={currentQuestion}
          userAnswer={answers[currentQuestion.id] || ''}
          onAnswerChange={handleAnswerChange}
        />
      </div>

      <div className={styles.navigation}>
        {currentQuestionIndex < shuffledQuestions.length - 1 ? (
          <Button onClick={handleNext} size="lg" disabled={!answers[currentQuestion.id]}>
            {t('button.nextQuestion')}
          </Button>
        ) : (
          <Button onClick={handleSubmit} size="lg" variant="primary" disabled={!answers[currentQuestion.id]}>
            {t('quiz.submitQuiz')}
          </Button>
        )}
      </div>
    </div>
  );
};