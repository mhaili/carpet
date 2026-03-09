'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || 'CMD-000000';

    return (
        <div className="success-content container">
            <div className="success-icon">✓</div>
            <h1>Commande Confirmée</h1>
            <p className="order-number">Numéro de commande : <strong>{orderId}</strong></p>

            <div className="success-message">
                <p>Merci pour votre achat ! Votre commande a été enregistrée avec succès.</p>
                <p>Un e-mail de confirmation vous a été envoyé avec les détails de votre commande et les informations de suivi.</p>
            </div>

            <div className="next-steps">
                <Link href="/catalogue" className="btn-primary">
                    Continuer vos achats
                </Link>
                <Link href="/account" className="btn-secondary" style={{ marginLeft: '1rem' }}>
                    Voir mon compte
                </Link>
            </div></div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}><p>Chargement...</p></div>}>
            <SuccessContent />
        </Suspense>
    );
}
