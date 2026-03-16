import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../../../lib/db';
import { login } from '../../../../lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "L'email et le mot de passe sont requis" }, { status: 400 });
        }

        const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(email);
        if (!customer) {
            return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, customer.password_hash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
        }

        const user = {
            id: customer.id,
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            role: customer.email === 'admin@amazigh.com' ? 'admin' : 'customer',
        };

        await login(user);

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
    }
}
