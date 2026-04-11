import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getParentCategories, getSubCategories, getCategoryBySlug } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function Catalogue({ searchParams }) {
    const params = await searchParams;
    const categoryFilter = params?.category;
    const regionFilter = params?.region;

    // Get parent categories — Tapis first (produit central), then the rest
    const allParents = await getParentCategories();
    const parentCategories = [
        ...allParents.filter(c => c.slug === 'tapis'),
        ...allParents.filter(c => c.slug !== 'tapis'),
    ];

    // Find active parent category
    const activeParent = parentCategories.find(c => c.slug === categoryFilter);

    // Get sub-categories if viewing a parent with children (e.g. Tapis → regions)
    let subCategories = [];
    if (activeParent) {
        subCategories = await getSubCategories(activeParent.id);
    }

    // Determine which category slug to use for product filtering
    const activeRegion = regionFilter ? subCategories.find(c => c.slug === regionFilter) : null;
    const filterSlug = regionFilter || categoryFilter || null;

    // Get active category for hero display
    const displayCategory = activeRegion || activeParent;

    const products = await getProducts(filterSlug);

    return (
        <div className="catalogue-page">
            {/* Hero Banner */}
            <section className="catalogue-hero">
                {displayCategory ? (
                    <>
                        <div className="catalogue-hero-bg">
                            {displayCategory.image_url && (
                                <Image
                                    src={displayCategory.image_url}
                                    alt={displayCategory.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            )}
                            <div className="catalogue-hero-overlay" />
                        </div>
                        <div className="catalogue-hero-content">
                            <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Collection</span>
                            <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300 }}>
                                {displayCategory.name}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', marginTop: '1rem' }}>
                                {displayCategory.description}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="catalogue-hero-bg">
                            <Image
                                src="/products/tapis-3-a.jpg"
                                alt="Collection tapis berbères"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                            <div className="catalogue-hero-overlay" />
                        </div>
                        <div className="catalogue-hero-content">
                            <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Toute la Collection</span>
                            <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300 }}>
                                Catalogue
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', marginTop: '1rem' }}>
                                Découvrez l&apos;ensemble de nos tapis berbères faits main
                            </p>
                        </div>
                    </>
                )}
            </section>

            <div className="container catalogue-body">
                {/* Main Category Tabs */}
                <nav className="filter-nav">
                    <Link href="/catalogue" className={`filter-link ${!categoryFilter ? 'active' : ''}`}>
                        Tout voir
                    </Link>
                    {parentCategories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/catalogue?category=${cat.slug}`}
                            className={`filter-link ${categoryFilter === cat.slug ? 'active' : ''}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* Sub-category tabs (regions) — shown when a parent with children is active */}
                {subCategories.length > 0 && (
                    <nav className="filter-sub-nav">
                        <Link
                            href={`/catalogue?category=${categoryFilter}`}
                            className={`filter-sub-link ${!regionFilter ? 'active' : ''}`}
                        >
                            Tous les {activeParent?.name}
                        </Link>
                        {subCategories.map(sub => (
                            <Link
                                key={sub.id}
                                href={`/catalogue?category=${categoryFilter}&region=${sub.slug}`}
                                className={`filter-sub-link ${regionFilter === sub.slug ? 'active' : ''}`}
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Results Count */}
                <div className="results-info">
                    <span>{products.length} produit{products.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="no-results">
                        <p>Aucun produit dans cette collection pour l&apos;instant.</p>
                        <Link href="/catalogue" className="btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                            Voir tout le catalogue
                        </Link>
                    </div>
                ) : (
                    <div className="catalogue-grid">
                        {products.map((product) => {
                            const salePrice = product.variants?.[0]?.price || product.base_price;
                            const originalPrice = product.variants?.[0]?.original_price || salePrice * 2;
                            const hasDiscount = product.is_on_sale && originalPrice > salePrice;
                            const firstSize = product.variants?.[0]?.size || '';

                            return (
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
                                        {hasDiscount && (
                                            <span className="badge-discount">-{product.discount_percent}%</span>
                                        )}
                                        {firstSize && (
                                            <span className="badge-size">{firstSize}</span>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <span className="product-category">{product.category_name}</span>
                                        <p className="product-title">{product.title}</p>
                                        <div className="product-price-row">
                                            <span className="product-price sale">À partir de {salePrice.toFixed(0)} €</span>
                                            {hasDiscount && (
                                                <span className="product-price original">{originalPrice.toFixed(0)} €</span>
                                            )}
                                        </div>
                                        <span className="product-shipping-badge">Livraison Gratuite</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div></div>
    );
}
