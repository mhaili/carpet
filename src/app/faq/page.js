export const metadata = {
    title: 'FAQ | Tafokt Rugs',
    description: 'Questions fréquentes sur nos tapis berbères, la livraison et les retours.',
};

const faqs = [
    {
        question: 'Vos tapis sont-ils authentiques et faits main ?',
        answer: 'Oui, chaque tapis est noué ou tissé à la main par des artisanes berbères dans les régions de l\'Atlas marocain. Chaque pièce est unique et peut présenter de légères variations qui témoignent de son authenticité.',
    },
    {
        question: 'Comment entretenir mon tapis berbère ?',
        answer: 'Aspirez régulièrement votre tapis. Pour les tâches, tamponnez avec un chiffon humide et du savon doux. Évitez le lavage en machine. Un nettoyage professionnel une fois par an est recommandé pour les grandes pièces.',
    },
    {
        question: 'Quels sont les délais de livraison ?',
        answer: 'Les commandes sont expédiées sous 2-3 jours ouvrables. La livraison prend 5-7 jours pour la France métropolitaine, 7-14 jours pour l\'Europe et 10-21 jours pour le reste du monde.',
    },
    {
        question: 'Puis-je retourner un article ?',
        answer: 'Vous disposez de 14 jours après réception pour retourner un article dans son état d\'origine. Les frais de retour sont à la charge du client, sauf en cas de défaut ou d\'erreur de notre part.',
    },
    {
        question: 'Proposez-vous des tapis sur mesure ?',
        answer: 'Oui, nous pouvons organiser des commandes sur mesure avec nos coopératives partenaires. Contactez-nous avec vos dimensions et préférences de couleurs souhaitées. Le délai de fabrication est de 4 à 8 semaines.',
    },
    {
        question: 'Comment sont fixés les prix ?',
        answer: 'Nos prix reflètent le travail artisanal (un tapis peut nécessiter plusieurs semaines de travail), la qualité des matériaux naturels utilisés, et notre engagement de commerce équitable envers les artisanes.',
    },
    {
        question: 'Livrez-vous à l\'international ?',
        answer: 'Oui, nous livrons dans le monde entier. Les frais de livraison sont calculés en fonction de la destination et du poids de la commande.',
    },
];

export default function FAQPage() {
    return (
        <div className="static-page container">
            <div className="static-hero">
                <h1>Questions <em>Fréquentes</em></h1>
                <p className="static-intro">
                    Trouvez les réponses à vos questions sur nos produits, la livraison et le service client.
                </p>
            </div>

            <section className="static-section">
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <details key={index} className="faq-item">
                            <summary className="faq-question">{faq.question}</summary>
                            <p className="faq-answer">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section className="static-section static-cta">
                <h2>Vous n'avez pas trouvé votre réponse ?</h2>
                <p>Notre équipe est là pour vous aider.</p>
                <a href="/contact" className="btn-primary">Nous Contacter</a>
            </section>
        </div>
    );
}
