import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '../../../lib/db';
import ClientAddToCart from './ClientAddToCart';

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

    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    const otherImages = product.images.filter(img => !img.is_primary);

    return (
        <div className="product-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb container">
                <Link href="/">Accueil</Link>
                <span className="sep">—</span>
                <Link href={`/catalogue?category=${product.category_slug}`}>{product.category_name}</Link>
                <span className="sep">—</span>
                <span>{product.title}</span>
            </nav>

            <div className="container product-layout">
                {/* Gallery */}
                <div className="gallery">
                    <div className="gallery-main">
                        {primaryImage ? (
                            <Image
                                src={primaryImage.url}
                                alt={product.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        ) : (
                            <div className="no-image-placeholder">Image bientôt disponible</div>
                        )}
                        <span className="gallery-badge">Pièce Unique</span>
                    </div>

                    {otherImages.length > 0 && (
                        <div className="gallery-thumbs">
                            {otherImages.map((img, i) => (
                                <div key={i} className="thumb-wrap">
                                    <Image src={img.url} alt={`Vue ${i + 2}`} fill style={{ objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="product-right">
                    <span className="product-category">{product.category_name}</span>
                    <h1 className="product-name">{product.title}</h1>

                    {/* Add to cart */}
                    <ClientAddToCart product={product} />

                    {/* Description */}
                    <div className="product-desc">
                        <p>{product.description}</p>
                    </div>

                    {/* Accordion-style info blocks */}
                    <div className="info-blocks">
                        <div className="info-block">
                            <h4>Matières & Dimensions</h4>
                            <p>Laine de mouton naturelle, non traitée chimiquement. Fibres de haute qualité provenant des troupeaux des montagnes du Haut-Atlas.</p>
                        </div>
                        <div className="info-block">
                            <h4>Entretien</h4>
                            <p>Nettoyage à sec recommandé. Aspiration régulière sans brosse rotative. Éviter l'exposition prolongée au soleil direct.</p>
                        </div>
                        <div className="info-block">
                            <h4>Livraison & Retours</h4>
                            <p>Expédition sous 48h. Retours acceptés sous 30 jours. Livraison offerte dès 300 €.</p>
                        </div>
                        <div className="info-block">
                            <h4>Certificat d'Authenticité</h4>
                            <p>Chaque tapis est accompagné d'un certificat d'authenticité précisant son origine, sa technique de fabrication et son artisane.</p>
                        </div>
                    </div>
                </div>
            </div></div>
    );
}
