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
        <div className="add-to-cart">
            {/* Price */}
            <div className="price-display">
                {currentPrice.toFixed(2)} €
            </div>

            {/* Variant Select */}
            <div className="variant-group">
                <span className="field-label">Taille</span>
                <div className="variant-pills">
                    {product.variants.map(v => (
                        <button
                            key={v.id}
                            onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                            className={`variant-pill ${selectedVariant?.id === v.id ? 'active' : ''} ${v.stock <= 0 ? 'out-of-stock' : ''}`}
                            disabled={v.stock <= 0}
                            title={v.stock <= 0 ? 'Rupture de stock' : v.size}
                        >
                            {v.size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stock status */}
            <div className="stock-status">
                {isOutOfStock ? (
                    <span className="stock-out">✕ Rupture de stock</span>
                ) : selectedVariant?.stock <= 3 ? (
                    <span className="stock-low">⚡ Plus que {selectedVariant.stock} en stock</span>
                ) : (
                    <span className="stock-ok">✓ En stock</span>
                )}
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
                <div className="quantity-group">
                    <span className="field-label">Quantité</span>
                    <div className="qty-controls">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>−</button>
                        <span className="qty-display">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                            disabled={quantity >= (selectedVariant?.stock || 1)}>+</button>
                    </div>
                </div>
            )}

            {/* CTA */}
            <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`add-btn btn-primary ${isAdded ? 'added' : ''} ${isOutOfStock ? 'disabled' : ''}`}
            >
                {isOutOfStock ? 'Rupture de Stock' : isAdded ? '✓ Ajouté au Panier' : 'Ajouter au Panier'}
            </button></div>
    );
}
