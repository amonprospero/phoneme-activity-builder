'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // close menu when route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/wordle', label: 'WORDLE' },
    { href: '/wordsearch', label: 'WORDSEARCH' },
    { href: '/about', label: 'ABOUT' },
    { href: '/settings', label: 'SETTING' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.titleArea}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>Phoneme Activity Builder</span>
          </Link>
          <span className={styles.subtitle}>Cloud-based Web Application · Assessment 1</span>
        </div>

        {/* Desktop nav */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={styles.mobileNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileLink} ${pathname === item.href ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
