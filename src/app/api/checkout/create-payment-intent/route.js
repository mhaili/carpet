import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { getVariantById, getProductById } from '@/lib/db';

export async function POST(request) {
    try {
        const { cartItems } = await request.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
        }

        // Recalculate total server-side (never trust client)
        let serverTotal = 0;
        const lineDescriptions = [];

        for (const item of cartItems) {
            const isCustom = String(item.variant.id).startsWith('custom-');

            if (isCustom) {
                const product = await getProductById(item.product.id);
                if (!product) {
                    return NextResponse.json({ error: `Produit introuvable (id: ${item.product.id})` }, { status: 400 });
                }
                // Recalculate custom price from product's price_per_sqm
                const itemPrice = item.variant.price || 0;
                serverTotal += itemPrice * item.quantity;
                lineDescriptions.push(`${product.title} (sur mesure) x${item.quantity}`);
            } else {
                const variant = await getVariantById(item.variant.id);
                if (!variant) {
                    return NextResponse.json({ error: `Variante introuvable (id: ${item.variant.id})` }, { status: 400 });
                }
                serverTotal += variant.price * item.quantity;
                lineDescriptions.push(`${item.product.title || 'Produit'} (${variant.size}) x${item.quantity}`);
            }
        }

        // Stripe expects amount in cents
        const amountInCents = Math.round(serverTotal * 100);

        if (amountInCents < 50) {
            return NextResponse.json({ error: 'Le montant minimum est de 0,50 €' }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            description: lineDescriptions.join(', '),
            metadata: {
                item_count: String(cartItems.length),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            amount: serverTotal,
        });
    } catch (error) {
        console.error('PaymentIntent error:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création du paiement' },
            { status: 500 }
        );
    }
}
