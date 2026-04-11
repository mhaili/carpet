import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(request) {
    try {
        // Vérification authentification admin
        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

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
        // Sanitize: only allow alphanumeric, dash, dot in filename
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const uploadDir = path.join(process.cwd(), 'public', 'products');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, safeName);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await writeFile(filePath, buffer);

        const publicUrl = `/products/${safeName}`;

        return NextResponse.json({ success: true, url: publicUrl, path: publicUrl });

    } catch (err) {
        console.error('Erreur upload route:', err);
        return NextResponse.json(
            { error: err.message || 'Erreur serveur lors de l\'upload' },
            { status: 500 }
        );
    }
}
