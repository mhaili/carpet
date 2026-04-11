import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }

        if (name.length > 200 || email.length > 200 || subject.length > 200 || message.length > 5000) {
            return NextResponse.json({ error: 'Données trop longues' }, { status: 400 });
        }

        // For now, just log the message (you can create a contact_messages table in Supabase later)
        console.log('Contact form submission:', { name, email, subject, message: message.substring(0, 100) });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
