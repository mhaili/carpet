import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Client ADMIN (service_role) — bypass complet du RLS — serveur uniquement
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey || serviceKey === 'COLLE_TA_SERVICE_ROLE_KEY_ICI') {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local');
    }

    return createClient(url, serviceKey, {
        auth: { persistSession: false },
    });
}

export async function POST(request) {
    try {
        const supabaseAdmin = getSupabaseAdmin();

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
        }

        // Vérification type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' },
                { status: 400 }
            );
        }

        // Vérification taille max (5 MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Fichier trop lourd (max 5 MB).' },
                { status: 400 }
            );
        }

        const ext = file.name.split('.').pop().toLowerCase();
        const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
            .from('product-images')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Erreur Supabase upload:', error);
            return NextResponse.json(
                { error: `Upload échoué : ${error.message}` },
                { status: 500 }
            );
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(data.path);

        return NextResponse.json({ success: true, url: publicUrl, path: data.path });

    } catch (err) {
        console.error('Erreur upload route:', err);
        return NextResponse.json(
            { error: err.message || 'Erreur serveur lors de l\'upload' },
            { status: 500 }
        );
    }
}
