import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
    try {
        const products = db.prepare(`
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `).all();

        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, slug, description, details, category_id, base_price, imageUrl } = body;

        if (!title || !slug || !category_id || !base_price) {
            return NextResponse.json(
                { error: 'Champs obligatoires manquants : title, slug, category_id, base_price' },
                { status: 400 }
            );
        }

        // Vérifier que le slug est unique
        const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
        if (existing) {
            return NextResponse.json(
                { error: `Un produit avec le slug "${slug}" existe déjà.` },
                { status: 409 }
            );
        }

        // Insertion du produit (transaction atomique)
        const insertProduct = db.transaction(() => {
            const result = db.prepare(`
                INSERT INTO products (title, slug, description, details, category_id, base_price)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(title, slug, description || null, details || null, category_id, parseFloat(base_price));

            const productId = result.lastInsertRowid;

            // Si une image a été uploadée, on l'enregistre
            if (imageUrl) {
                db.prepare(`
                    INSERT INTO product_images (product_id, url, alt, is_primary)
                    VALUES (?, ?, ?, 1)
                `).run(productId, imageUrl, title);
            }

            return { id: productId };
        });

        const { id } = insertProduct();

        return NextResponse.json({
            success: true,
            id,
            message: `Produit "${title}" créé avec succès`,
        }, { status: 201 });

    } catch (err) {
        console.error('Erreur création produit:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
