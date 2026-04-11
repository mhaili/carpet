'use client';

import { useState } from 'react';
import { useCart } from '../../../components/CartProvider';

export default function ClientAddToCart({ product }) {
    const { addToCart } = useCart();

    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [dimensionMode, setDimensionMode] = useState('predefined');
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');

    const pricePerSqm = product.price_per_sqm || 120;
    const originalPricePerSqm = product.original_price_per_sqm || 240;

    const isCustom = dimensionMode === 'custom';
    const customW = parseInt(customWidth) || 0;
    const customH = parseInt(customHeight) || 0;
    const validCustom = customW >= 60 && customH >= 60 && customW <= 600 && customH <= 600;

    // Custom price calculation
    const customAreaSqm = validCustom ? (customW * customH) / 10000 : 0;
    const customSalePrice = validCustom ? Math.round(customAreaSqm * pricePerSqm) : null;
    const customOriginalPrice = validCustom ? Math.round(customAreaSqm * originalPricePerSqm) : null;

    // Current price
    const currentSalePrice = isCustom && validCustom
        ? customSalePrice
        : selectedVariant?.price || product.base_price;
    const currentOriginalPrice = isCustom && validCustom
        ? customOriginalPrice
        : selectedVariant?.original_price || currentSalePrice * 2;

    const hasDiscount = product.is_on_sale && currentOriginalPrice > currentSalePrice;
    const isOutOfStock = !isCustom && selectedVariant?.stock <= 0;

    const handleAddToCart = () => {
        if (isCustom) {
            if (!validCustom) return;
            const customVariant = {
                id: `custom-${product.id}-${customW}x${customH}`,
                size: `${customW} x ${customH} cm (sur mesure)`,
                price: customSalePrice,
                original_price: customOriginalPrice,
                stock: 1,
            };
            addToCart(product, customVariant, quantity);
        } else {
            if (!selectedVariant || isOutOfStock) return;
            addToCart(product, selectedVariant, quantity);
        }
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const canAdd = isCustom ? validCustom : !isOutOfStock;

    return (
        <div className="add-to-cart-premium">
            {/* Price Display */}
            <div className="price-display-premium">
                <div className="price-main-row">
                    <span className="sale-price">{currentSalePrice?.toFixed(0)} €</span>
                    {hasDiscount && (
                        <>
                            <span className="original-price">{currentOriginalPrice?.toFixed(0)} €</span>
                            <span className="discount-tag">-{product.discount_percent}%</span>
                        </>
                    )}
                </div>
                {isCustom && validCustom && (
                    <span className="custom-price-note">
                        {customAreaSqm.toFixed(2)} m² × {pricePerSqm} €/m²
                    </span>
                )}
                <span className="free-shipping-note">🚚 Livraison Gratuite</span>
            </div>

            {/* Dimension Mode Toggle */}
            <div className="dimension-mode-toggle">
                <button
                    className={`mode-btn ${!isCustom ? 'active' : ''}`}
                    onClick={() => setDimensionMode('predefined')}
                >
                    Tailles disponibles
                </button>
                <button
                    className={`mode-btn ${isCustom ? 'active' : ''}`}
                    onClick={() => setDimensionMode('custom')}
                >
                    Taille personnalisée
                </button>
            </div>

            {/* Predefined Sizes */}
            {!isCustom && (
                <div className="variant-selection-premium">
                    <span className="selection-label">Choisir les dimensions</span>
                    <div className="variant-grid-premium">
                        {(product.variants || []).map(v => (
                            <button
                                key={v.id}
                                onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                                className={`v-pill ${selectedVariant?.id === v.id ? 'active' : ''} ${v.stock <= 0 ? 'out-of-stock' : ''}`}
                                disabled={v.stock <= 0}
                            >
                                <span className="v-name">{v.size}</span>
                                <span className="v-price">{v.price?.toFixed(0)} €</span>
                                {hasDiscount && v.original_price > v.price && (
                                    <span className="v-original">{v.original_price?.toFixed(0)} €</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Dimensions */}
            {isCustom && (
                <div className="custom-dimensions">
                    <span className="selection-label">Entrez vos dimensions (cm)</span>
                    <div className="custom-dim-row">
                        <div className="dim-input-group">
                            <label>Largeur (cm)</label>
                            <input
                                type="number"
                                min="60"
                                max="600"
                                value={customWidth}
                                onChange={e => setCustomWidth(e.target.value)}
                                placeholder="ex: 200"
                            />
                        </div>
                        <span className="dim-sep">×</span>
                        <div className="dim-input-group">
                            <label>Longueur (cm)</label>
                            <input
                                type="number"
                                min="60"
                                max="600"
                                value={customHeight}
                                onChange={e => setCustomHeight(e.target.value)}
                                placeholder="ex: 300"
                            />
                        </div>
                    </div>
                    {(customW > 0 || customH > 0) && !validCustom && (
                        <p className="dim-hint">Min 60 cm — Max 600 cm par côté</p>
                    )}
                    {validCustom && (
                        <div className="custom-price-summary">
                            <div className="price-calc-line">
                                <span>Surface : {customAreaSqm.toFixed(2)} m²</span>
                                <span>× {pricePerSqm} €/m²</span>
                            </div>
                            <div className="price-calc-total">
                                <span>Total :</span>
                                <span className="calc-sale">{customSalePrice} €</span>
                                <span className="calc-original">{customOriginalPrice} €</span>
                            </div>
                        </div>
                    )}

                    {/* Quick size presets */}
                    <div className="predefined-quick">
                        <span className="selection-label" style={{ marginTop: '1rem' }}>Tailles populaires</span>
                        <div className="quick-chips">
                            {[
                                { w: 120, h: 170, label: '120×170' },
                                { w: 150, h: 200, label: '150×200' },
                                { w: 200, h: 300, label: '200×300' },
                                { w: 250, h: 350, label: '250×350' },
                                { w: 300, h: 400, label: '300×400' },
                            ].map(d => (
                                <button
                                    key={d.label}
                                    className={`quick-chip ${customWidth == d.w && customHeight == d.h ? 'active' : ''}`}
                                    onClick={() => { setCustomWidth(String(d.w)); setCustomHeight(String(d.h)); }}
                                >
                                    {d.label} cm
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CTA & Quantity */}
            <div className="cta-row-premium">
                {canAdd && (
                    <div className="qty-selector-premium">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>−</button>
                        <span className="qty-num">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}
                            disabled={!isCustom && quantity >= (selectedVariant?.stock || 1)}>+</button>
                    </div>
                )}
                
                <button
                    onClick={handleAddToCart}
                    disabled={!canAdd}
                    className={`btn-atc-premium ${isAdded ? 'success' : ''} ${!canAdd ? 'disabled' : ''}`}
                >
                    {!canAdd ? 'Épuisé' : isAdded ? 'Dans le panier ✓' : `Ajouter au Panier — ${currentSalePrice?.toFixed(0)} €`}
                </button>
            </div>

            <style jsx>{`
                .add-to-cart-premium {
                    margin-top: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .price-display-premium {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .price-main-row {
                    display: flex;
                    align-items: baseline;
                    gap: 0.75rem;
                }

                .sale-price {
                    font-family: var(--font-body);
                    font-size: 2.2rem;
                    font-weight: 600;
                    color: #c0392b;
                }

                .original-price {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    text-decoration: line-through;
                }

                .discount-tag {
                    background: #c0392b;
                    color: white;
                    padding: 0.2rem 0.6rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 3px;
                }

                .custom-price-note {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    letter-spacing: 0.02em;
                }

                .free-shipping-note {
                    font-size: 0.8rem;
                    color: #27ae60;
                    font-weight: 500;
                }

                .dimension-mode-toggle {
                    display: flex;
                    border: 1px solid var(--border-color);
                }

                .mode-btn {
                    flex: 1;
                    padding: 0.85rem 1rem;
                    font-size: 0.72rem;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    background: transparent;
                    color: var(--text-secondary);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                }

                .mode-btn:first-child {
                    border-right: 1px solid var(--border-color);
                }

                .mode-btn.active {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }

                .mode-btn:hover:not(.active) {
                    background: var(--bg-tertiary);
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
                    border-color: #c0392b;
                    background-color: rgba(192, 57, 43, 0.05);
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

                .v-price {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #c0392b;
                }

                .v-original {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    text-decoration: line-through;
                }

                /* Custom dimensions */
                .custom-dimensions {
                    display: flex;
                    flex-direction: column;
                }

                .custom-dim-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 0.75rem;
                }

                .dim-input-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .dim-input-group label {
                    font-size: 0.68rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-secondary);
                }

                .dim-input-group input {
                    padding: 0.85rem 1rem;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    font-family: var(--font-body);
                    transition: border-color 0.3s;
                    width: 100%;
                }

                .dim-input-group input:focus {
                    outline: none;
                    border-color: #c0392b;
                }

                .dim-sep {
                    font-size: 1.2rem;
                    color: var(--text-secondary);
                    padding-bottom: 0.85rem;
                }

                .dim-hint {
                    font-size: 0.72rem;
                    color: #e57373;
                    margin-top: 0.5rem;
                }

                .custom-price-summary {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                }

                .price-calc-line {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                }

                .price-calc-total {
                    display: flex;
                    align-items: baseline;
                    gap: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .calc-sale {
                    color: #c0392b;
                    font-size: 1.3rem;
                }

                .calc-original {
                    color: var(--text-secondary);
                    text-decoration: line-through;
                    font-size: 0.9rem;
                    font-weight: 400;
                }

                .predefined-quick {
                    margin-top: 0.5rem;
                }

                .quick-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .quick-chip {
                    padding: 0.5rem 0.9rem;
                    font-size: 0.72rem;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.04em;
                }

                .quick-chip:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }

                .quick-chip.active {
                    border-color: #c0392b;
                    color: #c0392b;
                    background: rgba(192, 57, 43, 0.05);
                }

                /* CTA row */
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
                    border: none;
                    background: transparent;
                    color: var(--text-primary);
                    cursor: pointer;
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
                    background: #c0392b;
                    color: white;
                    text-transform: uppercase;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.15em;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }

                .btn-atc-premium:hover:not(:disabled) {
                    background: #a93226;
                }

                .btn-atc-premium.success {
                    background: #22c55e;
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
