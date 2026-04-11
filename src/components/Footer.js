'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                {/* Brand */}
                <div className="footer-col footer-brand">
                    <Link href="/" className="footer-logo">
                        <img src="/logo-dark.png" alt="Tafokt Rugs" className="footer-logo-img" />
                    </Link>
                    <p>
                        Des pièces uniques tissées à la main dans les montagnes de l&apos;Atlas.
                        Artisanat berbère authentique, fabriqué sur commande et expédié directement du Maroc.
                    </p>
                    <div className="footer-social">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49-.09-.85-.18-2.15.04-3.08.2-.84 1.28-5.42 1.28-5.42s-.33-.65-.33-1.61c0-1.51.88-2.64 1.97-2.64.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.91 3.64-.26 1.1.55 1.99 1.63 1.99 1.96 0 3.47-2.07 3.47-5.05 0-2.64-1.9-4.49-4.61-4.49-3.14 0-4.98 2.35-4.98 4.79 0 .95.36 1.96.82 2.51.09.11.1.21.08.32-.08.35-.27 1.1-.31 1.25-.05.2-.16.25-.37.15-1.38-.64-2.24-2.66-2.24-4.28 0-3.49 2.53-6.7 7.31-6.7 3.83 0 6.81 2.74 6.81 6.39 0 3.81-2.4 6.88-5.74 6.88-1.12 0-2.17-.58-2.53-1.27l-.69 2.63c-.25.96-.92 2.16-1.38 2.89C10.28 21.86 11.12 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div className="footer-col">
                    <h4>Navigation</h4>
                    <Link href="/">Accueil</Link>
                    <Link href="/about">Notre Histoire</Link>
                    <Link href="/catalogue">Catalogue</Link>
                    <Link href="/catalogue?category=tapis-shaggy">Tapis</Link>
                    <Link href="/catalogue?category=coussins">Coussins</Link>
                    <Link href="/catalogue?category=poufs">Poufs</Link>
                </div>

                {/* Informations */}
                <div className="footer-col">
                    <h4>Informations</h4>
                    <Link href="/faq">FAQ</Link>
                    <Link href="/shipping">Livraison &amp; Retours</Link>
                    <Link href="/terms">CGV</Link>
                    <Link href="/contact">Contact</Link>
                </div>

                {/* Contact & Payment */}
                <div className="footer-col">
                    <h4>Contact</h4>
                    <p className="footer-contact-item">contact@tafoktrugs.com</p>
                    <p className="footer-contact-item">Fabrication sur commande</p>
                    <p className="footer-contact-item">Livraison sous 25 jours</p>
                    
                    <h4 style={{ marginTop: '1.5rem' }}>Paiements Sécurisés</h4>
                    <div className="payment-methods">
                        <span className="payment-badge">Visa</span>
                        <span className="payment-badge">Mastercard</span>
                        <span className="payment-badge">PayPal</span>
                        <span className="payment-badge">CB</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2025 Tafokt Rugs &mdash; Tous droits réservés. Tapis berbères authentiques faits main au Maroc.</p>
                </div>
            </div>
        </footer>
    );
}
