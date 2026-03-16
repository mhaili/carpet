import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import db from '../../lib/db';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';

// Utility to get dashboard stats
async function getAdminStats() {
    const orders = db.prepare('SELECT COUNT(*) as count, SUM(total) as revenue FROM orders').get();

    // We need to fetch items in low stock (e.g. stock <= 2)
    const lowStock = db.prepare(`
    SELECT COUNT(*) as count
    FROM product_variants 
    WHERE stock <= 2
  `).get();

    return {
        orderCount: orders.count || 0,
        revenue: orders.revenue || 0,
        lowStockAlerts: lowStock.count || 0
    };
}

// Utility to get all orders
async function getAllOrders() {
    return db.prepare(`
    SELECT o.*, c.first_name, c.last_name, c.email
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `).all();
}

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/login'); // only admin can access
    }

    const stats = await getAdminStats();
    const orders = await getAllOrders();

    return (
        <div className="admin-page container">
            <div className="account-header">
                <div>
                    <h1>Dashboard Admin</h1>
                    <p>Vue d'ensemble de la boutique de tapis</p>
                </div>
                <div>
                    <Link href="/admin/products" className="btn-primary" style={{ marginRight: '1rem' }}>
                        ✚ Ajouter un produit
                    </Link>
                    <Link href="/account" className="btn-secondary" style={{ marginRight: '1rem' }}>
                        Retour à l'espace client
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Chiffre d'Affaires</h3>
                    <p className="stat-value">{stats.revenue.toFixed(2)} €</p>
                </div>
                <div className="stat-card">
                    <h3>Commandes Totales</h3>
                    <p className="stat-value">{stats.orderCount}</p>
                </div>
                <div className="stat-card" style={{ borderColor: stats.lowStockAlerts > 0 ? 'var(--color-terracotta)' : '' }}>
                    <h3>Alerte Stocks Faibles</h3>
                    <p className="stat-value" style={{ color: stats.lowStockAlerts > 0 ? 'var(--color-terracotta)' : '' }}>
                        {stats.lowStockAlerts}
                    </p>
                </div>
            </div>

            <div className="admin-orders-section">
                <h2>Dernières Commandes</h2>

                {orders.length === 0 ? (
                    <p>Aucune commande pour le moment.</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>N° Commande</th>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Total</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>{order.order_number}</strong></td>
                                        <td>
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td>
                                            {order.first_name} {order.last_name}<br />
                                            <small style={{ color: 'var(--text-secondary)' }}>{order.email}</small>
                                        </td>
                                        <td>{order.total.toFixed(2)} €</td>
                                        <td>
                                            <span className={`order-status status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/admin/orders/${order.order_number}`} className="view-order-link">
                                                Gérer
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
