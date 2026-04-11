import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '../../../lib/db';
import ClientAddToCart from './ClientAddToCart';

export const dynamic = 'force-dynamic';

async function getProduct(params) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    return await getProductBySlug(slug);
}

export default async function ProductPage({ params }) {
    const product = await getProduct(params);
    if (!product) notFound();

    const allImages = [...(product.images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

    return (
        <div className="premium-product-page">
            <div className="container">
                {/* Breadcrumb */}
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
                            <p>Image bientôt disponible</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Sticky Info */}
                <div className="product-info-sticky">
                    <div className="info-content">
                        {product.is_on_sale && (
                            <span className="product-discount-badge">-{product.discount_percent}%</span>
                        )}
                        <span className="product-label-premium">Pièce Unique d&apos;Artisanat</span>
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
                                    <p>{product.details || 'Tissé à la main à partir de laine de mouton 100% naturelle.'}</p>
                                    <ul className="specs-list">
                                        <li>Origine : Maroc</li>
                                        <li>Prix au m² : {product.price_per_sqm} € (au lieu de {product.original_price_per_sqm} €)</li>
                                        <li>Dimensions : Voir variantes ou sur mesure</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="divider-subtle" />

                            <div className="detail-section">
                                <button className="detail-trigger">
                                    <span>Livraison</span>
                                </button>
                                <div className="detail-panel">
                                    <p><strong>🚚 Livraison Gratuite</strong> vers toute l&apos;Europe.</p>
                                    <p>Expédié directement depuis le Maroc. Délai de livraison : 5 à 10 jours ouvrés.</p>
                                    <p>Retours possibles sous 30 jours.</p>
                                </div>
                            </div>

                            <div className="divider-subtle" />

                            <div className="detail-section">
                                <button className="detail-trigger">
                                    <span>Entretien</span>
                                </button>
                                <div className="detail-panel">
                                    <p>Un tapis berbère gagne en beauté avec le temps. Aspiration sans brosse rotative une fois par semaine.</p>
                                </div>
                            </div>
                        </div>

                        {/* Authenticity Certificate */}
                        <div className="authenticity-seal">
                            <div className="seal-icon">
                                <span style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>ⵣ</span>
                            </div>
                            <div className="seal-text">
                                <h3>Sceau d&apos;Authenticité</h3>
                                <p>Certifié fait main par des artisanes berbères du Maroc.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
