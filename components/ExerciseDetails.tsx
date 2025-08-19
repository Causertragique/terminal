import React from 'react';
import { Selectable } from 'kysely';
import { useTranslation } from '../helpers/useTranslation';
import { PracticeExercises } from '../helpers/schema';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';
import { Badge } from './Badge';
import { Lightbulb, Target } from 'lucide-react';
import styles from './ExerciseDetails.module.css';

interface ExerciseDetailsProps {
  exercise: Selectable<PracticeExercises>;
  className?: string;
}

export const ExerciseDetails = ({
  exercise,
  className,
}: ExerciseDetailsProps) => {
  const { t } = useTranslation();
  
  const getDifficultyVariant = (
    difficulty: string,
  ): 'success' | 'warning' | 'destructive' => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'destructive';
      default:
        return 'success';
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{exercise.title}</h2>
        <Badge variant={getDifficultyVariant(exercise.difficulty)}>
          {exercise.difficulty}
        </Badge>
      </div>
      <p className={styles.description}>{exercise.description}</p>

      <div className={styles.commandInfo}>
        <p>
          <strong>{t('practice.yourTask')}</strong> {t('practice.executeCommand')}
        </p>
        <code className={styles.commandCode}>{exercise.commandToExecute}</code>
      </div>

      {(exercise.hints?.length || exercise.learningPoints?.length) && (
        <Accordion type="multiple" className={styles.accordion}>
          {exercise.hints && exercise.hints.length > 0 && (
            <AccordionItem value="hints">
              <AccordionTrigger>
                <div className={styles.accordionHeader}>
                  <Lightbulb size={16} />
                  <span>{t('practice.hints')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className={styles.list}>
                  {exercise.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {exercise.learningPoints && exercise.learningPoints.length > 0 && (
            <AccordionItem value="learning-points">
              <AccordionTrigger>
                <div className={styles.accordionHeader}>
                  <Target size={16} />
                  <span>{t('practice.learningPoints')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className={styles.list}>
                  {exercise.learningPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
};