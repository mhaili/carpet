'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <button onClick={handleLogout} className="btn-secondary" style={{ marginTop: '1rem' }}>
            Se déconnecter
        </button>
    );
}
