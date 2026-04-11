import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCustomerByEmail, createCustomer } from '../../../../lib/db';
import { login } from '../../../../lib/auth';

export async function POST(request) {
    try {
        const { email, password, firstName, lastName } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "L'email et le mot de passe sont requis" }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
        }
        if (!/[A-Z]/.test(password)) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins une majuscule' }, { status: 400 });
        }
        if (!/[0-9]/.test(password)) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins un chiffre' }, { status: 400 });
        }

        const existingUser = await getCustomerByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const customer = await createCustomer({
            email,
            password_hash,
            first_name: firstName || '',
            last_name: lastName || '',
            role: 'customer',
        });

        const user = {
            id: customer.id,
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            role: 'customer',
        };

        await login(user);

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 });
    }
}
