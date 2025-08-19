import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useTranslation } from '../helpers/useTranslation';
import { useCommands } from '../helpers/useCommands';
import { useCategories } from '../helpers/useCategories';
import { CommandFilters } from '../components/CommandFilters';
import { CommandList } from '../components/CommandList';
// @ts-ignore: Le fichier CSS peut ne pas exister en développement
import styles from './_index.module.css';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  const { data: commands, isLoading: isFetchingCommands, error: commandsError } = useCommands(
    debouncedSearchQuery,
    selectedCategoryId,
    selectedTags,
    i18n.language
  );

  const { data: categories, isLoading: isFetchingCategories, error: categoriesError } = useCategories(i18n.language);

  // Extract all tags from commands
  const allTags = React.useMemo(() => {
    if (!commands) return [];
    const tagsSet = new Set<string>();
    commands.forEach(cmd => {
      cmd.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [commands]);

  return (
    <>
      <Helmet>
        <title>{t('home.title')}</title>
        <meta
          name="description"
          content={t('home.description')}
        />
      </Helmet>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
        <nav className={styles.navigationSection}>
          <div className={styles.navigationGrid}>
            <div className={styles.navigationCard}>
              <h3 className={styles.navigationTitle}>{t('practice.title')}</h3>
              <p className={styles.navigationDescription}>
                {t('practice.description')}
              </p>
              <Button asChild>
                <Link to="/practice">{t('nav.practice')}</Link>
              </Button>
            </div>
            
            <div className={styles.navigationCard}>
              <h3 className={styles.navigationTitle}>{t('quiz.title', 'Quiz')}</h3>
              <p className={styles.navigationDescription}>
                {t('quiz.description', 'Test your knowledge and earn certificates to validate your skills')}
              </p>
              <Button asChild variant="secondary">
                <Link to="/quiz">{t('button.startQuiz')}</Link>
              </Button>
            </div>
            
            <div className={styles.navigationCard}>
              <h3 className={styles.navigationTitle}>{t('browse.title', 'Browse Commands')}</h3>
              <p className={styles.navigationDescription}>
                {t('browse.description', 'Search and explore the complete terminal command reference')}
              </p>
              <Button asChild variant="outline">
                <Link to="#commands">{t('button.learnMore')}</Link>
              </Button>
            </div>
          </div>
        </nav>

        <main className={styles.mainContent} id="commands">
          <CommandFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories || []}
            isFetchingCategories={isFetchingCategories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            allTags={allTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            categoriesError={categoriesError}
          />
          <CommandList
            commands={commands as any}
            isFetching={isFetchingCommands}
            error={commandsError}
          />
        </main>
        </div>
      </div>
    </>
  );
}