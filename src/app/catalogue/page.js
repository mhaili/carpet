import Link from 'next/link';
import Image from 'next/image';
import db from '../../lib/db';

const categoryImages = {
    'beni-ouarain': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
    'azilal': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    'boucherouite': 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=600&auto=format&fit=crop',
    'kilim': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=600&auto=format&fit=crop',
    'coussins': 'https://images.unsplash.com/photo-1579656335342-5f3b0928e4eb?q=80&w=600&auto=format&fit=crop',
    'plaids': 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=600&auto=format&fit=crop',
    'tableaux': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
};

async function getProducts(categorySlug) {
    if (categorySlug) {
        return db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
    `).all(categorySlug);
    }
    return db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug,
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `).all();
}

async function getCategories() {
    return db.prepare('SELECT * FROM categories').all();
}

export default async function Catalogue({ searchParams }) {
    const params = await searchParams;
    const categoryFilter = params?.category;

    const products = await getProducts(categoryFilter);
    const categories = await getCategories();

    const activeCategory = categories.find(c => c.slug === categoryFilter);

    return (
        <div className="catalogue-page">
            {/* Hero Banner */}
            <section className="catalogue-hero">
                {activeCategory ? (
                    <>
                        <div className="catalogue-hero-bg">
                            <Image
                                src={categoryImages[activeCategory.slug] || categoryImages['kilim']}
                                alt={activeCategory.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                            <div className="catalogue-hero-overlay" />
                        </div>
                        <div className="catalogue-hero-content">
                            <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Collection</span>
                            <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300 }}>
                                {activeCategory.name}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', marginTop: '1rem' }}>
                                {activeCategory.description}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="catalogue-flat-header container">
                        <span className="section-label">Toute la Collection</span>
                        <h1>Catalogue</h1>
                        <p>Découvrez l'ensemble de nos tapis berbères faits main</p>
                    </div>
                )}
            </section>

            <div className="container catalogue-body">
                {/* Filters / Category Nav */}
                <nav className="filter-nav">
                    <Link href="/catalogue" className={`filter-link ${!categoryFilter ? 'active' : ''}`}>
                        Tout voir
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/catalogue?category=${cat.slug}`}
                            className={`filter-link ${categoryFilter === cat.slug ? 'active' : ''}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* Results Count */}
                <div className="results-info">
                    <span>{products.length} produit{products.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="no-results">
                        <p>Aucun produit dans cette collection pour l'instant.</p>
                        <Link href="/catalogue" className="btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                            Voir tout le catalogue
                        </Link>
                    </div>
                ) : (
                    <div className="catalogue-grid">
                        {products.map((product, index) => (
                            <Link href={`/product/${product.slug}`} key={product.id} className="product-card">
                                <div className="product-image-container">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            Image bientôt disponible
                                        </div>
                                    )}
                                    {index % 3 === 0 && <span className="badge-unique">Pièce Unique</span>}
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{product.category_name}</span>
                                    <p className="product-title">{product.title}</p>
                                    <span className="product-price">À partir de {product.base_price.toFixed(2)} €</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div></div>
    );
}
