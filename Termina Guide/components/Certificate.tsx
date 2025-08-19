import React, { useRef } from 'react';
import { useTranslation } from '../helpers/useTranslation';
import { Button } from './Button';
import styles from './Certificate.module.css';
import { Download } from 'lucide-react';

interface CertificateProps {
  categoryName: string;
  difficulty: string;
  sessionId: string;
  date: Date;
}

export const Certificate = ({ categoryName, difficulty, sessionId, date }: CertificateProps) => {
  const { t } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(element, { scale: 2 });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');

      link.href = data;
      link.download = `Certificate-${categoryName}-${difficulty}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert("Could not download certificate. Please try again.");
    }
  };

  return (
    <div className={styles.certificateWrapper}>
      <div ref={certificateRef} className={styles.certificate}>
        <div className={styles.border}>
          <div className={styles.content}>
            <h1 className={styles.title}>{t('quiz.certificateTitle')}</h1>
            <p className={styles.subtitle}>{t('quiz.certifiesThis')}</p>
            <p className={styles.recipient}>{sessionId}</p>
            <p className={styles.body}>
              {t('quiz.hasCompleted')}
              <br />
              <span className={styles.courseName}>{t('quiz.commandProficiencyQuiz', { categoryName })}</span>
              <br />
              {t('quiz.atDifficultyLevel', { difficulty: t(`practice.${difficulty}`) })}.
            </p>
            <div className={styles.footer}>
              <div className={styles.signature}>
                <p className={styles.signatureLine}>{t('quiz.terminalGuide')}</p>
                <p className={styles.signatureTitle}>{t('quiz.issuingAuthority')}</p>
              </div>
              <div className={styles.date}>
                <p className={styles.signatureLine}>{date.toLocaleDateString()}</p>
                <p className={styles.signatureTitle}>{t('quiz.dateIssued')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleDownload} className={styles.downloadButton}>
        <Download size={16} /> {t('quiz.downloadCertificate')}
      </Button>
    </div>
  );
};