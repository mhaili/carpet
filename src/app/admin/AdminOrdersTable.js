'use client';

import { useState } from 'react';

const STATUSES = ['en attente', 'confirmée', 'en préparation', 'expédiée', 'livrée', 'annulée'];

export default function AdminOrdersTable({ initialOrders }) {
    const [orders, setOrders] = useState(initialOrders || []);
    const [updating, setUpdating] = useState(null);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            if (!res.ok) throw new Error('Erreur mise à jour');
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
        } catch (err) {
            alert('Erreur: ' + err.message);
        } finally {
            setUpdating(null);
        }
    };

    if (orders.length === 0) {
        return <p style={{ color: 'var(--text-secondary)' }}>Aucune commande pour le moment.</p>;
    }

    return (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>N° Commande</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Total</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td><strong>{order.order_number}</strong></td>
                            <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                            <td>
                                {order.first_name ? (
                                    <>
                                        {order.first_name} {order.last_name}
                                        <br />
                                        <small style={{ color: 'var(--text-secondary)' }}>{order.email}</small>
                                    </>
                                ) : (
                                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Invité</span>
                                )}
                            </td>
                            <td>{order.total.toFixed(2)} €</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    disabled={updating === order.id}
                                    className="form-input"
                                    style={{
                                        padding: '0.4rem 0.6rem',
                                        fontSize: '0.78rem',
                                        minWidth: '140px',
                                        opacity: updating === order.id ? 0.5 : 1,
                                    }}
                                >
                                    {STATUSES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
