import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts, getCategories } from '../lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getFeaturedProducts(8);
  const categories = await getCategories();

  return (
    <div className="home-page-premium">

      {/* ── IMMERSIVE HERO ── */}
      <section className="hero-luxury">
        <div className="hero-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-video"
          >
            <source src="/home_banner_video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay-gradient"></div>
        </div>
        
        <div className="hero-inner container">
          <div className="hero-text-content">
            <span className="hero-label">Artisanat d&apos;Exception</span>
            <h1 className="hero-title-main">
              Tapis Berbères <br /><span>d&apos;Exception</span>
            </h1>
            <p className="hero-description">
              Laissez-vous séduire par les plus belles créations de maîtres artisans marocains.
              Tapis berbère, poufs, coussins et accessoires — expédiés directement du Maroc vers toute l&apos;Europe.
            </p>
            <div className="hero-actions-row">
              <Link href="/catalogue" className="btn-modern-gold">Explorer la Collection</Link>
              <Link href="/about" className="link-underlined">Notre Histoire</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="trust-badges-section">
        <div className="container">
          <div className="trust-badges-grid">
            <div className="trust-badge">
              <div className="trust-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h4>100% Fait à la Main avec Amour</h4>
              <p>Sur un métier à tisser traditionnel</p>
            </div>
            <div className="trust-badge">
              <div className="trust-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" y1="8" x2="2" y2="22" />
                  <line x1="17.5" y1="15" x2="9" y2="15" />
                </svg>
              </div>
              <h4>Tissé avec de la Laine de Mouton Naturelle</h4>
              <p>Récoltée localement</p>
            </div>
            <div className="trust-badge">
              <div className="trust-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 3h12l4 6-10 13L2 9z" />
                  <path d="M2 9h20" />
                  <path d="M10 3l-4 6 6 13 6-13-4-6" />
                </svg>
              </div>
              <h4>Des Tapis Berbères d&apos;Exception</h4>
              <p>Des produits de haute qualité uniquement</p>
            </div>
            <div className="trust-badge">
              <div className="trust-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h4>Fabrication sur Commande</h4>
              <p>Livraison sous 25 jours à domicile</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE PHILOSOPHIE ── */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <span className="section-label">Notre Philosophie</span>
              <h2 className="premium-title">L&apos;Art du <em>Tissage Berbère</em></h2>
              <p>
                Chez Tafokt Rugs, nous croyons que chaque tapis raconte une histoire. Une histoire de traditions 
                transmises de mère en fille depuis des siècles dans les villages reculés du Moyen Atlas et du Haut Atlas marocain.
              </p>
              <p>
                Nos artisanes utilisent des techniques ancestrales — le nouage à la main, le tissage sur métier 
                traditionnel — pour créer des pièces uniques qui portent en elles l&apos;âme de la culture amazighe. 
                Chaque motif géométrique, chaque symbole a une signification profonde : la fertilité, la protection, 
                la liberté, le lien avec la terre.
              </p>
              <p>
                En choisissant un tapis Tafokt, vous ne décorez pas simplement votre intérieur — vous accueillez 
                chez vous un morceau d&apos;histoire millénaire.
              </p>
            </div>
            <div className="philosophy-images">
              <div className="phi-img phi-img-1">
                <Image src="/products/tapis-4-a.jpg" alt="Tapis berbère traditionnel" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="phi-img phi-img-1">
                <Image src="/products/tapis-12-a.jpg" alt="Détail motifs berbères" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ── */}
      <section className="collections-section-premium">
        <div className="container">
          <div className="premium-header">
            <h2 className="premium-title">Nos <em>Collections</em></h2>
            <p>Explorez l&apos;authenticité à travers nos univers de décoration.</p>
          </div>
          
          <div className="new-categories-grid">
            {categories.map((cat, idx) => (
              <Link href={`/catalogue?category=${cat.slug}`} key={cat.id} className={`cat-card-modern ${idx === 0 ? 'large' : ''}`}>
                <div className="cat-img-box">
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <div className="cat-overlay"></div>
                </div>
                <div className="cat-info-overlay">
                  <h3>{cat.name}</h3>
                  <span>Découvrir</span>
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
                <span className="curation-label">Sélection</span>
                <h2 className="curation-title">Pièces du Moment</h2>
             </div>
             <Link href="/catalogue" className="view-all-premium">Voir tout &rarr;</Link>
          </div>

          <div className="premium-products-row">
             {products.map(product => {
               const salePrice = product.variants?.[0]?.price || product.base_price;
               const originalPrice = product.variants?.[0]?.original_price || salePrice * 2;
               const hasDiscount = product.is_on_sale && originalPrice > salePrice;
               
               return (
                <Link href={`/product/${product.slug}`} key={product.id} className="premium-p-card">
                   <div className="p-card-img">
                     {product.image_url && (
                       <Image src={product.image_url} alt={product.title} fill style={{ objectFit: 'cover' }} />
                     )}
                     {hasDiscount && (
                       <span className="discount-badge">-{product.discount_percent}%</span>
                     )}
                   </div>
                   <div className="p-card-meta">
                     <span className="p-card-cat">{product.category_name}</span>
                     <h4>{product.title}</h4>
                     <div className="p-card-price-row">
                       <span className="p-card-price sale">{salePrice.toFixed(0)} €</span>
                       {hasDiscount && (
                         <span className="p-card-price original">{originalPrice.toFixed(0)} €</span>
                       )}
                     </div>
                     <span className="p-card-shipping">Livraison Gratuite</span>
                   </div>
                </Link>
               );
             })}
          </div>
        </div>
      </section>

      {/* ── CUSTOM SIZE CTA ── */}
      <section className="custom-size-cta">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <span className="curation-label">Sur Mesure</span>
              <h2>Votre Tapis, Vos Dimensions</h2>
              <p>
                Chaque tapis peut être fabriqué sur mesure selon vos dimensions exactes.
                Nos artisanes s&apos;adaptent à vos besoins : que ce soit pour un couloir étroit, 
                un grand salon ou une chambre cosy, nous créons la pièce parfaite pour votre espace.
                Entrez vos mesures et obtenez un prix instantané calculé au mètre carré.
              </p>
              <div className="cta-steps">
                <div className="cta-step">
                  <span className="step-num">01</span>
                  <span>Choisissez votre modèle</span>
                </div>
                <div className="cta-step">
                  <span className="step-num">02</span>
                  <span>Entrez vos dimensions</span>
                </div>
                <div className="cta-step">
                  <span className="step-num">03</span>
                  <span>Recevez votre tapis unique</span>
                </div>
              </div>
              <Link href="/catalogue" className="btn-modern-gold">Créer mon tapis sur mesure</Link>
            </div>
            <div className="cta-visual">
              <div className="cta-price-preview">
                <div className="price-formula">
                  <span className="formula-label">Prix au m²</span>
                  <span className="formula-original">240 €</span>
                  <span className="formula-arrow">→</span>
                  <span className="formula-sale">120 €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAVOIR-FAIRE ── */}
      <section className="savoir-faire-section">
        <div className="container">
          <div className="premium-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">Notre Savoir-Faire</span>
            <h2 className="premium-title">De l&apos;Atlas à <em>Votre Intérieur</em></h2>
            <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
              Découvrez les étapes qui transforment la laine brute en une œuvre d&apos;art pour votre maison.
            </p>
          </div>
          <div className="savoir-faire-grid">
            <div className="sf-card">
              <div className="sf-number">01</div>
              <h3>La Tonte &amp; la Laine</h3>
              <p>
                La laine est récoltée à la main sur les moutons des troupeaux de l&apos;Atlas. 
                Elle est ensuite triée, lavée dans les rivières de montagne et séchée au soleil 
                pour obtenir une fibre pure et résistante.
              </p>
            </div>
            <div className="sf-card">
              <div className="sf-number">02</div>
              <h3>La Teinture Naturelle</h3>
              <p>
                Les couleurs proviennent de pigments naturels : safran pour le jaune, henné pour le rouge, 
                indigo pour le bleu, noix pour le brun. Chaque bain de teinture est unique, 
                donnant à la laine des nuances impossibles à reproduire.
              </p>
            </div>
            <div className="sf-card">
              <div className="sf-number">03</div>
              <h3>Le Tissage</h3>
              <p>
                Sur un métier à tisser vertical traditionnel, l&apos;artisane noue chaque fil un à un. 
                Un tapis de taille moyenne nécessite entre 3 et 6 semaines de travail quotidien — 
                un véritable acte de patience et de dévotion.
              </p>
            </div>
            <div className="sf-card">
              <div className="sf-number">04</div>
              <h3>La Finition</h3>
              <p>
                Une fois le tissage terminé, le tapis est lavé, brossé et tondu à la main 
                pour révéler ses motifs dans toute leur beauté. Les franges sont tressées 
                selon la tradition de chaque région.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANDEAU PARALLAX ── */}
      <section className="parallax-banner">
        <div className="parallax-bg">
          <Image src="/products/tapis-10-a.jpg" alt="Tapis berbère en contexte" fill style={{ objectFit: 'cover' }} />
          <div className="parallax-overlay"></div>
        </div>
        <div className="parallax-content container">
          <blockquote>
            &laquo; Chaque nœud tissé à la main porte en lui l&apos;histoire d&apos;une femme, 
            d&apos;une famille, d&apos;une montagne. &raquo;
          </blockquote>
          <p className="parallax-attribution">— Tradition Amazighe</p>
        </div>
      </section>

      {/* ── ARTISAN STORY ── */}
      <section className="story-split-premium">
        <div className="story-txt">
            <div className="story-symbol">&#11579;</div>
            <span className="curation-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Notre Engagement</span>
            <h2 className="story-heading">Préserver un Héritage <br /><em>Millénaire</em></h2>
            <p>
              Depuis des siècles, les Berbères nomades d&apos;Afrique du Nord ont préservé avec fierté une tradition
              ancestrale de création d&apos;objets artisanaux faits à la main. Les femmes amazighes, gardiennes de ce patrimoine,
              insufflent dans chaque création des symboles transmis de génération en génération.
            </p>
            <p>
              En choisissant Tafokt Rugs, vous soutenez directement ces communautés artisanales. 
              Nous travaillons en commerce équitable avec des coopératives féminines du Moyen Atlas 
              et du Haut Atlas, garantissant une rémunération juste et la pérennité de leur savoir-faire.
            </p>
            <Link href="/about" className="btn-secondary">Découvrir notre Histoire</Link>
        </div>
        <div className="story-img-premium">
          <Image
            src="/products/tapis-1-a.png"
            alt="Tissage berbère traditionnel"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ── TYPES DE TAPIS ── */}
      <section className="rug-types-section">
        <div className="container">
          <div className="premium-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Guide</span>
            <h2 className="premium-title">Les Tapis <em>Berbères</em></h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              Chaque région du Maroc produit un style unique, reflet de sa géographie et de ses traditions.
            </p>
          </div>
          <div className="rug-types-grid">
            <div className="rug-type-card">
              <div className="rug-type-img">
                <Image src="/products/tapis-3-a.jpg" alt="Tapis Beni Ouarain" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="rug-type-info">
                <h3>Beni Ouarain</h3>
                <p>
                  Originaires de la tribu éponyme du Moyen Atlas, ces tapis se distinguent par leur fond 
                  blanc crème en laine vierge et leurs motifs géométriques noirs minimalistes. Doux et 
                  épais, ils apportent chaleur et élégance scandinave à tout intérieur.
                </p>
              </div>
            </div>
            <div className="rug-type-card">
              <div className="rug-type-img">
                <Image src="/products/tapis-6-a.jpg" alt="Tapis Azilal" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="rug-type-info">
                <h3>Azilal</h3>
                <p>
                  Venus du Haut Atlas, les tapis Azilal explosent de couleurs vives sur fond blanc. 
                  Chaque pièce est une toile d&apos;art abstraite où se mêlent symboles de fertilité, 
                  losanges protecteurs et lignes en zigzag représentant l&apos;eau et les montagnes.
                </p>
              </div>
            </div>
            <div className="rug-type-card">
              <div className="rug-type-img">
                <Image src="/products/tapis-9-a.jpg" alt="Tapis Kilim" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="rug-type-info">
                <h3>Kilim &amp; Hanbel</h3>
                <p>
                  Tissés à plat (sans nœuds), les kilims berbères sont légers et polyvalents. 
                  Parfaits comme tapis, couvertures murales ou jetés de canapé. Leurs motifs 
                  rayés et géométriques aux couleurs terreuses s&apos;intègrent dans tous les styles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="premium-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Avis Clients</span>
            <h2 className="premium-title">Ce que disent <em>nos clients</em></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p>
                &laquo; Mon tapis Beni Ouarain est absolument magnifique. La qualité est exceptionnelle 
                et les détails du tissage sont incroyables. On sent vraiment le travail artisanal. 
                Il a complètement transformé mon salon ! &raquo;
              </p>
              <div className="testimonial-author">
                <strong>Marie L.</strong>
                <span>Paris, France</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p>
                &laquo; Livraison rapide et tapis conforme aux photos. J&apos;ai commandé un tapis sur mesure 
                pour mon couloir et il est parfait. Le contact avec l&apos;équipe était super réactif 
                et professionnel. Je recommande à 100%. &raquo;
              </p>
              <div className="testimonial-author">
                <strong>Thomas D.</strong>
                <span>Bruxelles, Belgique</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p>
                &laquo; C&apos;est ma troisième commande chez Tafokt Rugs. J&apos;adore savoir que mon achat 
                soutient directement les artisanes au Maroc. Les couleurs sont encore plus belles 
                en vrai qu&apos;en photo. Merci pour cette belle découverte ! &raquo;
              </p>
              <div className="testimonial-author">
                <strong>Sophie M.</strong>
                <span>Genève, Suisse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <span className="section-label">Newsletter</span>
              <h2>Restez Inspirés</h2>
              <p>
                Inscrivez-vous pour recevoir en avant-première nos nouvelles collections, 
                des inspirations déco et des offres exclusives réservées à nos abonnés.
              </p>
            </div>
            <form className="newsletter-form" action="/api/contact" method="POST">
              <input type="email" name="email" placeholder="Votre adresse email" required />
              <button type="submit" className="btn-modern-gold">S&apos;inscrire</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
