'use client';

import { useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart, isInitialized } = useCart();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        address: '', city: '', zip: '', country: 'France',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    if (!isInitialized) return (
        <div style={{ padding: '8rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Chargement...
        </div>
    );

    if (cart.length === 0) {
        router.push('/cart');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const processPayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: cart, shippingInfo: formData, cartTotal }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            clearCart();
            router.push('/checkout/success?orderId=' + data.orderNumber);
        } catch (err) {
            alert('Erreur : ' + err.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Progress */}
                <div className="checkout-progress">
                    <div className={`prog-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="prog-num">1</span>
                        <span className="prog-label">Livraison</span>
                    </div>
                    <div className="prog-line"></div>
                    <div className={`prog-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="prog-num">2</span>
                        <span className="prog-label">Paiement</span>
                    </div>
                    <div className="prog-line"></div>
                    <div className={`prog-step ${step >= 3 ? 'active' : ''}`}>
                        <span className="prog-num">3</span>
                        <span className="prog-label">Confirmation</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    <div className="checkout-form-col">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="step-form">
                                <h2>Informations de livraison</h2>

                                <div className="form-group">
                                    <label>E-mail</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                        placeholder="votre@email.com" required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Prénom</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                            placeholder="Prénom" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Nom</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                            placeholder="Nom de famille" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Adresse</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                                        placeholder="Numéro et nom de rue" required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Code postal</label>
                                        <input type="text" name="zip" value={formData.zip} onChange={handleChange}
                                            placeholder="75001" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Ville</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange}
                                            placeholder="Paris" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Pays</label>
                                    <select name="country" value={formData.country} onChange={handleChange}>
                                        <option>France</option>
                                        <option>Belgique</option>
                                        <option>Suisse</option>
                                        <option>Canada</option>
                                        <option>Maroc</option>
                                        <option>Autre</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn-primary step-btn">
                                    Continuer vers le paiement →
                                </button>
                            </form>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <form onSubmit={processPayment} className="step-form">
                                <h2>Méthode de paiement</h2>

                                <div className="pay-methods">
                                    <label className={`pay-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input type="radio" name="pay" value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')} />
                                        <div className="pay-inner">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                                <line x1="1" y1="10" x2="23" y2="10" />
                                            </svg>
                                            <span>Carte Bancaire</span>
                                        </div>
                                    </label>

                                    <label className={`pay-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                                        <input type="radio" name="pay" value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')} />
                                        <div className="pay-inner">
                                            <span style={{ fontSize: '1.2rem' }}>🅿</span>
                                            <span>PayPal</span>
                                        </div>
                                    </label>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="card-fields">
                                        <div className="demo-badge">Mode Démo — aucun paiement réel</div>
                                        <div className="form-group">
                                            <label>Numéro de carte</label>
                                            <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} required />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Date d'expiration</label>
                                                <input type="text" placeholder="MM / AA" required />
                                            </div>
                                            <div className="form-group">
                                                <label>CVC</label>
                                                <input type="text" placeholder="123" maxLength={4} required />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="paypal-notice">
                                        <p>Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.</p>
                                    </div>
                                )}

                                <div className="step-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                                        ← Retour
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={isProcessing}>
                                        {isProcessing ? 'Traitement...' : `Payer ${cartTotal.toFixed(2)} €`}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-col">
                        <div className="order-summary">
                            <h3>Votre commande</h3>
                            <div className="summary-items">
                                {cart.map(item => {
                                    const price = (item.product.base_price + (item.variant.price_modifier || 0)) * item.quantity;
                                    return (
                                        <div key={`${item.product.id}-${item.variant.id}`} className="summary-item">
                                            <div className="sum-item-info">
                                                <span className="sum-qty">{item.quantity}×</span>
                                                <div>
                                                    <div className="sum-name">{item.product.title}</div>
                                                    <div className="sum-size">{item.variant.size}</div>
                                                </div>
                                            </div>
                                            <span className="sum-price">{price.toFixed(2)} €</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="summary-lines">
                                <div className="summary-line">
                                    <span>Sous-total</span><span>{cartTotal.toFixed(2)} €</span>
                                </div>
                                <div className="summary-line">
                                    <span>Livraison</span><span style={{ color: '#4a7c59' }}>Gratuite</span>
                                </div>
                                <div className="sum-divider"></div>
                                <div className="summary-line total-line">
                                    <span>Total</span><span>{cartTotal.toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></div>
    );
}
