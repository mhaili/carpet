'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-col">
                    <span className="footer-logo">AmazighArtes</span>
                    <p className="footer-desc">
                        Véritables tapis berbères noués à la main au cœur des montagnes du Maroc.
                        Chaque pièce est unique et raconte l'histoire d'une artisane.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Collections</h4>
                    <ul>
                        <li><Link href="/catalogue?category=beni-ouarain">Tapis Berbères</Link></li>
                        <li><Link href="/catalogue?category=coussins">Coussins Sabra</Link></li>
                        <li><Link href="/catalogue?category=plaids">Plaids & Jetés</Link></li>
                        <li><Link href="/catalogue?category=tableaux">Art Mural Berbère</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Service Client</h4>
                    <ul>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/shipping">Livraison & Retours</Link></li>
                        <li><Link href="/terms">Conditions Générales</Link></li>
                        <li><Link href="/contact">Nous Contacter</Link></li>
                    </ul>
                </div>

                <div className="footer-col footer-newsletter">
                    <h4>Newsletter</h4>
                    <p className="footer-desc">Recevez 10% de réduction sur votre première commande et découvrez nos nouvelles pièces.</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Votre adresse e-mail" />
                        <button type="submit" className="btn-outline-white">S'abonner</button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>&copy; {new Date().getFullYear()} Amazigh Artes. Tous droits réservés.</p>
                <p>Artisanat marocain • Commerce équitable • Livraison mondiale</p>
            </div>
        </footer>
    );
}
