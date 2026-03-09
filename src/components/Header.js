'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, isInitialized } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Promo Banner */}
      <div className="promo-banner">
        <p>Livraison offerte dès 300 € • Tapis faits main au Maroc • Pièces authentiques &amp; uniques</p>
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="site-logo">
            Amazigh<em>Artes</em>
          </Link>

          {/* Desktop Nav */}
          <nav className="site-nav" aria-label="Navigation principale">
            <Link href="/catalogue" className="nav-link">Catalogue</Link>
            <Link href="/catalogue?category=beni-ouarain" className="nav-link">Beni Ouarain</Link>
            <Link href="/catalogue?category=azilal" className="nav-link">Azilal</Link>
            <Link href="/catalogue?category=kilim" className="nav-link">Kilims</Link>
            <Link href="/about" className="nav-link">Notre Histoire</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="action-btn"
              aria-label="Changer de thème"
              title="Changer de thème"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <Link href="/account" className="action-btn" aria-label="Compte">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/cart" className="action-btn cart-btn" aria-label="Panier">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {isInitialized && cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="action-btn mobile-menu-btn"
              aria-label="Menu mobile"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="mobile-nav">
            <Link href="/catalogue" onClick={() => setMobileMenuOpen(false)}>Catalogue</Link>
            <Link href="/catalogue?category=beni-ouarain" onClick={() => setMobileMenuOpen(false)}>Beni Ouarain</Link>
            <Link href="/catalogue?category=azilal" onClick={() => setMobileMenuOpen(false)}>Azilal</Link>
            <Link href="/catalogue?category=kilim" onClick={() => setMobileMenuOpen(false)}>Kilims</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>Notre Histoire</Link>
          </nav>
        )}
      </header></>
  );
}
