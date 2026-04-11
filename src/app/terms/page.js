export const metadata = {
    title: 'Conditions Générales de Vente | Tafokt Rugs',
    description: 'Conditions générales de vente de la boutique Tafokt Rugs.',
};

export default function TermsPage() {
    return (
        <div className="static-page container">
            <div className="static-hero">
                <h1>Conditions <em>Générales</em> de Vente</h1>
                <p className="static-intro">
                    Les présentes conditions régissent les ventes effectuées sur le site Tafokt Rugs.
                </p>
            </div>

            <section className="static-section terms-content">
                <h2>Article 1 — Objet</h2>
                <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes
                    conclues par le biais du site internet Tafokt Rugs. Toute commande implique
                    l'acceptation sans réserve des présentes CGV.
                </p>

                <h2>Article 2 — Produits</h2>
                <p>
                    Les produits proposés à la vente sont des articles d'artisanat faits main. Chaque
                    pièce étant unique, de légères variations de dimensions, de couleur ou de motifs
                    peuvent exister par rapport aux photographies présentées sur le site.
                </p>

                <h2>Article 3 — Prix</h2>
                <p>
                    Les prix sont indiqués en euros (EUR) TTC. Tafokt Rugs se réserve le droit de
                    modifier ses prix à tout moment, mais les produits seront facturés au prix en
                    vigueur au moment de la validation de la commande.
                </p>

                <h2>Article 4 — Commande</h2>
                <p>
                    La commande n'est définitivement validée qu'après confirmation du paiement.
                    Un email de confirmation est envoyé au client récapitulant les détails de la commande.
                </p>

                <h2>Article 5 — Paiement</h2>
                <p>
                    Le paiement s'effectue en ligne par carte bancaire via notre plateforme sécurisée.
                    Les transactions sont chiffrées et les données bancaires ne sont jamais stockées
                    sur nos serveurs.
                </p>

                <h2>Article 6 — Livraison</h2>
                <p>
                    Les délais de livraison sont donnés à titre indicatif. Tafokt Rugs ne pourra être
                    tenue responsable des retards de livraison dus au transporteur ou à des événements
                    de force majeure. Consultez notre page <a href="/shipping">Livraison & Retours</a> pour
                    plus de détails.
                </p>

                <h2>Article 7 — Droit de Rétractation</h2>
                <p>
                    Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à
                    compter de la réception de votre commande pour exercer votre droit de rétractation.
                    Les articles doivent être retournés dans leur état d'origine.
                </p>

                <h2>Article 8 — Propriété Intellectuelle</h2>
                <p>
                    L'ensemble des contenus du site (textes, images, logos) est protégé par le droit
                    de la propriété intellectuelle. Toute reproduction est interdite sans autorisation
                    préalable.
                </p>

                <h2>Article 9 — Données Personnelles</h2>
                <p>
                    Les informations collectées lors de votre commande sont nécessaires au traitement
                    de celle-ci. Conformément au RGPD, vous disposez d'un droit d'accès, de
                    rectification et de suppression de vos données personnelles.
                </p>
            </section>
        </div>
    );
}
