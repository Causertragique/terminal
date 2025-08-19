import React, { useEffect, useState } from 'react';
import { useTranslation } from '../helpers/useTranslation';
import type { Selectable } from 'kysely';
import type { Categories, QuizQuestions } from '../helpers/schema';
import { useQuizResults } from '../helpers/useQuizResults';
import { Button } from './Button';
import { Badge } from './Badge';
import { Certificate } from './Certificate';
import { Dialog, DialogContent, DialogTrigger } from './Dialog';
import styles from './QuizResults.module.css';
import { CheckCircle, XCircle, Award } from 'lucide-react';

interface QuizResultsProps {
  results: {
    score: number;
    total: number;
    correctAnswers: number;
    timeTaken: number;
    answers: Record<number, string>;
    questions: Selectable<QuizQuestions>[];
  };
  category: Selectable<Categories>;
  difficulty: string;
  sessionId: string;
  onRetry: () => void;
  onNewQuiz: () => void;
}

const PASS_THRESHOLD = 70;

export const QuizResults = ({ results, category, difficulty, sessionId, onRetry, onNewQuiz }: QuizResultsProps) => {
  const { t } = useTranslation();
  const { mutate: submitResults, isPending } = useQuizResults();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const passed = results.score >= PASS_THRESHOLD;

  useEffect(() => {
    if (!isSubmitted) {
      submitResults({
        sessionId,
        categoryId: category.id,
        difficulty,
        score: results.score,
        totalQuestions: results.total,
        passed,
      });
      setIsSubmitted(true);
    }
  }, [submitResults, isSubmitted, sessionId, category.id, difficulty, results, passed]);

  return (
    <div className={styles.resultsContainer}>
      <div className={`${styles.summary} ${passed ? styles.passed : styles.failed}`}>
        {passed ? <CheckCircle size={48} className={styles.icon} /> : <XCircle size={48} className={styles.icon} />}
        <h1 className={styles.title}>{t('quiz.quizComplete')}</h1>
        <p className={styles.statusText}>{passed ? t('quiz.congratulationsPassed') : t('quiz.didNotPass')}</p>
        <div className={styles.scoreCircle}>
          <span className={styles.score}>{results.score}</span>
          <span className={styles.scoreUnit}>%</span>
        </div>
        <p className={styles.scoreDetails}>
          {t('quiz.scoreDetails', { correct: results.correctAnswers, total: results.total })}
        </p>
      </div>

      <div className={styles.actions}>
        <Button onClick={onRetry} variant="outline" size="lg">{t('quiz.retryQuiz')}</Button>
        <Button onClick={onNewQuiz} variant="secondary" size="lg">{t('quiz.chooseNewQuiz')}</Button>
        {passed && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg"><Award size={16} /> {t('quiz.viewCertificate')}</Button>
            </DialogTrigger>
            <DialogContent className={styles.certificateDialog}>
              <Certificate
                categoryName={category.name}
                difficulty={difficulty}
                sessionId={sessionId}
                date={new Date()}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className={styles.reviewSection}>
        <h2 className={styles.reviewTitle}>{t('quiz.reviewAnswers')}</h2>
        {results.questions.map((q, index) => {
          const userAnswer = results.answers[q.id] || 'Not answered';
          const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
          return (
            <div key={q.id} className={styles.reviewItem}>
              <div className={styles.reviewQuestion}>
                <span className={styles.questionNumber}>{index + 1}.</span>
                <p>{q.question}</p>
                {isCorrect ? <CheckCircle className={styles.correctIcon} /> : <XCircle className={styles.incorrectIcon} />}
              </div>
              <div className={styles.reviewDetails}>
                <p>{t('quiz.yourAnswer')}: <span className={isCorrect ? styles.correctText : styles.incorrectText}>{userAnswer}</span></p>
                {!isCorrect && <p>{t('quiz.correctAnswer')}: <span className={styles.correctText}>{q.correctAnswer}</span></p>}
                <p className={styles.explanation}><strong>{t('quiz.explanation')}:</strong> {q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};