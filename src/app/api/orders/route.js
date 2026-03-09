import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { getSession } from '../../../lib/auth';

function generateOrderNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CMD-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request) {
    try {
        const session = await getSession();
        const customerId = session?.user?.id || null;

        const { cartItems, shippingInfo, cartTotal } = await request.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
        }

        const transaction = db.transaction(() => {
            const orderNumber = generateOrderNumber();
            const shippingStr = JSON.stringify(shippingInfo);

            const orderResult = db.prepare(`
        INSERT INTO orders (order_number, customer_id, status, subtotal, shipping, total, shipping_address)
        VALUES (?, ?, 'confirmée', ?, 0, ?, ?)
      `).run(orderNumber, customerId, cartTotal, cartTotal, shippingStr);

            const orderId = orderResult.lastInsertRowid;

            const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
        VALUES (?, ?, ?, ?)
      `);

            const updateStock = db.prepare(`
        UPDATE product_variants
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
      `);

            for (const item of cartItems) {
                const itemPrice = item.product.base_price + (item.variant.price_modifier || 0);
                insertItem.run(orderId, item.variant.id, item.quantity, itemPrice);

                const stockResult = updateStock.run(item.quantity, item.variant.id, item.quantity);
                if (stockResult.changes === 0) {
                    throw new Error(`Le produit "${item.product.title}" n'est plus en stock suffisant.`);
                }
            }

            return orderNumber;
        });

        const orderNumber = transaction();

        return NextResponse.json({ success: true, orderNumber });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création de la commande' },
            { status: 500 }
        );
    }
}
