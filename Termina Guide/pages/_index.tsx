import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useDebounce } from '../helpers/useDebounce';
import { useCommands } from '../helpers/useCommands';
import { useCategories } from '../helpers/useCategories';
import { CommandFilters } from '../components/CommandFilters';
import { CommandList } from '../components/CommandList';
import { useTranslation } from '../helpers/useTranslation';
import { useAuth } from '../helpers/useAuth';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Skeleton } from '../components/Skeleton';
import { LogOut, User } from 'lucide-react';
import styles from './_index.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  const { authState, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filters = useMemo(() => {
    const activeFilters: {
      categoryId?: number;
      search?: string;
      tags?: string[];
    } = {};
    if (selectedCategoryId) {
      activeFilters.categoryId = selectedCategoryId;
    }
    if (debouncedSearchQuery) {
      activeFilters.search = debouncedSearchQuery;
    }
    if (selectedTags.length > 0) {
      activeFilters.tags = selectedTags;
    }
    return activeFilters;
  }, [selectedCategoryId, debouncedSearchQuery, selectedTags]);

  const {
    data: commands,
    isFetching: isFetchingCommands,
    error: commandsError,
  } = useCommands(filters);
  const {
    data: categories,
    isFetching: isFetchingCategories,
    error: categoriesError,
  } = useCategories();

  const allTags = useMemo(() => {
    if (!commands) return [];
    const tagSet = new Set<string>();
    commands.forEach(command => {
      command.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
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
        <div className={styles.authBar}>
          <div className={styles.authBarContent}>
            <div className={styles.authBarLeft}>
              <LanguageSwitcher />
            </div>
            <div className={styles.authBarRight}>
              {authState.type === 'loading' && (
                <div className={styles.authSkeleton}>
                  <Skeleton style={{ width: '100px', height: '2rem' }} />
                </div>
              )}
              {authState.type === 'unauthenticated' && (
                <div className={styles.authButtons}>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">{t('nav.login', 'Login')}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/login">{t('nav.register', 'Register')}</Link>
                  </Button>
                </div>
              )}
              {authState.type === 'authenticated' && (
                <div className={styles.userSection}>
                  <div className={styles.userInfo}>
                    <User className={styles.userIcon} />
                    <span className={styles.userName}>
                      {authState.user.displayName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => logout()}
                    title={t('nav.logout', 'Logout')}
                  >
                    <LogOut />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('home.title')}</h1>
          <p className={styles.subtitle}>
            {t('home.description')}
          </p>
        </header>
        
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
            commands={commands}
            isFetching={isFetchingCommands}
            error={commandsError}
          />
        </main>
        </div>
      </div>
    </>
  );
}