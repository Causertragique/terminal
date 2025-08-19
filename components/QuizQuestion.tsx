import React from 'react';
import { useTranslation } from '../helpers/useTranslation';
import type { Selectable } from 'kysely';
import type { QuizQuestions } from '../helpers/schema';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import { Input } from './Input';
import styles from './QuizQuestion.module.css';

interface QuizQuestionProps {
  question: Selectable<QuizQuestions>;
  userAnswer: string;
  onAnswerChange: (questionId: number, answer: string) => void;
}

export const QuizQuestion = ({ question, userAnswer, onAnswerChange }: QuizQuestionProps) => {
  const { t } = useTranslation();
  const renderQuestionType = () => {
    const options = [question.correctAnswer, ...(question.wrongAnswers || [])].sort(() => Math.random() - 0.5);

    switch (question.questionType) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={userAnswer}
            onValueChange={(value) => onAnswerChange(question.id, value)}
            className={styles.radioGroup}
          >
            {options.map((option, index) => (
              <div key={index} className={styles.radioItem}>
                <RadioGroupItem value={option} id={`q${question.id}-option${index}`} />
                <label htmlFor={`q${question.id}-option${index}`} className={styles.radioLabel}>
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'true-false':
        return (
          <RadioGroup
            value={userAnswer}
            onValueChange={(value) => onAnswerChange(question.id, value)}
            className={styles.radioGroup}
          >
            <div className={styles.radioItem}>
              <RadioGroupItem value="True" id={`q${question.id}-true`} />
              <label htmlFor={`q${question.id}-true`} className={styles.radioLabel}>{t('quiz.true')}</label>
            </div>
            <div className={styles.radioItem}>
              <RadioGroupItem value="False" id={`q${question.id}-false`} />
              <label htmlFor={`q${question.id}-false`} className={styles.radioLabel}>{t('quiz.false')}</label>
            </div>
          </RadioGroup>
        );
      case 'fill-in-the-blank':
        return (
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={t('quiz.typeAnswerPlaceholder')}
            className={styles.input}
          />
        );
      default:
        return <p>{t('quiz.unsupportedQuestionType')}</p>;
    }
  };

  return (
    <div className={styles.questionContainer}>
      <h2 className={styles.questionText}>{question.question}</h2>
      <div className={styles.optionsContainer}>
        {renderQuestionType()}
      </div>
    </div>
  );
};