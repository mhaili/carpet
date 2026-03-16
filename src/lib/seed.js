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
    insertCat.run(1, 'Beni Ouarain', 'beni-ouarain', 'Tapis berbères laine épaisse blanc cassé et motifs géométriques noirs.');
    insertCat.run(2, 'Azilal', 'azilal', 'Tapis marocains aux couleurs vibrantes et motifs asymétriques du Haut Atlas.');
    insertCat.run(3, 'Boucherouite', 'boucherouite', 'Tapis colorés créés à partir de morceaux de tissus recyclés, pièces uniques.');
    insertCat.run(4, 'Kilims', 'kilim', 'Tapis tissés à plat, légers et réversibles aux motifs géométriques.');
    insertCat.run(5, 'Coussins Berbères', 'coussins', 'Coussins en laine Sabra et textiles traditionnels.');
    insertCat.run(6, 'Plaids', 'plaids', 'Plaids faits main en coton et soie de cactus.');
    insertCat.run(7, 'Tableaux Décoratifs', 'tableaux', 'Art mural inspiré des symboles et motifs amazighs.');

    const insertProd = db.prepare('INSERT INTO products (id, title, slug, description, details, category_id, base_price) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const insertImage = db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)');
    const insertVariant = db.prepare('INSERT INTO product_variants (product_id, size, stock, price_modifier) VALUES (?, ?, ?, ?)');

    // --- RUGS ---
    insertProd.run(1, 'Tapis Beni Ouarain Royal', 'tapis-beni-ouarain-royal', 'Magnifique tapis Beni Ouarain noué à la main, laine de mouton naturelle supérieure.', '100% Laine, Fait main', 1, 450);
    insertImage.run(1, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop', 1);
    insertVariant.run(1, '200 x 150 cm', 3, 0);

    // --- COUSSINS ---
    insertProd.run(10, 'Coussin Sabra Or', 'coussin-sabra-or', 'Coussin en soie de cactus brodé à la main, reflets dorés.', 'Soie de cactus, 50x50cm', 5, 45);
    insertImage.run(10, 'https://images.unsplash.com/photo-1579656335342-5f3b0928e4eb?q=80&w=600&auto=format&fit=crop', 1);
    insertVariant.run(10, '50 x 50 cm', 10, 0);

    // --- PLAIDS ---
    insertProd.run(20, 'Plaid Berbère Pompons', 'plaid-berbere-pompons', 'Plaid en coton lourd avec pompons traditionnels noirs.', 'Coton, 200x300cm', 6, 85);
    insertImage.run(20, 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=600&auto=format&fit=crop', 1);
    insertVariant.run(20, 'Standard', 5, 0);

    // --- TABLEAUX ---
    insertProd.run(30, 'Tableau Symbole Yaz ⵣ', 'tableau-yaz-art', 'Oeuvre murale représentant le symbole de la liberté Amazigh.', 'Peinture sur toile, 60x80cm', 7, 120);
    insertImage.run(30, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop', 1);
    insertVariant.run(30, '60 x 80 cm', 2, 0);

    // Admin Account
    const hash = bcrypt.hashSync('Admin1234!', 10);
    db.prepare('INSERT INTO customers (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)').run('admin@amazigh.com', hash, 'Admin', 'AmazighArtes');

    console.log('Database seeded with multiple product types successfully.');
};

seed();
