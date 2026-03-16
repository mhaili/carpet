import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '../../../lib/db';
import ClientAddToCart from './ClientAddToCart';
import AmazighSymbol from '../../../components/AmazighSymbol';

export async function generateStaticParams() {
  const products = db.prepare('SELECT slug FROM products').all();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

async function getProduct(slug) {
    const params = await slug;
    const resolvedSlug = params.slug;

    const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(resolvedSlug);

    if (!product) return null;

    const images = db.prepare('SELECT url, is_primary FROM product_images WHERE product_id = ?').all(product.id);
    const variants = db.prepare('SELECT id, size, color, price_modifier, stock FROM product_variants WHERE product_id = ?').all(product.id);

    return { ...product, images, variants };
}

export default async function ProductPage({ params }) {
    const product = await getProduct(params);
    if (!product) notFound();

    const allImages = product.images.sort((a, b) => (b.is_primary - a.is_primary));

    return (
        <div className="premium-product-page">
            <div className="container">
                {/* Breadcrumb - Subtle & Elegant */}
                <nav className="breadcrumb-premium">
                    <Link href="/">Accueil</Link>
                    <span className="sep">/</span>
                    <Link href={`/catalogue?category=${product.category_slug}`}>{product.category_name}</Link>
                    <span className="sep">/</span>
                    <span className="current">{product.title}</span>
                </nav>
            </div>

            <div className="product-split-layout">
                {/* Left Side: Scrollable Gallery */}
                <div className="product-gallery-scroll">
                    {allImages.length > 0 ? (
                        allImages.map((img, i) => (
                            <div key={i} className="gallery-item">
                                <Image
                                    src={img.url}
                                    alt={`${product.title} - vue ${i + 1}`}
                                    width={1200}
                                    height={1600}
                                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                                    priority={i === 0}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="no-image-full">
                            <AmazighSymbol size={80} opacity={0.1} />
                            <p>Image bientôt disponible</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Sticky Info */}
                <div className="product-info-sticky">
                    <div className="info-content">
                        <span className="product-label-premium">Pièce Unique d'Artisanat</span>
                        <h1 className="product-title-premium">{product.title}</h1>
                        <p className="product-category-name">{product.category_name}</p>

                        <div className="product-actions-premium">
                             <ClientAddToCart product={product} />
                        </div>

                        <div className="product-details-premium">
                            <div className="detail-section">
                                <button className="detail-trigger">
                                    <span>Description</span>
                                </button>
                                <div className="detail-panel">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            <div className="divider-subtle" />

                            <div className="detail-section">
                                <button className="detail-trigger">
                                    <span>Matières & Dimensions</span>
                                </button>
                                <div className="detail-panel">
                                    <p>Tissé à la main à partir de <strong>laine de mouton 100% naturelle</strong>. Fibres sélectionnées pour leur douceur et leur durabilité exceptionnelle.</p>
                                    <ul className="specs-list">
                                        <li>Origine : Moyen Atlas, Maroc</li>
                                        <li>Épaisseur : ~25mm (Shaggy)</li>
                                        <li>Dimensions : Voir variantes sélectionnées</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="divider-subtle" />

                            <div className="detail-section">
                                <button className="detail-trigger">
                                    <span>Entretien</span>
                                </button>
                                <div className="detail-panel">
                                    <p>Un tapis berbère gagne en beauté avec le temps. Nous recommandons un brossage léger ou une aspiration sans brosse rotative une fois par semaine.</p>
                                </div>
                            </div>

                            <div className="divider-subtle" />

                            <div className="detail-section">
                                <button className="detail-trigger">
                                    <span>Expédition & Retours</span>
                                </button>
                                <div className="detail-panel">
                                    <p>Livraison sécurisée avec suivi. Expédié sous 2 à 4 jours ouvrés. Retours possibles sous 30 jours.</p>
                                </div>
                            </div>
                        </div>

                        {/* Authenticity Certificate / Seal */}
                        <div className="authenticity-seal">
                            <div className="seal-icon">
                                <AmazighSymbol size={40} animate={false} color="var(--accent-color)" />
                            </div>
                            <div className="seal-text">
                                <h3>Sceau d'Authenticité</h3>
                                <p>Certifié fait main par des artisanes de la guilde AmazighArtes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
