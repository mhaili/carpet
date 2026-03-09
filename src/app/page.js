import Link from 'next/link';
import Image from 'next/image';
import db from '../lib/db';

async function getFeaturedProducts() {
  const stmt = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug,
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LIMIT 6
  `);
  return stmt.all();
}

async function getCategories() {
  const stmt = db.prepare('SELECT * FROM categories');
  return stmt.all();
}

const categoryImages = {
  'beni-ouarain': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop',
  'azilal': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=900&auto=format&fit=crop',
  'boucherouite': 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=900&auto=format&fit=crop',
  'kilim': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop',
};

export default async function Home() {
  const products = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-image-side">
          <Image
            src="https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1400&auto=format&fit=crop"
            alt="Tapis berbère dans un intérieur"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="hero-content-side">
          <span className="section-label">Artisanat Marocain depuis des générations</span>
          <h1 className="hero-title">
            L'Élégance<br /><em>Berbère</em><br />Authentique
          </h1>
          <p className="hero-subtitle">
            Chaque tapis est une œuvre unique, tissé à la main dans les montagnes
            de l'Atlas par des artisanes amazighes. Une tradition vivante.
          </p>
          <div className="hero-ctas">
            <Link href="/catalogue" className="btn-primary">Découvrir la Collection</Link>
            <Link href="/about" className="btn-secondary" style={{ marginLeft: '1rem' }}>Notre Histoire</Link>
          </div>
          <div className="hero-trust">
            <div className="trust-item">
              <span className="trust-number">500+</span>
              <span className="trust-label">Pièces vendues</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-number">100%</span>
              <span className="trust-label">Fait main</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-number">30J</span>
              <span className="trust-label">Retours offerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <span className="section-label">Sélection du Moment</span>
            <h2 className="section-title">Nos Dernières <em>Créations</em></h2>
            <p className="section-subtitle">
              Des pièces soigneusement sélectionnées pour leur authenticité et leur beauté.
            </p>
          </div>
          <div className="products-grid">
            {products.map((product, index) => (
              <Link href={`/product/${product.slug}`} key={product.id} className="product-card">
                <div className="product-image-container">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  {/* Pièce Unique badge for odd items */}
                  {index % 2 === 0 && (
                    <span className="badge-unique">Pièce Unique</span>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category_name}</span>
                  <p className="product-title">{product.title}</p>
                  <span className="product-price">À partir de {product.base_price.toFixed(2)} €</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-cta">
            <Link href="/catalogue" className="btn-secondary">Voir Toute la Collection</Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-head">
            <span className="section-label">Collections</span>
            <h2 className="section-title">Explorez nos <em>Univers</em></h2>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link href={`/catalogue?category=${cat.slug}`} key={cat.id} className="category-card-large">
                <div className="category-img-wrap">
                  <Image
                    src={categoryImages[cat.slug] || categoryImages['kilim']}
                    alt={cat.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="category-overlay"></div>
                </div>
                <div className="category-card-info">
                  <h3>{cat.name}</h3>
                  <span className="discover-link">Découvrir →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY / SPLIT ── */}
      <section className="story-section">
        <div className="story-image">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=900&auto=format&fit=crop"
            alt="Artisane berbère tissant un tapis"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="story-content">
          <span className="section-label">Notre Engagement</span>
          <h2 className="section-title">Un Savoir-Faire<br /><em>Transmis</em></h2>
          <p>
            Depuis des générations, les femmes amazighes du Maroc tissent leurs histoires dans
            chaque fil de laine. Nos tapis ne sont pas des produits industriels — ce sont des
            œuvres d'art vivantes, imprégnées de symboles culturels et de savoir-faire ancestral.
          </p>
          <p style={{ marginTop: '1rem' }}>
            En achetant chez Amazigh Artes, vous soutenez directement ces artisanes
            et contribuez à la préservation d'un patrimoine culturel inestimable.
          </p>
          <Link href="/about" className="btn-secondary" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Découvrir l'Histoire
          </Link>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="features-bar">
        <div className="container features-row">
          <div className="feature-item">
            <span className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <div>
              <strong>Authenticité Garantie</strong>
              <span>Certificat fourni avec chaque tapis</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <div>
              <strong>Livraison Rapide</strong>
              <span>Expédition sous 48h dans le monde</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
            </span>
            <div>
              <strong>Retours 30 Jours</strong>
              <span>Satisfait ou remboursé, sans condition</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <div>
              <strong>Commerce Équitable</strong>
              <span>Artisanes rémunérées justement</span>
            </div>
          </div>
        </div>
      </section></div>
  );
}
