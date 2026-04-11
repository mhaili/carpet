export const metadata = {
    title: 'Livraison & Retours | Tafokt Rugs',
    description: 'Informations sur la livraison et la politique de retours de Tafokt Rugs.',
};

export default function ShippingPage() {
    return (
        <div className="static-page container">
            <div className="static-hero">
                <h1>Livraison & <em>Retours</em></h1>
                <p className="static-intro">
                    Toutes les informations concernant l'expédition de vos commandes et notre politique de retours.
                </p>
            </div>

            <section className="static-section">
                <h2>Livraison</h2>

                <div className="shipping-grid">
                    <div className="shipping-card">
                        <h3>France Métropolitaine</h3>
                        <p className="shipping-price">Gratuite dès 200 €</p>
                        <p>Livraison standard : 5-7 jours ouvrables</p>
                        <p>Livraison express : 2-3 jours ouvrables (+15 €)</p>
                    </div>
                    <div className="shipping-card">
                        <h3>Europe</h3>
                        <p className="shipping-price">À partir de 15 €</p>
                        <p>Délai : 7-14 jours ouvrables</p>
                        <p>Suivi inclus pour toutes les commandes</p>
                    </div>
                    <div className="shipping-card">
                        <h3>International</h3>
                        <p className="shipping-price">À partir de 25 €</p>
                        <p>Délai : 10-21 jours ouvrables</p>
                        <p>Droits de douane à la charge du destinataire</p>
                    </div>
                </div>
            </section>

            <section className="static-section">
                <h2>Politique de Retours</h2>
                <div className="static-text">
                    <p>
                        Vous disposez de <strong>14 jours</strong> après réception de votre commande pour effectuer un retour.
                        L'article doit être dans son état d'origine, non utilisé et dans son emballage d'origine.
                    </p>
                    <h3>Comment effectuer un retour ?</h3>
                    <ol className="return-steps">
                        <li>Contactez-nous par email ou via le formulaire de contact en indiquant votre numéro de commande</li>
                        <li>Nous vous enverrons une étiquette de retour et les instructions d'emballage</li>
                        <li>Emballez soigneusement l'article et déposez-le au point relais indiqué</li>
                        <li>Le remboursement est effectué sous 5-7 jours ouvrables après réception et vérification</li>
                    </ol>
                    <p>
                        <strong>Note :</strong> Les frais de retour sont à la charge du client (sauf en cas de défaut
                        ou d'erreur de notre part). Les articles sur mesure ne sont pas éligibles au retour.
                    </p>
                </div>
            </section>
        </div>
    );
}
