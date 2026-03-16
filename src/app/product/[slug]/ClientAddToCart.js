'use client';

import { useState } from 'react';
import { useCart } from '../../../components/CartProvider';

export default function ClientAddToCart({ product }) {
    const { addToCart } = useCart();

    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const currentPrice = product.base_price + (selectedVariant?.price_modifier || 0);
    const isOutOfStock = selectedVariant?.stock <= 0;

    const handleAddToCart = () => {
        if (!selectedVariant || isOutOfStock) return;
        addToCart(product, selectedVariant, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="add-to-cart-premium">
            {/* Price - Large & Elegant */}
            <div className="price-display-premium">
                {currentPrice.toFixed(2)} €
            </div>

            {/* Variant Select */}
            {product.variants.length > 0 && (
                <div className="variant-selection-premium">
                    <span className="selection-label">Sélectionner la Taille</span>
                    <div className="variant-grid-premium">
                        {product.variants.map(v => (
                            <button
                                key={v.id}
                                onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                                className={`v-pill ${selectedVariant?.id === v.id ? 'active' : ''} ${v.stock <= 0 ? 'out-of-stock' : ''}`}
                                disabled={v.stock <= 0}
                            >
                                <span className="v-name">{v.size}</span>
                                {v.price_modifier !== 0 && (
                                    <span className="v-extra">
                                        {v.price_modifier > 0 ? `+${v.price_modifier}€` : `${v.price_modifier}€`}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA & Quantity */}
            <div className="cta-row-premium">
                {!isOutOfStock && (
                    <div className="qty-selector-premium">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>−</button>
                        <span className="qty-num">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                            disabled={quantity >= (selectedVariant?.stock || 1)}>+</button>
                    </div>
                )}
                
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`btn-atc-premium ${isAdded ? 'success' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                >
                    {isOutOfStock ? 'Épuisé' : isAdded ? 'Dans le panier' : 'Ajouter au Panier'}
                </button>
            </div>

            <style jsx>{`
                .add-to-cart-premium {
                    margin-top: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }

                .price-display-premium {
                    font-family: var(--font-body);
                    font-size: 2rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .selection-label {
                    display: block;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                }

                .variant-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 10px;
                }

                .v-pill {
                    padding: 1rem;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-primary);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .v-pill:hover:not(:disabled) {
                    border-color: var(--text-primary);
                }

                .v-pill.active {
                    border-color: var(--accent-color);
                    background-color: var(--bg-tertiary);
                }

                .v-pill.out-of-stock {
                    opacity: 0.4;
                    cursor: not-allowed;
                    text-decoration: line-through;
                }

                .v-name {
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .v-extra {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                }

                .cta-row-premium {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .qty-selector-premium {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--border-color);
                    height: 54px;
                }

                .qty-selector-premium button {
                    width: 40px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: background 0.2s;
                }

                .qty-selector-premium button:hover:not(:disabled) {
                    background: var(--bg-tertiary);
                }

                .qty-num {
                    width: 40px;
                    text-align: center;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .btn-atc-premium {
                    flex: 1;
                    height: 54px;
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.2em;
                    transition: all 0.3s ease;
                }

                .btn-atc-premium:hover:not(:disabled) {
                    background: var(--accent-color);
                    color: white;
                }

                .btn-atc-premium.success {
                    background: #22c55e;
                    color: white;
                }

                .btn-atc-premium.disabled {
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    cursor: not-allowed;
                    border: 1px solid var(--border-color);
                }
            `}</style>
        </div>
    );
}
