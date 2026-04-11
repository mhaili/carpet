/**
 * Setup Supabase tables for AmazighArtes
 * Run: node scripts/setup-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
});

const MIGRATION_SQL = `
-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    details TEXT,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    price_per_sqm NUMERIC(10,2) DEFAULT 120,
    original_price_per_sqm NUMERIC(10,2) DEFAULT 240,
    base_price NUMERIC(10,2) DEFAULT 0,
    discount_percent INTEGER DEFAULT 50,
    is_on_sale BOOLEAN DEFAULT true,
    is_custom_size BOOLEAN DEFAULT false,
    delivery_weeks TEXT DEFAULT '10 à 12 semaines',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCT IMAGES
-- =============================================
CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false
);

-- =============================================
-- PRODUCT VARIANTS (predefined sizes with prices)
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    width_cm INTEGER,
    height_cm INTEGER,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10,2) DEFAULT 0,
    stock INTEGER DEFAULT 10
);

-- =============================================
-- CUSTOMERS
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'en attente',
    subtotal NUMERIC(10,2) NOT NULL,
    shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    shipping_address JSONB,
    payment_method TEXT DEFAULT 'card',
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL,
    product_title TEXT,
    variant_size TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC(10,2) NOT NULL
);

-- =============================================
-- CONTACTS (messages from contact form)
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FUNCTION: decrement stock
-- =============================================
CREATE OR REPLACE FUNCTION decrement_stock(vid BIGINT, qty INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE product_variants
    SET stock = stock - qty
    WHERE id = vid AND stock >= qty;
END;
$$ LANGUAGE plpgsql;
`;

async function runMigration() {
    console.log('🚀 Creating Supabase tables...\n');

    const { error } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL });

    if (error) {
        // rpc exec_sql might not exist, fall back to running statements individually
        console.log('⚠️  rpc exec_sql not available, running via REST...');
        
        // We'll use the postgres REST endpoint directly
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ sql: MIGRATION_SQL }),
        });

        if (!response.ok) {
            console.log('⚠️  Cannot run raw SQL via REST. You need to run the SQL manually.');
            console.log('\n📋 Copy the SQL below and paste it in your Supabase Dashboard:');
            console.log('   → Go to: https://supabase.com/dashboard → Your project → SQL Editor\n');
            console.log('─'.repeat(60));
            console.log(MIGRATION_SQL);
            console.log('─'.repeat(60));
            console.log('\n✅ After running the SQL, come back and run: node scripts/seed-supabase.mjs');
            return false;
        }
    }

    console.log('✅ Tables created successfully!');
    return true;
}

async function seedData() {
    console.log('\n🌱 Seeding initial data...\n');

    // --- CATEGORIES ---
    const categories = [
        { name: 'Tapis Berbère Shaggy', slug: 'tapis-shaggy', description: 'Tapis berbères Beni Ouarain moelleux à poils longs, tissés à la main en laine naturelle.' },
        { name: 'Tapis Berbère Vintage', slug: 'tapis-vintage', description: 'Tapis berbères vintage authentiques avec des motifs tribaux uniques et des couleurs naturelles.' },
        { name: 'Tapis Kilim', slug: 'tapis-kilim', description: 'Tapis kilim berbères tissés à plat avec des motifs géométriques colorés.' },
        { name: 'Tapis de Couloir', slug: 'tapis-couloir', description: 'Tapis berbères longs et étroits, parfaits pour les couloirs et entrées.' },
        { name: 'Coussins Berbères', slug: 'coussins', description: 'Coussins en laine et soie de cactus, fait main au Maroc.' },
        { name: 'Poufs Berbères', slug: 'poufs', description: 'Poufs marocains en cuir et en laine, handmade.' },
    ];

    const { data: catData, error: catError } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'slug' })
        .select();

    if (catError) {
        console.error('❌ Error seeding categories:', catError.message);
        return;
    }
    console.log(`✅ ${catData.length} catégories créées`);

    const catMap = {};
    for (const c of catData) catMap[c.slug] = c.id;

    // --- PRODUCTS ---
    const products = [
        {
            title: 'Rabab - Tapis Berbère Shaggy',
            slug: 'rabab-tapis-berbere-shaggy',
            description: 'Le tapis Rabab est un magnifique tapis Beni Ouarain fait main à partir de laine 100% naturelle. Ses motifs losanges distinctifs et sa texture moelleuse en font une pièce maîtresse pour tout intérieur.',
            details: 'Laine de mouton 100% naturelle. Noué à la main par les artisanes de la tribu Beni Ouarain dans le Moyen Atlas marocain. Épaisseur ~25mm.',
            category_id: catMap['tapis-shaggy'],
            is_custom_size: true,
            price_per_sqm: 120,
            original_price_per_sqm: 240,
            base_price: 330,
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
            description: 'Le tapis Jannah offre une douceur incomparable avec son design minimaliste en laine naturelle ivoire rehaussé de motifs géométriques subtils. Parfait pour un intérieur contemporain.',
            details: 'Laine de mouton 100% naturelle. Tissage traditionnel Beni Ouarain. Épaisseur ~25mm. Couleur : Ivoire / Noir.',
            category_id: catMap['tapis-shaggy'],
            is_custom_size: true,
            price_per_sqm: 120,
            original_price_per_sqm: 240,
            base_price: 330,
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
            title: 'Sadika - Tapis Berbère Vintage',
            slug: 'sadika-tapis-berbere-vintage',
            description: 'Le tapis Sadika est une pièce vintage unique avec ses motifs tribaux colorés et sa patine naturelle. Chaque tapis vintage est une véritable œuvre d\'art chargée d\'histoire.',
            details: 'Laine naturelle teintée avec des pigments naturels. Pièce unique vintage. Dimensions uniques.',
            category_id: catMap['tapis-vintage'],
            is_custom_size: false,
            price_per_sqm: 160,
            original_price_per_sqm: 320,
            base_price: 1230,
            variants: [
                { size: '189 x 274 cm', width_cm: 189, height_cm: 274, price: 1230, original_price: 2460, stock: 1 },
            ],
        },
        {
            title: 'Anna - Tapis Berbère Vintage',
            slug: 'anna-tapis-berbere-vintage',
            description: 'Anna est un tapis vintage majestueux aux tons chauds, parfait pour apporter caractère et profondeur à votre espace de vie.',
            details: 'Pièce unique vintage. Laine naturelle. Patine authentique.',
            category_id: catMap['tapis-vintage'],
            is_custom_size: false,
            price_per_sqm: 160,
            original_price_per_sqm: 320,
            base_price: 1470,
            variants: [
                { size: '190 x 327 cm', width_cm: 190, height_cm: 327, price: 1470, original_price: 2940, stock: 1 },
            ],
        },
        {
            title: 'Anass - Tapis Berbère Shaggy De Couloir',
            slug: 'anass-tapis-berbere-couloir',
            description: 'Tapis de couloir berbère shaggy en laine naturelle, idéal pour habiller vos entrées et couloirs avec élégance.',
            details: 'Laine 100% naturelle. Tissage Beni Ouarain. Idéal couloirs et entrées.',
            category_id: catMap['tapis-couloir'],
            is_custom_size: true,
            price_per_sqm: 120,
            original_price_per_sqm: 240,
            base_price: 230,
            variants: [
                { size: '80 x 200 cm', width_cm: 80, height_cm: 200, price: 230, original_price: 460, stock: 10 },
                { size: '80 x 300 cm', width_cm: 80, height_cm: 300, price: 340, original_price: 680, stock: 10 },
                { size: '100 x 300 cm', width_cm: 100, height_cm: 300, price: 430, original_price: 860, stock: 10 },
            ],
        },
        {
            title: 'Azman - Tapis Berbère Kilim Exclusif',
            slug: 'azman-tapis-berbere-kilim',
            description: 'Le kilim Azman est un tapis tissé à plat avec des motifs géométriques berbères exclusifs. Sa finesse et ses couleurs vibrantes en font une pièce d\'exception.',
            details: 'Tissage kilim à plat. Laine et coton naturels. Motifs géométriques traditionnels.',
            category_id: catMap['tapis-kilim'],
            is_custom_size: true,
            price_per_sqm: 100,
            original_price_per_sqm: 200,
            base_price: 590,
            variants: [
                { size: '150 x 200 cm', width_cm: 150, height_cm: 200, price: 400, original_price: 800, stock: 10 },
                { size: '200 x 300 cm', width_cm: 200, height_cm: 300, price: 590, original_price: 1180, stock: 10 },
                { size: '250 x 350 cm', width_cm: 250, height_cm: 350, price: 890, original_price: 1780, stock: 10 },
            ],
        },
        {
            title: 'Coussin Berbère en Laine',
            slug: 'coussin-berbere-laine',
            description: 'Coussin berbère fait main en laine naturelle avec motifs traditionnels. Apportez une touche marocaine authentique à votre décoration.',
            details: 'Laine naturelle. Fait main. Garniture incluse. 50x50 cm.',
            category_id: catMap['coussins'],
            is_custom_size: false,
            price_per_sqm: 0,
            original_price_per_sqm: 0,
            base_price: 45,
            variants: [
                { size: '40 x 40 cm', width_cm: 40, height_cm: 40, price: 35, original_price: 70, stock: 20 },
                { size: '50 x 50 cm', width_cm: 50, height_cm: 50, price: 45, original_price: 90, stock: 20 },
                { size: '60 x 60 cm', width_cm: 60, height_cm: 60, price: 55, original_price: 110, stock: 20 },
            ],
        },
        {
            title: 'Pouf Berbère en Cuir',
            slug: 'pouf-berbere-cuir',
            description: 'Pouf marocain traditionnel en cuir véritable, brodé à la main avec des motifs berbères. Parfait comme assise d\'appoint ou repose-pieds.',
            details: 'Cuir véritable. Broderie à la main. Livré non rembourré (facile à remplir). Diamètre ~50cm.',
            category_id: catMap['poufs'],
            is_custom_size: false,
            price_per_sqm: 0,
            original_price_per_sqm: 0,
            base_price: 65,
            variants: [
                { size: 'Standard (50 cm)', width_cm: 50, height_cm: 30, price: 65, original_price: 130, stock: 15 },
                { size: 'Grand (60 cm)', width_cm: 60, height_cm: 35, price: 85, original_price: 170, stock: 15 },
            ],
        },
    ];

    for (const p of products) {
        const { variants, ...productData } = p;

        // Check if product already exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', productData.slug)
            .single();

        if (existing) {
            console.log(`  ⏩ "${p.title}" existe déjà, ignoré`);
            continue;
        }

        const { data: prod, error: prodError } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (prodError) {
            console.error(`  ❌ Erreur pour "${p.title}":`, prodError.message);
            continue;
        }

        // Insert variants
        if (variants && variants.length > 0) {
            const variantRows = variants.map(v => ({
                product_id: prod.id,
                ...v,
            }));
            const { error: varError } = await supabase.from('product_variants').insert(variantRows);
            if (varError) console.error(`  ⚠️ Erreur variants pour "${p.title}":`, varError.message);
        }

        console.log(`  ✅ "${p.title}" créé avec ${variants?.length || 0} variantes`);
    }

    // --- ADMIN USER ---
    const bcrypt = await import('bcryptjs');
    const adminHash = await bcrypt.hash('admin123', 10);

    const { error: adminError } = await supabase
        .from('customers')
        .upsert({
            email: 'admin@amazigh.com',
            password_hash: adminHash,
            first_name: 'Admin',
            last_name: 'AmazighArtes',
            role: 'admin',
        }, { onConflict: 'email' });

    if (adminError) {
        console.error('⚠️ Erreur admin:', adminError.message);
    } else {
        console.log('✅ Compte admin créé (admin@amazigh.com / admin123)');
    }
}

async function main() {
    console.log('═'.repeat(50));
    console.log('  AmazighArtes — Setup Supabase');
    console.log('═'.repeat(50));
    console.log(`  URL: ${supabaseUrl}\n`);

    const migrationOk = await runMigration();

    if (!migrationOk) {
        console.log('\n⚠️  Run the SQL above in Supabase Dashboard, then run this script again.');
        console.log('   You can also run: node scripts/seed-supabase.mjs  (after creating tables)\n');
        return;
    }

    await seedData();

    console.log('\n═'.repeat(50));
    console.log('  ✅ Setup terminé !');
    console.log('  → Lancez le site avec: npm run dev');
    console.log('═'.repeat(50));
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
