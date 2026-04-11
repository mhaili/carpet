/**
 * Seed Supabase with initial data (categories, products, admin)
 * Run AFTER creating tables via SQL Editor
 * Usage: node scripts/seed-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { hash } from 'bcryptjs';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE env vars in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
});

async function main() {
    console.log('Seeding Supabase...\n');

    // 1. Verify tables exist
    const { error: testErr } = await supabase.from('categories').select('id').limit(1);
    if (testErr) {
        console.error('Table "categories" not found. Did you run the SQL migration first?');
        console.error(testErr.message);
        process.exit(1);
    }
    console.log('Tables OK\n');

    // 2. Categories
    const categories = [
        { name: 'Tapis Berbère Shaggy', slug: 'tapis-shaggy', description: 'Tapis berbères Beni Ouarain moelleux à poils longs, tissés à la main en laine naturelle.' },
        { name: 'Tapis Berbère Vintage', slug: 'tapis-vintage', description: 'Tapis berbères vintage authentiques avec des motifs tribaux uniques et des couleurs naturelles.' },
        { name: 'Tapis Kilim', slug: 'tapis-kilim', description: 'Tapis kilim berbères tissés à plat avec des motifs géométriques colorés.' },
        { name: 'Tapis de Couloir', slug: 'tapis-couloir', description: 'Tapis berbères longs et étroits, parfaits pour les couloirs et entrées.' },
        { name: 'Coussins Berbères', slug: 'coussins', description: 'Coussins en laine et soie de cactus, fait main au Maroc.' },
        { name: 'Poufs Berbères', slug: 'poufs', description: 'Poufs marocains en cuir et en laine, handmade.' },
    ];

    const { data: catData, error: catErr } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'slug' })
        .select();

    if (catErr) { console.error('Categories error:', catErr.message); process.exit(1); }
    console.log(`${catData.length} categories OK`);

    const catMap = {};
    for (const c of catData) catMap[c.slug] = c.id;

    // 3. Products with variants
    const products = [
        {
            title: 'Rabab - Tapis Berbère Shaggy',
            slug: 'rabab-tapis-berbere-shaggy',
            description: 'Le tapis Rabab est un magnifique tapis Beni Ouarain fait main à partir de laine 100% naturelle. Ses motifs losanges distinctifs et sa texture moelleuse en font une pièce maîtresse pour tout intérieur.',
            details: 'Laine de mouton 100% naturelle. Noué à la main par les artisanes de la tribu Beni Ouarain dans le Moyen Atlas marocain. Épaisseur ~25mm.',
            category_id: catMap['tapis-shaggy'],
            is_custom_size: true,
            price_per_sqm: 120, original_price_per_sqm: 240, base_price: 330,
            variants: [
                { size: '120 x 170 cm', width_cm: 120, height_cm: 170, price: 330, original_price: 660, stock: 10 },
                { size: '150 x 200 cm', width_cm: 150, height_cm: 200, price: 490, original_price: 980, stock: 10 },
                { size: '160 x 230 cm', width_cm: 160, height_cm: 230, price: 590, original_price: 1180, stock: 10 },
                { size: '200 x 300 cm', width_cm: 200, height_cm: 300, price: 890, original_price: 1780, stock: 10 },
                { size: '250 x 300 cm', width_cm: 250, height_cm: 300, price: 1090, original_price: 2180, stock: 10 },
                { size: '300 x 400 cm', width_cm: 300, height_cm: 400, price: 1690, original_price: 3380, stock: 10 },
            ],
        },
        {
            title: 'Jannah - Tapis Berbère Shaggy',
            slug: 'jannah-tapis-berbere-shaggy',
            description: 'Le tapis Jannah offre une douceur incomparable avec son design minimaliste en laine naturelle ivoire rehaussé de motifs géométriques subtils.',
            details: 'Laine de mouton 100% naturelle. Tissage traditionnel Beni Ouarain. Épaisseur ~25mm. Couleur : Ivoire / Noir.',
            category_id: catMap['tapis-shaggy'],
            is_custom_size: true,
            price_per_sqm: 120, original_price_per_sqm: 240, base_price: 330,
            variants: [
                { size: '120 x 170 cm', width_cm: 120, height_cm: 170, price: 330, original_price: 660, stock: 10 },
                { size: '150 x 200 cm', width_cm: 150, height_cm: 200, price: 490, original_price: 980, stock: 10 },
                { size: '160 x 230 cm', width_cm: 160, height_cm: 230, price: 590, original_price: 1180, stock: 10 },
                { size: '200 x 300 cm', width_cm: 200, height_cm: 300, price: 890, original_price: 1780, stock: 10 },
                { size: '250 x 300 cm', width_cm: 250, height_cm: 300, price: 1090, original_price: 2180, stock: 10 },
                { size: '300 x 400 cm', width_cm: 300, height_cm: 400, price: 1690, original_price: 3380, stock: 10 },
            ],
        },
        {
            title: 'Salma - Tapis Berbère Shaggy',
            slug: 'salma-tapis-berbere-shaggy',
            description: 'Salma incarne l\'élégance du Beni Ouarain avec ses lignes épurées et sa laine ivoire d\'une douceur exceptionnelle.',
            details: 'Laine naturelle. Beni Ouarain. Épaisseur ~25mm.',
            category_id: catMap['tapis-shaggy'],
            is_custom_size: true,
            price_per_sqm: 120, original_price_per_sqm: 240, base_price: 330,
            variants: [
                { size: '120 x 170 cm', width_cm: 120, height_cm: 170, price: 330, original_price: 660, stock: 10 },
                { size: '150 x 200 cm', width_cm: 150, height_cm: 200, price: 490, original_price: 980, stock: 10 },
                { size: '200 x 300 cm', width_cm: 200, height_cm: 300, price: 890, original_price: 1780, stock: 10 },
                { size: '300 x 400 cm', width_cm: 300, height_cm: 400, price: 1690, original_price: 3380, stock: 10 },
            ],
        },
        {
            title: 'Nouriya Rose - Tapis Berbère Shaggy',
            slug: 'nouriya-tapis-berbere-shaggy',
            description: 'Nouriya apporte une touche de couleur avec ses teintes rosées subtiles sur fond de laine naturelle.',
            details: 'Laine naturelle teintée. Beni Ouarain. Épaisseur ~25mm.',
            category_id: catMap['tapis-shaggy'],
            is_custom_size: true,
            price_per_sqm: 120, original_price_per_sqm: 240, base_price: 330,
            variants: [
                { size: '120 x 170 cm', width_cm: 120, height_cm: 170, price: 330, original_price: 660, stock: 10 },
                { size: '150 x 200 cm', width_cm: 150, height_cm: 200, price: 490, original_price: 980, stock: 10 },
                { size: '200 x 300 cm', width_cm: 200, height_cm: 300, price: 890, original_price: 1780, stock: 10 },
            ],
        },
        {
            title: 'Sadika - Tapis Berbère Vintage',
            slug: 'sadika-tapis-berbere-vintage',
            description: 'Le tapis Sadika est une pièce vintage unique avec ses motifs tribaux colorés et sa patine naturelle.',
            details: 'Laine naturelle teintée pigments naturels. Pièce unique vintage.',
            category_id: catMap['tapis-vintage'],
            is_custom_size: false,
            price_per_sqm: 160, original_price_per_sqm: 320, base_price: 1230,
            variants: [
                { size: '189 x 274 cm', width_cm: 189, height_cm: 274, price: 1230, original_price: 2460, stock: 1 },
            ],
        },
        {
            title: 'Anna - Tapis Berbère Vintage',
            slug: 'anna-tapis-berbere-vintage',
            description: 'Anna est un tapis vintage majestueux aux tons chauds, parfait pour apporter caractère et profondeur.',
            details: 'Pièce unique vintage. Laine naturelle. Patine authentique.',
            category_id: catMap['tapis-vintage'],
            is_custom_size: false,
            price_per_sqm: 160, original_price_per_sqm: 320, base_price: 1470,
            variants: [
                { size: '190 x 327 cm', width_cm: 190, height_cm: 327, price: 1470, original_price: 2940, stock: 1 },
            ],
        },
        {
            title: 'Haydar - Tapis Berbère Vintage',
            slug: 'haydar-tapis-berbere-vintage',
            description: 'Haydar est un tapis vintage aux motifs géométriques forts et aux couleurs terreuses.',
            details: 'Pièce unique vintage. Laine naturelle.',
            category_id: catMap['tapis-vintage'],
            is_custom_size: false,
            price_per_sqm: 160, original_price_per_sqm: 320, base_price: 1020,
            variants: [
                { size: '161 x 263 cm', width_cm: 161, height_cm: 263, price: 1020, original_price: 2040, stock: 1 },
            ],
        },
        {
            title: 'Anass - Tapis Berbère De Couloir',
            slug: 'anass-tapis-berbere-couloir',
            description: 'Tapis de couloir berbère shaggy en laine naturelle, idéal pour habiller vos entrées et couloirs.',
            details: 'Laine 100% naturelle. Tissage Beni Ouarain. Idéal couloirs et entrées.',
            category_id: catMap['tapis-couloir'],
            is_custom_size: true,
            price_per_sqm: 120, original_price_per_sqm: 240, base_price: 230,
            variants: [
                { size: '80 x 200 cm', width_cm: 80, height_cm: 200, price: 230, original_price: 460, stock: 10 },
                { size: '80 x 300 cm', width_cm: 80, height_cm: 300, price: 340, original_price: 680, stock: 10 },
                { size: '100 x 300 cm', width_cm: 100, height_cm: 300, price: 430, original_price: 860, stock: 10 },
            ],
        },
        {
            title: 'Fahd - Tapis Berbère De Couloir',
            slug: 'fahd-tapis-berbere-couloir',
            description: 'Fahd est un runner berbère élégant avec des motifs diamants classiques sur laine ivoire.',
            details: 'Laine naturelle. Tissage traditionnel.',
            category_id: catMap['tapis-couloir'],
            is_custom_size: true,
            price_per_sqm: 120, original_price_per_sqm: 240, base_price: 230,
            variants: [
                { size: '80 x 200 cm', width_cm: 80, height_cm: 200, price: 230, original_price: 460, stock: 10 },
                { size: '80 x 300 cm', width_cm: 80, height_cm: 300, price: 340, original_price: 680, stock: 10 },
                { size: '100 x 300 cm', width_cm: 100, height_cm: 300, price: 430, original_price: 860, stock: 10 },
            ],
        },
        {
            title: 'Azman - Tapis Berbère Kilim Exclusif',
            slug: 'azman-tapis-berbere-kilim',
            description: 'Le kilim Azman est tissé à plat avec des motifs géométriques berbères exclusifs.',
            details: 'Tissage kilim à plat. Laine et coton naturels.',
            category_id: catMap['tapis-kilim'],
            is_custom_size: true,
            price_per_sqm: 100, original_price_per_sqm: 200, base_price: 590,
            variants: [
                { size: '150 x 200 cm', width_cm: 150, height_cm: 200, price: 400, original_price: 800, stock: 10 },
                { size: '200 x 300 cm', width_cm: 200, height_cm: 300, price: 590, original_price: 1180, stock: 10 },
                { size: '250 x 350 cm', width_cm: 250, height_cm: 350, price: 890, original_price: 1780, stock: 10 },
            ],
        },
        {
            title: 'Coussin Berbère en Laine',
            slug: 'coussin-berbere-laine',
            description: 'Coussin berbère fait main en laine naturelle avec motifs traditionnels.',
            details: 'Laine naturelle. Fait main. Garniture incluse.',
            category_id: catMap['coussins'],
            is_custom_size: false,
            price_per_sqm: 0, original_price_per_sqm: 0, base_price: 45,
            variants: [
                { size: '40 x 40 cm', width_cm: 40, height_cm: 40, price: 35, original_price: 70, stock: 20 },
                { size: '50 x 50 cm', width_cm: 50, height_cm: 50, price: 45, original_price: 90, stock: 20 },
                { size: '60 x 60 cm', width_cm: 60, height_cm: 60, price: 55, original_price: 110, stock: 20 },
            ],
        },
        {
            title: 'Pouf Berbère en Cuir',
            slug: 'pouf-berbere-cuir',
            description: 'Pouf marocain traditionnel en cuir véritable, brodé à la main avec des motifs berbères.',
            details: 'Cuir véritable. Broderie à la main. Livré non rembourré. Diamètre ~50cm.',
            category_id: catMap['poufs'],
            is_custom_size: false,
            price_per_sqm: 0, original_price_per_sqm: 0, base_price: 65,
            variants: [
                { size: 'Standard (50 cm)', width_cm: 50, height_cm: 30, price: 65, original_price: 130, stock: 15 },
                { size: 'Grand (60 cm)', width_cm: 60, height_cm: 35, price: 85, original_price: 170, stock: 15 },
            ],
        },
    ];

    for (const p of products) {
        const { variants, ...productData } = p;

        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', productData.slug)
            .single();

        if (existing) {
            console.log(`  skip "${p.title}" (exists)`);
            continue;
        }

        const { data: prod, error: prodErr } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (prodErr) {
            console.error(`  ERROR "${p.title}":`, prodErr.message);
            continue;
        }

        if (variants?.length) {
            const rows = variants.map(v => ({ product_id: prod.id, ...v }));
            const { error: vErr } = await supabase.from('product_variants').insert(rows);
            if (vErr) console.error(`  variant err "${p.title}":`, vErr.message);
        }

        console.log(`  + "${p.title}" (${variants?.length || 0} variants)`);
    }

    // 4. Admin user
    const adminHash = await hash('admin123', 10);
    const { error: adminErr } = await supabase
        .from('customers')
        .upsert({
            email: 'admin@amazigh.com',
            password_hash: adminHash,
            first_name: 'Admin',
            last_name: 'AmazighArtes',
            role: 'admin',
        }, { onConflict: 'email' });

    if (adminErr) console.error('Admin error:', adminErr.message);
    else console.log('\nAdmin: admin@amazigh.com / admin123');

    console.log('\nDone! Run: npm run dev');
}

main().catch(err => { console.error(err); process.exit(1); });
