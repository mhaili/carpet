'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de l\'envoi');
            }
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="static-page container">
            <div className="static-hero">
                <h1>Nous <em>Contacter</em></h1>
                <p className="static-intro">
                    Une question, une demande spéciale ou simplement envie de discuter ? Notre équipe est à votre écoute.
                </p>
            </div>

            <section className="static-section">
                <div className="contact-layout">
                    <div className="contact-info">
                        <div className="contact-card">
                            <h3>Email</h3>
                            <p>contact@tafoktrugs.com</p>
                        </div>
                        <div className="contact-card">
                            <h3>Horaires</h3>
                            <p>Lundi - Vendredi : 9h - 18h</p>
                            <p>Samedi : 10h - 16h</p>
                        </div>
                        <div className="contact-card">
                            <h3>Adresse</h3>
                            <p>Tafokt Rugs</p>
                            <p>Marrakech, Maroc</p>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        {submitted ? (
                            <div className="contact-success">
                                <div className="success-icon">&#10003;</div>
                                <h3>Message envoyé !</h3>
                                <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-secondary">
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                {error && <p style={{ color: 'var(--color-error, #c00)', marginBottom: '1rem' }}>{error}</p>}
                                <div className="form-group">
                                    <label htmlFor="name">Nom complet</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Sujet</label>
                                    <select
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="">Choisir un sujet</option>
                                        <option value="commande">Question sur une commande</option>
                                        <option value="produit">Renseignement sur un produit</option>
                                        <option value="sur-mesure">Commande sur mesure</option>
                                        <option value="retour">Retour / Échange</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Envoi...' : 'Envoyer le Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
