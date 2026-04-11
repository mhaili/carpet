import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Notre Histoire | Tafokt Rugs',
    description: 'Découvrez l\'histoire de Tafokt Rugs et notre engagement pour la préservation de l\'artisanat berbère.',
};

export default function AboutPage() {
    return (
        <div className="static-page container">
            <div className="static-hero">
                <h1>Notre <em>Histoire</em></h1>
                <p className="static-intro">
                    Tafokt Rugs est né d’une passion pour l’artisanat berbère et d’un engagement
                    profond envers les communautés artisanales du Maroc.
                </p>
            </div>

            <section className="static-section">
                <div className="static-two-col">
                    <div className="static-text">
                        <h2>L'Héritage Amazigh</h2>
                        <p>
                            Depuis des millénaires, les artisanes berbères transmettent un savoir-faire
                            unique de mère en fille. Chaque motif, chaque nœud raconte une histoire —
                            celle de la montagne, de la famille, de la vie quotidienne dans l'Atlas.
                        </p>
                        <p>
                            Chez Tafokt Rugs, nous travaillons directement avec les coopératives de
                            femmes dans les régions du Moyen Atlas et du Haut Atlas pour vous offrir
                            des pièces authentiques, fabriquées selon des techniques ancestrales.
                        </p>
                    </div>
                    <div className="static-image-box">
                        <Image
                            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
                            alt="Artisane berbère au travail"
                            width={500}
                            height={400}
                            style={{ objectFit: 'cover', borderRadius: '8px', width: '100%', height: 'auto' }}
                        />
                    </div>
                </div>
            </section>

            <section className="static-section">
                <h2>Nos Valeurs</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <h3>Authenticité</h3>
                        <p>Chaque pièce est unique, tissée et nouée à la main par des artisanes qualifiées utilisant des techniques transmises depuis des générations.</p>
                    </div>
                    <div className="value-card">
                        <h3>Commerce Équitable</h3>
                        <p>Nous rémunérons justement chaque artisane et réinvestissons dans les coopératives locales pour soutenir l'éducation et la santé.</p>
                    </div>
                    <div className="value-card">
                        <h3>Durabilité</h3>
                        <p>Nos tapis sont fabriqués à partir de laine naturelle de mouton, teintée avec des pigments naturels, dans le respect de l'environnement.</p>
                    </div>
                </div>
            </section>

            <section className="static-section static-cta">
                <h2>Découvrez nos Créations</h2>
                <p>Chaque achat soutient directement les artisanes et leur communauté.</p>
                <Link href="/catalogue" className="btn-primary">Explorer la Collection</Link>
            </section>
        </div>
    );
}
