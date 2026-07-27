import { Link } from '@inertiajs/react';
import StatCard from '@/Components/StatCard';

export default function FnBDashboard({ data }) {
    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <div>
            <div className="row g-3 mb-4">
                <StatCard title="Pesanan Aktif" value={data.active_orders} color="warning" icon="bi-clock-history" cols="col-12 col-md-3" />
                <StatCard title="Layanan Kamar" value={data.room_service_orders} color="primary" icon="bi-door-closed" cols="col-12 col-md-3" />
                <StatCard title="Pesanan Restoran" value={data.restaurant_orders} color="info" icon="bi-shop" cols="col-12 col-md-3" />
                <StatCard title="Pendapatan Hari Ini" value={formatCurrency(data.revenue_today)} color="success" icon="bi-cash-stack" cols="col-12 col-md-3" />
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <Link href={route('fnb.orders.create')} className="btn btn-primary me-3">
                        <i className="bi bi-plus-circle me-2"></i>Pesanan Baru
                    </Link>
                    <Link href={route('fnb.orders.index')} className="btn btn-outline-primary">
                        <i className="bi bi-list-ul me-2"></i>Lihat Semua Pesanan
                    </Link>
                </div>
            </div>
        </div>
    );
}
