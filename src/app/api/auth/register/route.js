import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../../../lib/db';
import { login } from '../../../../lib/auth';

export async function POST(request) {
    try {
        const { email, password, firstName, lastName } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "L'email et le mot de passe sont requis" }, { status: 400 });
        }

        const existingUser = db.prepare('SELECT id FROM customers WHERE email = ?').get(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const result = db.prepare(
            'INSERT INTO customers (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)'
        ).run(email, password_hash, firstName || '', lastName || '');

        const user = {
            id: result.lastInsertRowid,
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            role: email === 'admin@amazigh.com' ? 'admin' : 'customer',
        };

        await login(user);

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 });
    }
}
