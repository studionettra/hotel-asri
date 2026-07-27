import { Link } from '@inertiajs/react';
import StatCard from '@/Components/StatCard';

export default function HKDashboard({ data }) {
    return (
        <div>
            <div className="row g-3 mb-4">
                <StatCard title="Kamar Kosong Kotor" value={data.vacant_dirty} color="warning" icon="bi-stars" cols="col-6 col-md-4 col-xl-2" />
                <StatCard title="Kamar Terisi Kotor" value={data.occupied_dirty} color="danger" icon="bi-trash" cols="col-6 col-md-4 col-xl-2" />
                <StatCard title="Laundry Tertunda" value={data.pending_laundry} color="info" icon="bi-basket" cols="col-6 col-md-4 col-xl-2" />
                <StatCard title="Tugas Pembersihan" value={data.cleaning_tasks} color="primary" icon="bi-list-check" cols="col-6 col-md-4 col-xl-3" />
                <StatCard title="Jadwal Perawatan Kolam" value={data.pool_maintenance_due} color="success" icon="bi-water" cols="col-12 col-md-4 col-xl-3" />
            </div>

            <div className="row">
                <div className="col-12">
                    <Link href={route('housekeeping.tasks.index')} className="btn btn-outline-primary me-3">
                        <i className="bi bi-arrow-right-circle me-2"></i>Ke Tugas Pembersihan
                    </Link>
                    <Link href={route('laundry.index')} className="btn btn-outline-primary">
                        <i className="bi bi-arrow-right-circle me-2"></i>Ke Laundry
                    </Link>
                </div>
            </div>
        </div>
    );
}
