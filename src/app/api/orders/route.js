import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { createOrder, getOrdersByCustomer, getAllOrders, updateOrderStatus, getVariantById, getProductById } from '../../../lib/db';

function generateOrderNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CMD-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        let orders;
        if (session.user.role === 'admin') {
            orders = await getAllOrders();
        } else {
            orders = await getOrdersByCustomer(session.user.id);
        }

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { orderId, status } = await request.json();
        const validStatuses = ['en attente', 'confirmée', 'en préparation', 'expédiée', 'livrée', 'annulée'];

        if (!orderId || !status) {
            return NextResponse.json({ error: 'orderId et status requis' }, { status: 400 });
        }

        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        await updateOrderStatus(orderId, status);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession();
        const customerId = session?.user?.id || null;

        const { cartItems, shippingInfo, paymentIntentId, paymentMethod } = await request.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
        }

        if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
            return NextResponse.json({ error: 'Informations de livraison incomplètes' }, { status: 400 });
        }

        const orderNumber = generateOrderNumber();
        let serverTotal = 0;
        const orderItems = [];

        for (const item of cartItems) {
            const isCustom = String(item.variant.id).startsWith('custom-');

            if (isCustom) {
                // Custom size — use the price_per_sqm calculation
                const product = await getProductById(item.product.id);
                if (!product) {
                    return NextResponse.json({ error: `Produit introuvable (id: ${item.product.id})` }, { status: 400 });
                }
                // The custom price is already calculated client-side from price_per_sqm
                const itemPrice = item.variant.price || (item.product.base_price + (item.variant.price_modifier || 0));
                serverTotal += itemPrice * item.quantity;
                orderItems.push({
                    product_id: item.product.id,
                    variant_id: null,
                    product_title: product.title,
                    variant_size: item.variant.size,
                    quantity: item.quantity,
                    price_at_time: itemPrice,
                });
            } else {
                const variant = await getVariantById(item.variant.id);
                if (!variant) {
                    return NextResponse.json({ error: `Variante introuvable (id: ${item.variant.id})` }, { status: 400 });
                }
                const itemPrice = variant.price;
                serverTotal += itemPrice * item.quantity;
                orderItems.push({
                    product_id: item.product.id,
                    variant_id: item.variant.id,
                    product_title: item.product.title,
                    variant_size: variant.size,
                    quantity: item.quantity,
                    price_at_time: itemPrice,
                });
            }
        }

        const order = await createOrder({
            orderNumber,
            customerId,
            subtotal: serverTotal,
            shipping: 0, // Shipping is included in price
            total: serverTotal,
            shippingAddress: shippingInfo,
            paymentMethod: paymentMethod || 'card',
            stripePaymentId: paymentIntentId || null,
            items: orderItems,
        });

        return NextResponse.json({ success: true, orderNumber });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création de la commande' },
            { status: 500 }
        );
    }
}
