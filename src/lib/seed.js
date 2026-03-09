import db from './db.js';

const seed = () => {
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
    insertCat.run(1, 'Beni Ouarain', 'beni-ouarain', 'Tapis berbères caractérisés par leur laine épaisse blanc cassé et leurs motifs géométriques en losanges bruns ou noirs.');
    insertCat.run(2, 'Azilal', 'azilal', 'Tapis marocains originaires des montagnes du Haut Atlas, connus pour leurs couleurs vibrantes et leurs motifs asymétriques.');
    insertCat.run(3, 'Boucherouite', 'boucherouite', 'Tapis colorés créés à partir de morceaux de tissus recyclés (coton, nylon, laine), uniques et expressifs.');
    insertCat.run(4, 'Kilim', 'kilim', 'Tapis tissés à plat, sans velours, légers et réversibles, avec des motifs souvent géométriques complexes.');

    // Specific product insertion logic
    const insertProd = db.prepare('INSERT INTO products (id, title, slug, description, category_id, base_price) VALUES (?, ?, ?, ?, ?, ?)');
    const insertImage = db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)');
    const insertVariant = db.prepare('INSERT INTO product_variants (product_id, size, stock, price_modifier) VALUES (?, ?, ?, ?)');

    // Product 1
    insertProd.run(1, 'Tapis Beni Ouarain Authentique', 'tapis-beni-ouarain-authentique', 'Magnifique tapis Beni Ouarain noué à la main, laine de mouton naturelle, motifs losanges classiques.', 1, 450);
    insertImage.run(1, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop', 1);
    insertVariant.run(1, '150 x 100 cm', 5, 0);
    insertVariant.run(1, '200 x 150 cm', 3, 200);
    insertVariant.run(1, '300 x 200 cm', 1, 550);

    // Product 2
    insertProd.run(2, 'Tapis Azilal Coloré', 'tapis-azilal-colore', 'Un éclat de couleurs pour votre salon avec ce tapis Azilal aux symboles traditionnels berbères tissés à la main.', 2, 380);
    insertImage.run(2, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', 1);
    insertVariant.run(2, '200 x 150 cm', 4, 0);
    insertVariant.run(2, '250 x 150 cm', 2, 100);

    // Product 3
    insertProd.run(3, 'Tapis Boucherouite Vintage', 'tapis-boucherouite-vintage', 'Éco-responsable et vibrant, ce tapis Boucherouite est composé de textiles recyclés. Pièce unique.', 3, 290);
    insertImage.run(3, 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=800&auto=format&fit=crop', 1);
    insertVariant.run(3, '180 x 120 cm (Pièce Unique)', 1, 0);

    // Product 4
    insertProd.run(4, 'Grand Kilim Amazigh', 'grand-kilim-amazigh', 'Tapis kilim fin et élégant, parfait pour une salle à manger ou un couloir, motifs géométriques rouge et ocre.', 4, 320);
    insertImage.run(4, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop', 1);
    insertVariant.run(4, '250 x 150 cm', 5, 0);
    insertVariant.run(4, '300 x 200 cm', 2, 150);

    console.log('Database seeded successfully.');
};

seed();
