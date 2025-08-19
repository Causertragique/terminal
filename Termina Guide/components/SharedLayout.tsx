import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './SharedLayout.module.css';

interface SharedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const SharedLayout = ({ children, className }: SharedLayoutProps) => {
  const location = useLocation();

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
          </div>
        </div>
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};