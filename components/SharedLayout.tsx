import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './Button';
import { useAuth } from '../helpers/useAuth';
import { useTranslation } from '../helpers/useTranslation';
import { LogOut, User } from 'lucide-react';
import styles from './SharedLayout.module.css';

interface SharedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const SharedLayout = ({ children, className }: SharedLayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { authState, logout } = useAuth();

  const navigationLinks = [
    { path: '/', label: 'Home' },
    { path: '/practice', label: 'Practice' },
    { path: '/quiz', label: 'Quiz' },
  ];

  return (
    <div className={`${styles.layout} ${className || ''}`}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            Terminal Guide
          </Link>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`${styles.navLink} ${
                      location.pathname === link.path ? styles.navLinkActive : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.headerRight}>
            <LanguageSwitcher />
            {authState.type === 'loading' && (
              <div className={styles.authSkeleton}>
                <div className={styles.skeletonButton}></div>
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
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};