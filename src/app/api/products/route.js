import { NextResponse } from 'next/server';
import { getProducts, createProduct, deleteProduct } from '../../../lib/db';
import { getSession } from '../../../lib/auth';

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const body = await request.json();
        const { title, slug, description, details, category_id, price_per_sqm, base_price, imageUrls, imageUrl, variants } = body;

        if (!title || !slug || !category_id) {
            return NextResponse.json(
                { error: 'Champs obligatoires manquants : title, slug, category_id' },
                { status: 400 }
            );
        }

        // Support both legacy single imageUrl and new imageUrls array
        const urls = imageUrls && imageUrls.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);

        const product = await createProduct({
            title,
            slug,
            description,
            details,
            category_id,
            price_per_sqm: price_per_sqm || 120,
            original_price_per_sqm: (price_per_sqm || 120) * 2,
            base_price: base_price || 0,
            imageUrls: urls,
            variants,
        });

        return NextResponse.json({
            success: true,
            id: product.id,
            message: `Produit "${title}" créé avec succès`,
        }, { status: 201 });

    } catch (err) {
        console.error('Erreur création produit:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID produit requis' }, { status: 400 });
        }

        await deleteProduct(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Erreur suppression produit:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
