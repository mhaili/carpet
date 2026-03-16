'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function AdminProductsPage() {
    const [form, setForm] = useState({
        title: '',
        slug: '',
        description: '',
        details: '',
        category_id: '',
        base_price: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success'|'error', message: string }
    const fileInputRef = useRef(null);

    // Catégories hardcodées (tu pourras les charger depuis l'API plus tard)
    const categories = [
        { id: 1, name: 'Béni Ouarain' },
        { id: 2, name: 'Azilal' },
        { id: 3, name: 'Boucherouite' },
        { id: 4, name: 'Kilim' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const updated = { ...prev, [name]: value };
            // Auto-génération du slug depuis le titre
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setSubmitStatus(null);

        try {
            let imageUrl = null;

            // 1. Upload de l'image si présente
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                const uploadJson = await uploadRes.json();
                if (!uploadRes.ok) {
                    throw new Error(uploadJson.error || 'Erreur upload image');
                }
                imageUrl = uploadJson.url;
            }

            // 2. Création du produit
            const productRes = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, imageUrl }),
            });

            const productJson = await productRes.json();
            if (!productRes.ok) {
                throw new Error(productJson.error || 'Erreur création produit');
            }

            setSubmitStatus({ type: 'success', message: `✅ Produit "${form.title}" créé avec succès !` });
            setForm({ title: '', slug: '', description: '', details: '', category_id: '', base_price: '' });
            setImageFile(null);
            setImagePreview(null);

        } catch (err) {
            setSubmitStatus({ type: 'error', message: `❌ ${err.message}` });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="admin-page container">
            <div className="account-header">
                <div>
                    <h1>Gestion des Produits</h1>
                    <p>Ajouter un nouveau tapis au catalogue</p>
                </div>
                <a href="/admin" className="btn-secondary">← Retour Dashboard</a>
            </div>

            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                {submitStatus && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        background: submitStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${submitStatus.type === 'success' ? '#22c55e' : '#ef4444'}`,
                        color: submitStatus.type === 'success' ? '#15803d' : '#dc2626',
                        fontWeight: 500,
                    }}>
                        {submitStatus.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Zone d'upload d'image */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Photo du tapis
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: '12px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'var(--surface-secondary)',
                                transition: 'border-color 0.2s',
                                position: 'relative',
                                minHeight: '220px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            {imagePreview ? (
                                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                                    <Image
                                        src={imagePreview}
                                        alt="Aperçu"
                                        fill
                                        style={{ objectFit: 'contain', borderRadius: '8px' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '2.5rem' }}>🖼️</div>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                        Glissez une image ici ou <strong>cliquez pour parcourir</strong>
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                                        JPG, PNG, WebP — max 5 MB
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        {imageFile && (
                            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                📎 {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    style={{ marginLeft: '0.75rem', color: 'var(--color-terracotta)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    ✕ Supprimer
                                </button>
                            </p>
                        )}
                    </div>

                    {/* Titre */}
                    <div>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Nom du tapis *
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="ex: Tapis Béni Ouarain Ivoire"
                            className="form-input"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Slug (URL) *
                        </label>
                        <input
                            id="slug"
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            required
                            placeholder="tapis-beni-ouarain-ivoire"
                            className="form-input"
                            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                        />
                        <small style={{ color: 'var(--text-secondary)' }}>Généré automatiquement depuis le nom</small>
                    </div>

                    {/* Catégorie + Prix */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label htmlFor="category_id" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Catégorie *
                            </label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                                className="form-input"
                            >
                                <option value="">Choisir une catégorie</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="base_price" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Prix de base (€) *
                            </label>
                            <input
                                id="base_price"
                                type="number"
                                name="base_price"
                                value={form.base_price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="299.00"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Description du tapis, son histoire, ses caractéristiques..."
                            className="form-input"
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>

                    {/* Détails */}
                    <div>
                        <label htmlFor="details" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Détails techniques
                        </label>
                        <textarea
                            id="details"
                            name="details"
                            value={form.details}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Matière, dimensions disponibles, entretien..."
                            className="form-input"
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            opacity: uploading ? 0.7 : 1,
                            cursor: uploading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {uploading ? '⏳ Enregistrement en cours...' : '✚ Ajouter le produit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
