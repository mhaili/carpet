import db from './db.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    console.log('Seeding process started...');

    // Clear existing data
    db.exec(`
        DELETE FROM order_items;
        DELETE FROM orders;
        DELETE FROM customers;
        DELETE FROM product_variants;
        DELETE FROM product_images;
        DELETE FROM products;
        DELETE FROM categories;
    `);

    // Insert Categories
    const insertCat = db.prepare('INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)');
    insertCat.run(1, 'Beni Ouarain', 'beni-ouarain', 'Tapis berbères en laine épaisse, blanc cassé et motifs géométriques noirs.');
    insertCat.run(2, 'Azilal', 'azilal', 'Tapis marocains aux couleurs vibrantes et motifs asymétriques du Haut Atlas.');
    insertCat.run(3, 'Boucherouite', 'boucherouite', 'Tapis colorés créés à partir de morceaux de tissus recyclés, pièces uniques.');
    insertCat.run(4, 'Kilims', 'kilim', 'Tapis tissés à plat, légers et réversibles aux motifs géométriques.');
    insertCat.run(5, 'Coussins Berbères', 'coussins', 'Coussins en laine Sabra et textiles traditionnels.');
    insertCat.run(6, 'Plaids', 'plaids', 'Plaids faits main en coton et soie de cactus.');
    insertCat.run(7, 'Tableaux Décoratifs', 'tableaux', 'Art mural inspiré des symboles et motifs amazighs.');

    const insertProd = db.prepare('INSERT INTO products (id, title, slug, description, details, category_id, base_price) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const insertImage = db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)');
    const insertVariant = db.prepare('INSERT INTO product_variants (product_id, size, stock, price_modifier) VALUES (?, ?, ?, ?)');

    // =============================================
    // TAPIS (Rugs) — 16 products
    // =============================================

    // 1 — Tapis Beni Ouarain Royal (3 images)
    insertProd.run(1, 'Tapis Beni Ouarain Royal', 'tapis-beni-ouarain-royal',
        'Magnifique tapis Beni Ouarain noué à la main, laine de mouton naturelle supérieure. Motifs losanges noirs sur fond ivoire.',
        '100% Laine vierge, Fait main, Moyen Atlas', 1, 450);
    insertImage.run(1, '/products/tapis-1-a.png', 1);
    insertImage.run(1, '/products/tapis-1-b.png', 0);
    insertImage.run(1, '/products/tapis-1-c.png', 0);
    insertVariant.run(1, '150 x 100 cm', 4, 0);
    insertVariant.run(1, '200 x 150 cm', 3, 80);
    insertVariant.run(1, '250 x 200 cm', 2, 180);
    insertVariant.run(1, '300 x 200 cm', 1, 300);

    // 2 — Tapis Azilal Coloré (3 images)
    insertProd.run(2, 'Tapis Azilal Coloré', 'tapis-azilal-colore',
        'Tapis Azilal vibrant aux motifs abstraits multicolores, tissé par les artisanes du Haut Atlas.',
        '100% Laine, Fait main, Haut Atlas', 2, 380);
    insertImage.run(2, '/products/tapis-2-a.jpg', 1);
    insertImage.run(2, '/products/tapis-2-b.jpg', 0);
    insertImage.run(2, '/products/tapis-2-c.jpg', 0);
    insertVariant.run(2, '150 x 100 cm', 3, 0);
    insertVariant.run(2, '200 x 150 cm', 2, 70);
    insertVariant.run(2, '250 x 200 cm', 2, 160);
    insertVariant.run(2, '300 x 200 cm', 1, 280);

    // 3 — Tapis Boucherouite Vintage (3 images)
    insertProd.run(3, 'Tapis Boucherouite Vintage', 'tapis-boucherouite-vintage',
        'Tapis Boucherouite unique composé de textiles recyclés aux couleurs vives. Chaque pièce est un exemplaire unique.',
        'Textiles recyclés, Fait main, Pièce unique', 3, 320);
    insertImage.run(3, '/products/tapis-3-a.jpg', 1);
    insertImage.run(3, '/products/tapis-3-b.jpg', 0);
    insertImage.run(3, '/products/tapis-3-c.jpg', 0);
    insertVariant.run(3, '150 x 100 cm', 2, 0);
    insertVariant.run(3, '200 x 150 cm', 2, 60);
    insertVariant.run(3, '250 x 200 cm', 1, 150);

    // 4 — Tapis Kilim Traditionnel (3 images)
    insertProd.run(4, 'Tapis Kilim Traditionnel', 'tapis-kilim-traditionnel',
        'Kilim tissé à plat, léger et réversible. Motifs géométriques tribaux dans des tons terre.',
        '100% Laine, Tissage plat, Réversible', 4, 280);
    insertImage.run(4, '/products/tapis-4-a.jpg', 1);
    insertImage.run(4, '/products/tapis-4-b.jpg', 0);
    insertImage.run(4, '/products/tapis-4-c.jpg', 0);
    insertVariant.run(4, '150 x 100 cm', 5, 0);
    insertVariant.run(4, '200 x 150 cm', 3, 50);
    insertVariant.run(4, '250 x 200 cm', 2, 120);
    insertVariant.run(4, '300 x 200 cm', 1, 220);

    // 5 — Tapis Beni Ouarain Diamant (3 images)
    insertProd.run(5, 'Tapis Beni Ouarain Diamant', 'tapis-beni-ouarain-diamant',
        'Grand tapis Beni Ouarain avec motif diamant classique. Laine dense et moelleuse, confort exceptionnel.',
        '100% Laine vierge, Fait main, Moyen Atlas', 1, 520);
    insertImage.run(5, '/products/tapis-5-a.jpg', 1);
    insertImage.run(5, '/products/tapis-5-b.jpg', 0);
    insertImage.run(5, '/products/tapis-5-c.jpg', 0);
    insertVariant.run(5, '150 x 100 cm', 3, 0);
    insertVariant.run(5, '200 x 150 cm', 2, 90);
    insertVariant.run(5, '250 x 200 cm', 2, 200);
    insertVariant.run(5, '300 x 250 cm', 1, 350);

    // 6 — Tapis Azilal Crème & Rose (2 images)
    insertProd.run(6, 'Tapis Azilal Crème & Rose', 'tapis-azilal-creme-rose',
        'Tapis Azilal délicat aux teintes crème et rose poudré. Motifs berbères subtils et élégants.',
        '100% Laine, Fait main, Haut Atlas', 2, 420);
    insertImage.run(6, '/products/tapis-6-a.jpg', 1);
    insertImage.run(6, '/products/tapis-6-b.jpg', 0);
    insertVariant.run(6, '150 x 100 cm', 2, 0);
    insertVariant.run(6, '200 x 150 cm', 2, 75);
    insertVariant.run(6, '250 x 200 cm', 1, 170);

    // 7 — Tapis Kilim Berbère Ocre
    insertProd.run(7, 'Tapis Kilim Berbère Ocre', 'tapis-kilim-berbere-ocre',
        'Kilim berbère aux tons ocre et terracotta. Tissage fin et motifs tribaux authentiques.',
        '100% Laine, Tissage plat', 4, 260);
    insertImage.run(7, '/products/tapis-7-a.jpg', 1);
    insertVariant.run(7, '150 x 100 cm', 4, 0);
    insertVariant.run(7, '200 x 150 cm', 3, 45);
    insertVariant.run(7, '250 x 200 cm', 2, 110);

    // 8 — Tapis Boucherouite Arc-en-ciel
    insertProd.run(8, 'Tapis Boucherouite Arc-en-ciel', 'tapis-boucherouite-arc-en-ciel',
        'Tapis Boucherouite explosif de couleurs. Un véritable arc-en-ciel tissé main, pièce de conversation unique.',
        'Textiles recyclés, Fait main', 3, 350);
    insertImage.run(8, '/products/tapis-8-a.jpg', 1);
    insertVariant.run(8, '150 x 100 cm', 2, 0);
    insertVariant.run(8, '200 x 150 cm', 1, 65);

    // 9 — Tapis Beni Ouarain Minimaliste
    insertProd.run(9, 'Tapis Beni Ouarain Minimaliste', 'tapis-beni-ouarain-minimaliste',
        'Tapis Beni Ouarain épuré aux lignes fines et discrètes. Parfait pour un intérieur contemporain.',
        '100% Laine vierge, Fait main', 1, 480);
    insertImage.run(9, '/products/tapis-9-a.jpg', 1);
    insertVariant.run(9, '150 x 100 cm', 3, 0);
    insertVariant.run(9, '200 x 150 cm', 2, 85);
    insertVariant.run(9, '250 x 200 cm', 1, 190);
    insertVariant.run(9, '300 x 200 cm', 1, 310);

    // 10 — Tapis Azilal Symboles Berbères
    insertProd.run(10, 'Tapis Azilal Symboles Berbères', 'tapis-azilal-symboles-berberes',
        'Tapis Azilal orné de symboles berbères traditionnels. Chaque motif raconte une histoire ancestrale.',
        '100% Laine, Fait main, Haut Atlas', 2, 390);
    insertImage.run(10, '/products/tapis-10-a.jpg', 1);
    insertVariant.run(10, '150 x 100 cm', 3, 0);
    insertVariant.run(10, '200 x 150 cm', 2, 70);
    insertVariant.run(10, '250 x 200 cm', 1, 160);

    // 11 — Tapis Kilim Noir & Blanc
    insertProd.run(11, 'Tapis Kilim Noir & Blanc', 'tapis-kilim-noir-blanc',
        'Kilim graphique en noir et blanc. Design contemporain inspiré de motifs tribaux ancestraux.',
        '100% Laine, Tissage plat, Réversible', 4, 300);
    insertImage.run(11, '/products/tapis-11-a.jpg', 1);
    insertVariant.run(11, '150 x 100 cm', 4, 0);
    insertVariant.run(11, '200 x 150 cm', 3, 55);
    insertVariant.run(11, '250 x 200 cm', 2, 130);

    // 12 — Tapis Beni Ouarain Atlas
    insertProd.run(12, 'Tapis Beni Ouarain Atlas', 'tapis-beni-ouarain-atlas',
        'Tapis Beni Ouarain classique aux motifs géométriques de l\'Atlas. Laine épaisse et douce.',
        '100% Laine vierge, Fait main', 1, 500);
    insertImage.run(12, '/products/tapis-12-a.jpg', 1);
    insertVariant.run(12, '150 x 100 cm', 2, 0);
    insertVariant.run(12, '200 x 150 cm', 2, 90);
    insertVariant.run(12, '300 x 200 cm', 1, 320);

    // 13 — Tapis Boucherouite Pastel
    insertProd.run(13, 'Tapis Boucherouite Pastel', 'tapis-boucherouite-pastel',
        'Tapis Boucherouite aux tons pastels délicats. Une touche douce et bohème pour votre intérieur.',
        'Textiles recyclés, Fait main', 3, 290);
    insertImage.run(13, '/products/tapis-13-a.jpg', 1);
    insertVariant.run(13, '150 x 100 cm', 3, 0);
    insertVariant.run(13, '200 x 150 cm', 2, 55);

    // 14 — Tapis Azilal Grand Format
    insertProd.run(14, 'Tapis Azilal Grand Format', 'tapis-azilal-grand-format',
        'Grand tapis Azilal aux dimensions généreuses. Idéal pour habiller un grand salon ou une salle à manger.',
        '100% Laine, Fait main, Haut Atlas', 2, 550);
    insertImage.run(14, '/products/tapis-14-a.jpg', 1);
    insertVariant.run(14, '200 x 150 cm', 2, 0);
    insertVariant.run(14, '250 x 200 cm', 2, 100);
    insertVariant.run(14, '300 x 250 cm', 1, 250);
    insertVariant.run(14, '350 x 300 cm', 1, 400);

    // 15 — Tapis Kilim Terracotta
    insertProd.run(15, 'Tapis Kilim Terracotta', 'tapis-kilim-terracotta',
        'Kilim chaleureux aux teintes terracotta et safran. Tissage fin et motifs losange.',
        '100% Laine, Tissage plat', 4, 270);
    insertImage.run(15, '/products/tapis-15-a.jpg', 1);
    insertVariant.run(15, '150 x 100 cm', 4, 0);
    insertVariant.run(15, '200 x 150 cm', 3, 50);
    insertVariant.run(15, '250 x 200 cm', 1, 120);

    // 16 — Tapis Beni Ouarain Tribal
    insertProd.run(16, 'Tapis Beni Ouarain Tribal', 'tapis-beni-ouarain-tribal',
        'Tapis Beni Ouarain aux motifs tribaux prononcés. Laine dense du Moyen Atlas, authenticité garantie.',
        '100% Laine vierge, Fait main, Moyen Atlas', 1, 470);
    insertImage.run(16, '/products/tapis-16-a.jpg', 1);
    insertVariant.run(16, '150 x 100 cm', 3, 0);
    insertVariant.run(16, '200 x 150 cm', 2, 80);
    insertVariant.run(16, '250 x 200 cm', 1, 180);
    insertVariant.run(16, '300 x 200 cm', 1, 300);

    // =============================================
    // COUSSINS — 3 products
    // =============================================

    // 17 — Coussin Sabra Or
    insertProd.run(17, 'Coussin Sabra Or', 'coussin-sabra-or',
        'Coussin en soie de cactus brodé à la main, reflets dorés. Texture soyeuse unique.',
        'Soie de cactus (Sabra), Fait main', 5, 45);
    insertImage.run(17, '/products/coussin-1-a.jpg', 1);
    insertVariant.run(17, '40 x 40 cm', 10, 0);
    insertVariant.run(17, '50 x 50 cm', 8, 10);
    insertVariant.run(17, '60 x 60 cm', 5, 20);

    // 18 — Coussin Berbère Terracotta
    insertProd.run(18, 'Coussin Berbère Terracotta', 'coussin-berbere-terracotta',
        'Coussin en laine berbère aux tons terracotta chauds. Broderies géométriques traditionnelles.',
        'Laine & Coton, Fait main', 5, 55);
    insertImage.run(18, '/products/coussin-2-a.jpg', 1);
    insertVariant.run(18, '40 x 40 cm', 8, 0);
    insertVariant.run(18, '50 x 50 cm', 6, 12);
    insertVariant.run(18, '60 x 60 cm', 4, 22);

    // 19 — Coussin Kilim Multicolore
    insertProd.run(19, 'Coussin Kilim Multicolore', 'coussin-kilim-multicolore',
        'Coussin réalisé à partir de tissu kilim authentique. Motifs géométriques colorés et vivants.',
        'Laine Kilim, Fait main', 5, 50);
    insertImage.run(19, '/products/coussin-3-a.jpg', 1);
    insertVariant.run(19, '40 x 40 cm', 7, 0);
    insertVariant.run(19, '50 x 50 cm', 5, 10);
    insertVariant.run(19, '60 x 60 cm', 3, 18);

    // =============================================
    // TABLEAUX — 5 products
    // =============================================

    // 20 — Tableau Symbole Yaz ⵣ
    insertProd.run(20, 'Tableau Symbole Yaz ⵣ', 'tableau-yaz-art',
        'Œuvre murale représentant le symbole Yaz, emblème de la liberté Amazigh. Peinture sur toile de qualité.',
        'Peinture acrylique sur toile, Cadre bois', 7, 120);
    insertImage.run(20, '/products/tableau-1-a.jpg', 1);
    insertVariant.run(20, '40 x 60 cm', 5, 0);
    insertVariant.run(20, '60 x 80 cm', 3, 40);
    insertVariant.run(20, '80 x 120 cm', 2, 90);

    // 21 — Tableau Motifs Berbères
    insertProd.run(21, 'Tableau Motifs Berbères', 'tableau-motifs-berberes',
        'Composition artistique de symboles berbères traditionnels. Chaque motif porte une signification ancestrale.',
        'Peinture acrylique sur toile', 7, 140);
    insertImage.run(21, '/products/tableau-2-a.jpg', 1);
    insertVariant.run(21, '40 x 60 cm', 4, 0);
    insertVariant.run(21, '60 x 80 cm', 3, 45);
    insertVariant.run(21, '80 x 120 cm', 2, 100);

    // 22 — Tableau Atlas Abstrait
    insertProd.run(22, 'Tableau Atlas Abstrait', 'tableau-atlas-abstrait',
        'Interprétation abstraite des paysages de l\'Atlas. Palette de couleurs terre et ocre.',
        'Technique mixte sur toile', 7, 160);
    insertImage.run(22, '/products/tableau-3-a.jpg', 1);
    insertVariant.run(22, '40 x 60 cm', 3, 0);
    insertVariant.run(22, '60 x 80 cm', 2, 50);
    insertVariant.run(22, '80 x 120 cm', 1, 110);

    // 23 — Tableau Calligraphie Tifinagh
    insertProd.run(23, 'Tableau Calligraphie Tifinagh', 'tableau-calligraphie-tifinagh',
        'Calligraphie tifinagh élégante sur fond neutre. Hommage à l\'écriture ancestrale amazighe.',
        'Encre & acrylique sur toile', 7, 130);
    insertImage.run(23, '/products/tableau-4-a.jpg', 1);
    insertVariant.run(23, '40 x 60 cm', 5, 0);
    insertVariant.run(23, '60 x 80 cm', 3, 40);
    insertVariant.run(23, '80 x 120 cm', 2, 85);

    // 24 — Tableau Femme Amazighe
    insertProd.run(24, 'Tableau Femme Amazighe', 'tableau-femme-amazighe',
        'Portrait stylisé d\'une femme amazighe avec bijoux et tatouages traditionnels. Célébration de la beauté berbère.',
        'Peinture acrylique sur toile, Cadre bois', 7, 180);
    insertImage.run(24, '/products/tableau-5-a.jpg', 1);
    insertVariant.run(24, '40 x 60 cm', 3, 0);
    insertVariant.run(24, '60 x 80 cm', 2, 55);
    insertVariant.run(24, '80 x 120 cm', 1, 120);

    // =============================================
    // Admin Account
    // =============================================
    const hash = bcrypt.hashSync('Admin1234!', 10);
    db.prepare('INSERT INTO customers (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)').run('admin@amazigh.com', hash, 'Admin', 'AmazighArtes', 'admin');

    console.log('Database seeded with 24 products successfully.');
};

seed();
