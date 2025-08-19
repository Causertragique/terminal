import React from 'react';
import { CommandCard } from './CommandCard';
import { CommandCardSkeleton } from './CommandCardSkeleton';
import { CommandWithCategory } from '../endpoints/commands_GET.schema';
import { ServerCrash } from 'lucide-react';
// @ts-ignore
import styles from './CommandList.module.css';

interface CommandListProps {
  commands?: CommandWithCategory[];
  isFetching: boolean;
  error: unknown;
}

export const CommandList = ({
  commands,
  isFetching,
  error,
}: CommandListProps) => {
  if (isFetching) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <CommandCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return (
      <div className={styles.messageContainer}>
        <ServerCrash size={48} className={styles.errorIcon} />
        <h3 className={styles.messageTitle}>Error Fetching Commands</h3>
        <p className={styles.messageText}>{errorMessage}</p>
      </div>
    );
  }

  if (!commands || commands.length === 0) {
    return (
      <div className={styles.messageContainer}>
        <h3 className={styles.messageTitle}>No Commands Found</h3>
        <p className={styles.messageText}>
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {commands.map(command => (
        <CommandCard key={command.id} command={command} />
      ))}
    </div>
  );
};