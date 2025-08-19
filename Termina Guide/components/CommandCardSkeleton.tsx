import { Skeleton } from './Skeleton';
import styles from './CommandCardSkeleton.module.css';

export const CommandCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.header}>
        <Skeleton className={styles.badgeSkeleton} />
        <Skeleton className={styles.iconSkeleton} />
      </div>
      <Skeleton className={styles.commandSkeleton} />
      <div className={styles.description}>
        <Skeleton className={styles.line1} />
        <Skeleton className={styles.line2} />
      </div>
      <div className={styles.details}>
        <Skeleton className={styles.detailTitleSkeleton} />
        <Skeleton className={styles.detailContentSkeleton} />
      </div>
      <div className={styles.tags}>
        <Skeleton className={styles.tagSkeleton} />
        <Skeleton className={styles.tagSkeleton} />
      </div>
    </div>
  );
};