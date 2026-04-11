import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';

export const dynamic = 'force-dynamic';
import { getOrdersByCustomer } from '../../lib/db';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';

export default async function AccountPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const user = session.user;
    const orders = await getOrdersByCustomer(user.id);

    return (
        <div className="account-page container">
            <div className="account-header">
                <div>
                    <h1>Mon Compte</h1>
                    <p>Bienvenue, {user.firstName} {user.lastName}</p>
                </div>
                <div>
                    {user.role === 'admin' && (
                        <Link href="/admin" className="btn-primary" style={{ marginRight: '1rem' }}>
                            Dashboard Admin
                        </Link>
                    )}
                    <LogoutButton />
                </div>
            </div>

            <div className="account-content">
                <div className="orders-section">
                    <h2>Historique de commandes</h2>

                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <p>Vous n&apos;avez passé aucune commande pour le moment.</p>
                            <Link href="/catalogue" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                                Commencer mes achats
                            </Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card card">
                                    <div className="order-header">
                                        <div>
                                            <span className="order-number">Commande #{order.order_number}</span>
                                            <span className="order-date">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`order-status status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="order-body">
                                        <div className="order-totals">
                                            <div>Total TTC : <strong>{parseFloat(order.total).toFixed(2)} €</strong></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-sidebar">
                    <div className="card profile-card">
                        <h3>Mes Informations</h3>
                        <div className="info-group">
                            <p className="label">Nom complet</p>
                            <p>{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="info-group">
                            <p className="label">E-mail</p>
                            <p>{user.email}</p>
                        </div>
                        <button className="btn-secondary" disabled>Modifier mon profil</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
