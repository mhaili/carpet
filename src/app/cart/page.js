'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../components/CartProvider';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, isInitialized } = useCart();

    if (!isInitialized) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', letterSpacing: '1px' }}>Chargement...</p>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 300, marginBottom: '1rem' }}>
                    Votre Panier
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.8 }}>
                    Votre panier est vide. Découvrez notre collection de tapis berbères authentiques.
                </p>
                <Link href="/catalogue" className="btn-primary">
                    Découvrir la Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Votre Panier</h1>
                    <span className="cart-count-label">{cart.length} article{cart.length > 1 ? 's' : ''}</span>
                </div>

                <div className="cart-layout">
                    {/* Items */}
                    <div className="cart-items">
                        {cart.map((item) => {
                            const itemPrice = item.product.base_price + (item.variant.price_modifier || 0);
                            const primaryImg = item.product.images?.find(i => i.is_primary)?.url || item.product.images?.[0]?.url;
                            return (
                                <div key={`${item.product.id}-${item.variant.id}`} className="cart-item">
                                    <div className="item-img">
                                        {primaryImg ? (
                                            <Image src={primaryImg} alt={item.product.title} fill style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div className="img-placeholder">—</div>
                                        )}
                                    </div>

                                    <div className="item-body">
                                        <div className="item-left">
                                            <span className="item-cat">{item.product.category_name || 'Tapis'}</span>
                                            <Link href={`/product/${item.product.slug}`} className="item-name">
                                                {item.product.title}
                                            </Link>
                                            <span className="item-variant">Taille : {item.variant.size}</span>
                                        </div>

                                        <div className="item-right">
                                            <div className="qty-row">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >−</button>
                                                <span className="qty-num">{item.quantity}</span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                                                    disabled={item.quantity >= (item.variant.stock || 99)}
                                                >+</button>
                                            </div>
                                            <span className="item-total">{(itemPrice * item.quantity).toFixed(2)} €</span>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(item.product.id, item.variant.id)}
                                                aria-label="Supprimer"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="cart-summary">
                        <h3>Récapitulatif</h3>

                        <div className="summary-line">
                            <span>Sous-total</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                        <div className="summary-line">
                            <span>Livraison</span>
                            <span style={{ color: '#4a7c59' }}>Gratuite</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-line summary-total">
                            <span>Total TTC</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>

                        <Link href="/checkout" className="btn-primary checkout-cta">
                            Procéder au paiement
                        </Link>

                        <Link href="/catalogue" className="continue-link">
                            ← Continuer mes achats
                        </Link>

                        <div className="secure-notice">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>Paiements 100% sécurisés</span>
                        </div>
                    </div>
                </div>
            </div></div>
    );
}
