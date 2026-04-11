/**
 * Seed script to populate Supabase with initial products
 * Run: node --experimental-modules src/lib/seed-supabase.mjs
 * 
 * Or add to package.json scripts: "seed": "node src/lib/seed-supabase.mjs"
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Replace with your Supabase credentials
const SUPABASE_URL = 'https://jivtfyqlpngckhxcnpox.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnRmeXFscG5nY2toeGNucG94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY1Mjc5NywiZXhwIjoyMDg5MjI4Nzk3fQ.NNUu-bWP3lnS0h_UpqDp7ASuZOcALTmNpbvOjIUjEPg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
});

// Price per m² config
const SALE_PRICE_PER_SQM = 120; // €/m²
const ORIGINAL_PRICE_PER_SQM = 240; // €/m² (shown crossed out)

function calcPrice(widthCm, heightCm) {
    const area = (widthCm * heightCm) / 10000;
    return {
        price: Math.round(area * SALE_PRICE_PER_SQM),
        original_price: Math.round(area * ORIGINAL_PRICE_PER_SQM),
    };
}

async function seed() {
    console.log('🌱 Seeding Supabase...');

    // Clear existing data (order matters for FK constraints)
    await supabase.from('order_items').delete().neq('id', 0);
    await supabase.from('orders').delete().neq('id', 0);
    await supabase.from('customers').delete().neq('id', 0);
    await supabase.from('product_variants').delete().neq('id', 0);
    await supabase.from('product_images').delete().neq('id', 0);
    await supabase.from('products').delete().neq('id', 0);
    await supabase.from('categories').delete().neq('id', 0);

    console.log('✅ Cleared existing data');

    // ── Categories ──
    const { data: cats, error: catErr } = await supabase
        .from('categories')
        .insert([
            { name: 'Beni Ouarain', slug: 'beni-ouarain', description: 'Tapis berbères en laine épaisse, blanc cassé et motifs géométriques noirs.' },
            { name: 'Azilal', slug: 'azilal', description: 'Tapis marocains aux couleurs vibrantes et motifs asymétriques du Haut Atlas.' },
            { name: 'Boucherouite', slug: 'boucherouite', description: 'Tapis colorés créés à partir de morceaux de tissus recyclés, pièces uniques.' },
            { name: 'Kilims', slug: 'kilim', description: 'Tapis tissés à plat, légers et réversibles aux motifs géométriques.' },
            { name: 'Boujad', slug: 'boujad', description: 'Tapis aux couleurs vives et motifs expressifs de la région de Boujad.' },
            { name: 'Beni Mrirt', slug: 'beni-mrirt', description: 'Tapis épais et moelleux de la tribu Beni Mrirt, style contemporain.' },
            { name: 'Coussins Berbères', slug: 'coussins', description: 'Coussins en laine Sabra et textiles traditionnels.' },
        ])
        .select();

    if (catErr) { console.error('Category error:', catErr); return; }
    console.log(`✅ ${cats.length} catégories créées`);

    const catMap = {};
    cats.forEach(c => catMap[c.slug] = c.id);

    // ── Products ──
    const productsData = [
        // Beni Ouarain (6 products)
        { title: 'Tapis Beni Ouarain Royal', slug: 'tapis-beni-ouarain-royal', cat: 'beni-ouarain', desc: 'Magnifique tapis Beni Ouarain noué à la main, laine de mouton naturelle. Motifs losanges noirs sur fond ivoire.', details: '100% Laine vierge, Fait main, Moyen Atlas', color: 'blanc', style: 'minimaliste', tribe: 'Beni Ouarain', thickness: 'épais' },
        { title: 'Tapis Beni Ouarain Diamant', slug: 'tapis-beni-ouarain-diamant', cat: 'beni-ouarain', desc: 'Grand tapis Beni Ouarain avec motif diamant classique. Laine dense et moelleuse.', details: '100% Laine vierge, Fait main, Moyen Atlas', color: 'blanc', style: 'géométrique', tribe: 'Beni Ouarain', thickness: 'épais' },
        { title: 'Tapis Beni Ouarain Minimaliste', slug: 'tapis-beni-ouarain-minimaliste', cat: 'beni-ouarain', desc: 'Tapis épuré aux lignes fines et discrètes. Parfait pour un intérieur contemporain.', details: '100% Laine vierge, Fait main', color: 'blanc', style: 'minimaliste', tribe: 'Beni Ouarain', thickness: 'épais' },
        { title: 'Tapis Beni Ouarain Atlas', slug: 'tapis-beni-ouarain-atlas', cat: 'beni-ouarain', desc: 'Tapis classique aux motifs géométriques. Laine épaisse et douce.', details: '100% Laine vierge, Fait main', color: 'noir et blanc', style: 'géométrique', tribe: 'Beni Ouarain', thickness: 'épais' },
        { title: 'Tapis Beni Ouarain Tribal', slug: 'tapis-beni-ouarain-tribal', cat: 'beni-ouarain', desc: 'Motifs tribaux prononcés. Laine dense du Moyen Atlas, authenticité garantie.', details: '100% Laine vierge, Fait main, Moyen Atlas', color: 'noir et blanc', style: 'shaggy', tribe: 'Beni Ouarain', thickness: 'épais' },
        { title: 'Tapis Beni Ouarain Ivoire', slug: 'tapis-beni-ouarain-ivoire', cat: 'beni-ouarain', desc: 'Pure laine ivoire avec motifs discrets. Douceur incomparable.', details: '100% Laine vierge, Fait main', color: 'blanc', style: 'minimaliste', tribe: 'Beni Ouarain', thickness: 'épais' },

        // Azilal (4 products)
        { title: 'Tapis Azilal Coloré', slug: 'tapis-azilal-colore', cat: 'azilal', desc: 'Tapis vibrant aux motifs abstraits multicolores, tissé par les artisanes du Haut Atlas.', details: '100% Laine, Fait main, Haut Atlas', color: 'rose', style: 'boho', tribe: 'Azilal', thickness: 'moyen' },
        { title: 'Tapis Azilal Crème & Rose', slug: 'tapis-azilal-creme-rose', cat: 'azilal', desc: 'Teintes crème et rose poudré. Motifs berbères subtils et élégants.', details: '100% Laine, Fait main, Haut Atlas', color: 'rose', style: 'contemporain', tribe: 'Azilal', thickness: 'moyen' },
        { title: 'Tapis Azilal Symboles Berbères', slug: 'tapis-azilal-symboles-berberes', cat: 'azilal', desc: 'Orné de symboles berbères traditionnels. Chaque motif raconte une histoire.', details: '100% Laine, Fait main, Haut Atlas', color: 'orange', style: 'boho', tribe: 'Azilal', thickness: 'moyen' },
        { title: 'Tapis Azilal Grand Format', slug: 'tapis-azilal-grand-format', cat: 'azilal', desc: 'Grand Azilal aux dimensions généreuses. Idéal pour un grand salon.', details: '100% Laine, Fait main, Haut Atlas', color: 'blanc', style: 'contemporain', tribe: 'Azilal', thickness: 'moyen' },

        // Boucherouite (3 products)
        { title: 'Tapis Boucherouite Vintage', slug: 'tapis-boucherouite-vintage', cat: 'boucherouite', desc: 'Tapis unique composé de textiles recyclés aux couleurs vives. Pièce unique.', details: 'Textiles recyclés, Fait main, Pièce unique', color: 'rouge', style: 'boho', tribe: 'Boucherouite', thickness: 'plat' },
        { title: 'Tapis Boucherouite Arc-en-ciel', slug: 'tapis-boucherouite-arc-en-ciel', cat: 'boucherouite', desc: 'Un véritable arc-en-ciel tissé main, pièce de conversation unique.', details: 'Textiles recyclés, Fait main', color: 'orange', style: 'boho', tribe: 'Boucherouite', thickness: 'plat' },
        { title: 'Tapis Boucherouite Pastel', slug: 'tapis-boucherouite-pastel', cat: 'boucherouite', desc: 'Tons pastels délicats. Une touche douce et bohème.', details: 'Textiles recyclés, Fait main', color: 'rose', style: 'boho', tribe: 'Boucherouite', thickness: 'plat' },

        // Kilims (3 products)
        { title: 'Tapis Kilim Traditionnel', slug: 'tapis-kilim-traditionnel', cat: 'kilim', desc: 'Kilim tissé à plat, léger et réversible. Motifs géométriques tribaux.', details: '100% Laine, Tissage plat, Réversible', color: 'marron', style: 'géométrique', tribe: 'Taznakht', thickness: 'plat' },
        { title: 'Tapis Kilim Berbère Ocre', slug: 'tapis-kilim-berbere-ocre', cat: 'kilim', desc: 'Kilim berbère aux tons ocre et terracotta. Tissage fin.', details: '100% Laine, Tissage plat', color: 'orange', style: 'géométrique', tribe: 'Taznakht', thickness: 'plat' },
        { title: 'Tapis Kilim Noir & Blanc', slug: 'tapis-kilim-noir-blanc', cat: 'kilim', desc: 'Kilim graphique en noir et blanc. Design contemporain tribal.', details: '100% Laine, Tissage plat, Réversible', color: 'noir et blanc', style: 'contemporain', tribe: 'Taznakht', thickness: 'plat' },

        // Boujad (2 products)
        { title: 'Tapis Boujad Rose Vif', slug: 'tapis-boujad-rose-vif', cat: 'boujad', desc: 'Tapis Boujad aux teintes roses éclatantes. Motifs expressifs et vivants.', details: '100% Laine, Fait main, Boujad', color: 'rose', style: 'boho', tribe: 'Boujad', thickness: 'moyen' },
        { title: 'Tapis Boujad Terracotta', slug: 'tapis-boujad-terracotta', cat: 'boujad', desc: 'Magnifique Boujad aux tons terracotta chauds et motifs tribaux.', details: '100% Laine, Fait main, Boujad', color: 'orange', style: 'contemporain', tribe: 'Boujad', thickness: 'moyen' },

        // Beni Mrirt (2 products)
        { title: 'Tapis Beni Mrirt Shaggy', slug: 'tapis-beni-mrirt-shaggy', cat: 'beni-mrirt', desc: 'Tapis ultra-doux et épais. Style shaggy moderne avec motifs discrets.', details: '100% Laine, Fait main, Beni Mrirt', color: 'blanc', style: 'shaggy', tribe: 'Beni Mrirt', thickness: 'épais' },
        { title: 'Tapis Beni Mrirt Gris', slug: 'tapis-beni-mrirt-gris', cat: 'beni-mrirt', desc: 'Tapis Beni Mrirt en teintes grises contemporaines. Texture luxueuse.', details: '100% Laine, Fait main, Beni Mrirt', color: 'gris', style: 'contemporain', tribe: 'Beni Mrirt', thickness: 'épais' },

        // Coussins (3 products)
        { title: 'Coussin Sabra Or', slug: 'coussin-sabra-or', cat: 'coussins', desc: 'Coussin en soie de cactus brodé à la main, reflets dorés.', details: 'Soie de cactus (Sabra), Fait main', color: 'blanc', style: 'minimaliste', tribe: '', thickness: '' },
        { title: 'Coussin Berbère Terracotta', slug: 'coussin-berbere-terracotta', cat: 'coussins', desc: 'Coussin en laine berbère aux tons terracotta. Broderies géométriques.', details: 'Laine & Coton, Fait main', color: 'orange', style: 'boho', tribe: '', thickness: '' },
        { title: 'Coussin Kilim Multicolore', slug: 'coussin-kilim-multicolore', cat: 'coussins', desc: 'Coussin réalisé à partir de tissu kilim authentique. Motifs colorés.', details: 'Laine Kilim, Fait main', color: 'rouge', style: 'boho', tribe: '', thickness: '' },
    ];

    // Variant sizes for rugs
    const rugVariants = [
        { size: '120 x 170 cm', w: 120, h: 170 },
        { size: '150 x 200 cm', w: 150, h: 200 },
        { size: '200 x 300 cm', w: 200, h: 300 },
        { size: '250 x 350 cm', w: 250, h: 350 },
        { size: '300 x 400 cm', w: 300, h: 400 },
    ];

    // Variant sizes for cushions
    const cushionVariants = [
        { size: '40 x 40 cm', w: 40, h: 40, price: 45, original: 90 },
        { size: '50 x 50 cm', w: 50, h: 50, price: 55, original: 110 },
        { size: '60 x 60 cm', w: 60, h: 60, price: 65, original: 130 },
    ];

    for (const p of productsData) {
        const isCushion = p.cat === 'coussins';
        const firstVariant = isCushion ? cushionVariants[0] : rugVariants[0];
        const basePrice = isCushion ? firstVariant.price : calcPrice(firstVariant.w, firstVariant.h).price;

        const { data: product, error: pErr } = await supabase
            .from('products')
            .insert({
                title: p.title,
                slug: p.slug,
                description: p.desc,
                details: p.details,
                category_id: catMap[p.cat],
                price_per_sqm: isCushion ? 0 : SALE_PRICE_PER_SQM,
                original_price_per_sqm: isCushion ? 0 : ORIGINAL_PRICE_PER_SQM,
                base_price: basePrice,
                discount_percent: 50,
                is_on_sale: true,
                color: p.color,
                style: p.style,
                tribe: p.tribe,
                thickness: p.thickness,
            })
            .select()
            .single();

        if (pErr) { console.error(`Product error (${p.title}):`, pErr); continue; }

        // Add variants
        const variants = isCushion
            ? cushionVariants.map(v => ({
                product_id: product.id,
                size: v.size,
                width_cm: v.w,
                height_cm: v.h,
                price: v.price,
                original_price: v.original,
                stock: 10,
            }))
            : rugVariants.map(v => {
                const prices = calcPrice(v.w, v.h);
                return {
                    product_id: product.id,
                    size: v.size,
                    width_cm: v.w,
                    height_cm: v.h,
                    price: prices.price,
                    original_price: prices.original_price,
                    stock: 3,
                };
            });

        await supabase.from('product_variants').insert(variants);

        console.log(`  📦 ${p.title} — ${variants.length} variantes`);
    }

    // ── Admin Account ──
    const hash = bcrypt.hashSync('Admin1234!', 10);
    await supabase.from('customers').insert({
        email: 'admin@amazigh.com',
        password_hash: hash,
        first_name: 'Admin',
        last_name: 'AmazighArtes',
        role: 'admin',
    });

    console.log('✅ Admin account created (admin@amazigh.com / Admin1234!)');
    console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
