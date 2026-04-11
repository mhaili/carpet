import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';

export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { getAllOrders } from '../../lib/db';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';
import AdminOrdersTable from './AdminOrdersTable';

async function getAdminStats() {
    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('id, total');
    
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('id');
    
    const { data: lowStockVariants } = await supabaseAdmin
        .from('product_variants')
        .select('id')
        .lte('stock', 2);

    const orderCount = orders?.length || 0;
    const revenue = orders?.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) || 0;
    const productCount = products?.length || 0;
    const lowStockAlerts = lowStockVariants?.length || 0;

    return { orderCount, revenue, productCount, lowStockAlerts };
}

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/login');
    }

    const stats = await getAdminStats();
    const orders = await getAllOrders();

    return (
        <div className="admin-page container">
            <div className="account-header">
                <div>
                    <h1>Dashboard Admin</h1>
                    <p>Vue d&apos;ensemble de la boutique</p>
                </div>
                <div>
                    <Link href="/admin/products" className="btn-primary" style={{ marginRight: '1rem' }}>
                        Gestion Produits
                    </Link>
                    <Link href="/account" className="btn-secondary" style={{ marginRight: '1rem' }}>
                        Espace client
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Chiffre d&apos;Affaires</h3>
                    <p className="stat-value">{stats.revenue.toFixed(2)} €</p>
                </div>
                <div className="stat-card">
                    <h3>Commandes</h3>
                    <p className="stat-value">{stats.orderCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Produits</h3>
                    <p className="stat-value">{stats.productCount}</p>
                </div>
                <div className="stat-card" style={{ borderColor: stats.lowStockAlerts > 0 ? '#e57373' : '' }}>
                    <h3>Stocks Faibles</h3>
                    <p className="stat-value" style={{ color: stats.lowStockAlerts > 0 ? '#e57373' : '' }}>
                        {stats.lowStockAlerts}
                    </p>
                </div>
            </div>

            <div className="admin-orders-section">
                <h2>Commandes</h2>
                <AdminOrdersTable initialOrders={orders} />
            </div>
        </div>
    );
}
