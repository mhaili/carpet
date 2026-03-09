'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localeStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart JSON', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (product, variant, quantity) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => item.product.id === product.id && item.variant.id === variant.id
            );

            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // Add new item
                return [...prevCart, { product, variant, quantity }];
            }
        });
    };

    const removeFromCart = (productId, variantId) => {
        setCart(prevCart => prevCart.filter(
            item => !(item.product.id === productId && item.variant.id === variantId)
        ));
    };

    const updateQuantity = (productId, variantId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, variantId);
            return;
        }
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.product.id === productId && item.variant.id === variantId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cart.reduce((total, item) => {
        const price = item.product.base_price + (item.variant.price_modifier || 0);
        return total + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isInitialized
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
