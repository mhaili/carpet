'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [form, setForm] = useState({
        title: '',
        slug: '',
        description: '',
        details: '',
        category_id: '',
        base_price: '',
    });

    const [variants, setVariants] = useState([{ size: '', stock: '5', price_modifier: '0' }]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => setCategories([]));
        loadProducts();
    }, []);

    const loadProducts = () => {
        setLoadingProducts(true);
        fetch('/api/products')
            .then(res => res.json())
            .then(data => { setProducts(Array.isArray(data) ? data : []); setLoadingProducts(false); })
            .catch(() => { setProducts([]); setLoadingProducts(false); });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title') {
                updated.slug = value
                    .toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
            }
            return updated;
        });
    };

    const handleVariantChange = (index, field, value) => {
        setVariants(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addVariant = () => {
        setVariants(prev => [...prev, { size: '', stock: '5', price_modifier: '0' }]);
    };

    const removeVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        setImageFiles(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;
        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDelete = async (productId, productTitle) => {
        if (!confirm(`Supprimer "${productTitle}" ? Cette action est irréversible.`)) return;
        try {
            const res = await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur suppression');
            }
            setSubmitStatus({ type: 'success', message: `Produit "${productTitle}" supprimé.` });
            loadProducts();
        } catch (err) {
            setSubmitStatus({ type: 'error', message: err.message });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setSubmitStatus(null);

        try {
            const imageUrls = [];

            for (let i = 0; i < imageFiles.length; i++) {
                const uploadData = new FormData();
                uploadData.append('file', imageFiles[i]);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                const uploadJson = await uploadRes.json();
                if (!uploadRes.ok) {
                    throw new Error(uploadJson.error || `Erreur upload image ${i + 1}`);
                }
                imageUrls.push(uploadJson.url);
            }

            // Filter out empty variants
            const validVariants = variants.filter(v => v.size.trim());

            const productRes = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, imageUrls, variants: validVariants }),
            });

            const productJson = await productRes.json();
            if (!productRes.ok) {
                throw new Error(productJson.error || 'Erreur création produit');
            }

            setSubmitStatus({ type: 'success', message: `Produit "${form.title}" créé avec succès !` });
            setForm({ title: '', slug: '', description: '', details: '', category_id: '', base_price: '' });
            setVariants([{ size: '', stock: '5', price_modifier: '0' }]);
            setImageFiles([]);
            setImagePreviews([]);
            loadProducts();

        } catch (err) {
            setSubmitStatus({ type: 'error', message: err.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="admin-page container">
            <div className="account-header">
                <div>
                    <h1>Gestion des Produits</h1>
                    <p>{products.length} produit{products.length !== 1 ? 's' : ''} au catalogue</p>
                </div>
                <Link href="/admin" className="btn-secondary">← Retour Dashboard</Link>
            </div>

            {submitStatus && (
                <div style={{
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    background: submitStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${submitStatus.type === 'success' ? '#22c55e' : '#ef4444'}`,
                    color: submitStatus.type === 'success' ? '#15803d' : '#dc2626',
                    fontWeight: 500,
                }}>
                    {submitStatus.message}
                </div>
            )}

            {/* EXISTING PRODUCTS TABLE */}
            <div className="admin-orders-section" style={{ marginBottom: '3rem' }}>
                <h2>Produits existants</h2>
                {loadingProducts ? (
                    <p>Chargement...</p>
                ) : products.length === 0 ? (
                    <p>Aucun produit.</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Prix</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            {p.image_url ? (
                                                <div style={{ width: 50, height: 50, position: 'relative' }}>
                                                    <Image src={p.image_url} alt={p.title} fill style={{ objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)' }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <Link href={`/product/${p.slug}`} style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                                                {p.title}
                                            </Link>
                                        </td>
                                        <td>{p.category_name}</td>
                                        <td>{p.base_price.toFixed(2)} €</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(p.id, p.title)}
                                                style={{
                                                    background: 'none',
                                                    border: '1px solid #ef4444',
                                                    color: '#ef4444',
                                                    padding: '0.3rem 0.8rem',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD PRODUCT FORM */}
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Ajouter un produit</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Image upload — multiple */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Photos du produit <span style={{ fontWeight: 300, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>(la 1ère = photo principale)</span>
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            style={{
                                border: '2px dashed var(--border-color)',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'var(--bg-tertiary)',
                                minHeight: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                Glissez des images ou <strong>cliquez pour parcourir</strong>
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                                JPG, PNG, WebP — max 5 MB par image
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange}
                            multiple
                            style={{ display: 'none' }}
                        />
                        {imagePreviews.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                                {imagePreviews.map((preview, i) => (
                                    <div key={i} style={{ position: 'relative', border: i === 0 ? '2px solid var(--text-primary)' : '1px solid var(--border-color)', overflow: 'hidden' }}>
                                        <div style={{ position: 'relative', width: '100%', height: '120px' }}>
                                            <Image src={preview} alt={`Photo ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        {i === 0 && (
                                            <span style={{ position: 'absolute', top: 4, left: 4, background: 'var(--text-primary)', color: 'var(--bg-primary)', fontSize: '0.6rem', padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Principale</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', lineHeight: 1 }}
                                        >×</button>
                                        <p style={{ margin: 0, padding: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {imageFiles[i]?.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom du produit *</label>
                        <input id="title" type="text" name="title" value={form.title} onChange={handleChange} required placeholder="ex: Tapis Beni Ouarain Ivoire" className="form-input" />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Slug (URL) *</label>
                        <input id="slug" type="text" name="slug" value={form.slug} onChange={handleChange} required placeholder="tapis-beni-ouarain-ivoire" className="form-input" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }} />
                    </div>

                    {/* Category + Price */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label htmlFor="category_id" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Catégorie *</label>
                            <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} required className="form-input">
                                <option value="">Choisir une catégorie</option>
                                {/* Parent categories that have children → shown as optgroups */}
                                {categories.filter(c => !c.parent_id && categories.some(sub => sub.parent_id === c.id)).map(parent => (
                                    <optgroup key={parent.id} label={parent.name}>
                                        {categories.filter(sub => sub.parent_id === parent.id).map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                                {/* Parent categories without children → shown as regular options */}
                                {categories.filter(c => !c.parent_id && !categories.some(sub => sub.parent_id === c.id)).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="base_price" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Prix de base (€) *</label>
                            <input id="base_price" type="number" name="base_price" value={form.base_price} onChange={handleChange} required min="0" step="0.01" placeholder="299.00" className="form-input" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                        <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description du produit..." className="form-input" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                    </div>

                    {/* Details */}
                    <div>
                        <label htmlFor="details" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Détails techniques</label>
                        <textarea id="details" name="details" value={form.details} onChange={handleChange} rows={2} placeholder="Matière, dimensions, entretien..." className="form-input" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                    </div>

                    {/* Variants */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Tailles / Variantes</label>
                        {variants.map((v, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'end' }}>
                                <input
                                    type="text"
                                    placeholder="ex: 200 x 150 cm"
                                    value={v.size}
                                    onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                                    className="form-input"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={v.stock}
                                    onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                                    className="form-input"
                                    min="0"
                                />
                                <input
                                    type="number"
                                    placeholder="+ prix €"
                                    value={v.price_modifier}
                                    onChange={(e) => handleVariantChange(i, 'price_modifier', e.target.value)}
                                    className="form-input"
                                    step="0.01"
                                />
                                {variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}>
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addVariant} className="btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                            + Ajouter une taille
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1rem', opacity: uploading ? 0.7 : 1 }}
                    >
                        {uploading ? 'Enregistrement en cours...' : 'Ajouter le produit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
