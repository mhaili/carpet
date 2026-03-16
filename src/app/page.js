import Link from 'next/link';
import Image from 'next/image';
import db from '../lib/db';
import AmazighSymbol from '../components/AmazighSymbol';

async function getFeaturedProducts() {
  const stmt = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug,
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
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
  'coussins': 'https://images.unsplash.com/photo-1579656335342-5f3b0928e4eb?q=80&w=900&auto=format&fit=crop',
  'plaids': 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=900&auto=format&fit=crop',
  'tableaux': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop',
};

export default async function Home() {
  const products = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <div className="home-page-premium">

      {/* ── LUXURY HERO ── */}
      <section className="hero-luxury">
        <div className="hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=2000&auto=format&fit=crop"
            alt="Intérieur Berbère Luxe"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-overlay-gradient"></div>
        </div>
        
        <div className="hero-inner container">
          <div className="hero-text-content">
            <div className="symbol-intro">
               <AmazighSymbol size={60} animate={true} color="var(--accent-color)" />
            </div>
            <span className="hero-label">Héritage & Artisanat d'Exception</span>
            <h1 className="hero-title-main">
              L'Art de Vivre <br /><span>Berbère</span>
            </h1>
            <p className="hero-description">
              Une collection exclusive de tapis, coussins et objets d'art <br />
              portant l'âme de l'Atlas dans chaque fibre.
            </p>
            <div className="hero-actions-row">
              <Link href="/catalogue" className="btn-modern-gold">Découvrir la Collection</Link>
              <Link href="/about" className="link-underlined">Notre Vision</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ── */}
      <section className="collections-section-premium">
        <div className="container">
          <div className="premium-header">
            <h2 className="premium-title">Nos <em>Universités</em> de Décoration</h2>
            <p>Explorez l'authenticité à travers nos différentes catégories.</p>
          </div>
          
          <div className="new-categories-grid">
            {categories.map((cat, idx) => (
              <Link href={`/catalogue?category=${cat.slug}`} key={cat.id} className={`cat-card-modern ${idx === 0 ? 'large' : ''}`}>
                <div className="cat-img-box">
                  <Image
                    src={categoryImages[cat.slug] || categoryImages['kilim']}
                    alt={cat.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="cat-overlay"></div>
                </div>
                <div className="cat-info-overlay">
                  <h3>{cat.name}</h3>
                  <span>Explorer</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="featured-curation">
        <div className="container">
          <div className="flex-header">
             <div>
                <span className="curation-label">Sélection Exclusive</span>
                <h2 className="curation-title">Incontournables du Moment</h2>
             </div>
             <Link href="/catalogue" className="view-all-premium">Tout Voir —</Link>
          </div>

          <div className="premium-products-row">
             {products.map(product => (
               <Link href={`/product/${product.slug}`} key={product.id} className="premium-p-card">
                  <div className="p-card-img">
                    {product.image_url && (
                      <Image src={product.image_url} alt={product.title} fill style={{ objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className="p-card-meta">
                    <h4>{product.title}</h4>
                    <span className="p-card-cat">{product.category_name}</span>
                    <p className="p-card-price">{product.base_price.toFixed(2)} €</p>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* ── ARTISAN STORY with Yaz Symbol Background ── */}
      <section className="story-split-premium">
        <div className="story-txt container">
            <div className="story-symbol">ⵣ</div>
            <h2 className="story-heading">Un Engagement pour la <br /><em>Préservation</em></h2>
            <p>
              Chaque motif tissé, chaque symbole tracé raconte une histoire millénaire. 
              En choisissant AmazighArtes, vous ne décorez pas seulement votre intérieur, 
              vous préservez un héritage culturel et soutenez l'indépendance des artisanes berbères.
            </p>
            <Link href="/about" className="btn-secondary">L'Histoire d'AmazighArtes</Link>
        </div>
        <div className="story-img-premium">
           <Image 
             src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop" 
             alt="Tissage Berber" 
             fill 
             style={{ objectFit: 'cover' }} 
           />
        </div>
      </section>

    </div>
  );
}
