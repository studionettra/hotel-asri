import { router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DatePicker from '@/Components/DatePicker';

// Sama dengan halaman Ketersediaan: status housekeeping ditampilkan sebagai titik warna
const STATUS_CONFIG = {
    vc:  { label: 'Vacant Clean',   color: 'success' },
    vd:  { label: 'Vacant Dirty',   color: 'warning' },
    oc:  { label: 'Occupied Clean', color: 'primary' },
    od:  { label: 'Occupied Dirty', color: 'danger' },
    ooo: { label: 'Out of Order',   color: 'secondary' },
    oos: { label: 'Out of Service', color: 'dark' },
};

const methodLabel = {
    cash: 'Tunai', debit_card: 'Debit', credit_card: 'Kredit',
    transfer: 'Transfer', city_ledger: 'City Ledger',
};

const orderTypeLabel = { dine_in: 'Dine In', room_service: 'Room Service', takeaway: 'Takeaway' };

const labelStyle = { fontSize: '0.7rem', letterSpacing: '0.06em' };

// StatusDot dihapus karena akan diganti dengan desain pill terintegrasi di bagian bawah

function StatCard({ title, value, sub, color = 'primary', icon = 'bi-graph-up', cols = 'col-12 col-sm-6 col-xl-3' }) {
    return (
        <div className={cols}>
            <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                    <div className={`bg-${color}-subtle text-${color} rounded-circle d-inline-flex align-items-center justify-content-center mb-3 flex-shrink-0`} style={{ width: 56, height: 56 }}>
                        <i className={`bi ${icon} fs-3`}></i>
                    </div>
                    <div className="text-uppercase fw-semibold text-body-secondary mb-2" style={labelStyle}>{title}</div>
                    <h4 className="mb-0 fw-bold">{value}</h4>
                    {sub && <div className="text-body-secondary mt-2" style={{ fontSize: '0.75rem' }}>{sub}</div>}
                </div>
            </div>
        </div>
    );
}

function SectionCard({ title, icon, children }) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary-subtle">
                    <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                        <i className={`bi ${icon} fs-5`}></i>
                    </div>
                    <h5 className="mb-0 fw-bold">{title}</h5>
                </div>
                {children}
            </div>
        </div>
    );
}

function SubHeading({ children }) {
    return <div className="text-uppercase fw-semibold text-body-secondary mb-2" style={labelStyle}>{children}</div>;
}

function Th({ className = '', children }) {
    return (
        <th className={`text-uppercase fw-semibold text-body-secondary ${className}`} style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
            {children}
        </th>
    );
}

function EmptyRow({ cols }) {
    return <tr><td colSpan={cols} className="text-center text-body-secondary py-3">Tidak ada data</td></tr>;
}

export default function Index({ filters, occupancy, revenue, housekeeping, fnb }) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    function applyFilter(e) {
        e.preventDefault();
        router.get(route('reports.index'), { from, to }, { preserveState: true });
    }

    const fmt = n => `Rp ${Number(n).toLocaleString('id-ID')}`;

    return (
        <AppLayout title="Laporan">
            {/* Date Filter */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={applyFilter} className="row g-3 align-items-end">
                        <div className="col-12 col-md-4 col-lg-3">
                            <label className="form-label small fw-semibold text-body-secondary mb-1">Dari Tanggal</label>
                            <DatePicker value={from} onChange={e => setFrom(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-4 col-lg-3">
                            <label className="form-label small fw-semibold text-body-secondary mb-1">Sampai Tanggal</label>
                            <DatePicker value={to} min={from} onChange={e => setTo(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-4 col-lg-2">
                            <button type="submit" className="btn btn-primary w-100 m-0 fw-semibold rounded-3 py-2">
                                <i className="bi bi-search me-2"></i>Tampilkan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Occupancy */}
            <SectionCard title="Laporan Hunian (Occupancy)" icon="bi-building">
                <div className="row g-3 mb-4">
                    <StatCard title="Total Kamar" value={occupancy.total_rooms} color="primary" icon="bi-door-open" />
                    <StatCard title="Check-In" value={occupancy.check_ins} color="success" icon="bi-box-arrow-in-right" />
                    <StatCard title="Check-Out" value={occupancy.check_outs} color="secondary" icon="bi-box-arrow-right" />
                    <StatCard
                        title="Occupancy Rate"
                        value={`${occupancy.occupancy_rate}%`}
                        icon="bi-percent"
                        color={occupancy.occupancy_rate >= 70 ? 'success' : occupancy.occupancy_rate >= 40 ? 'warning' : 'danger'}
                    />
                </div>
                <SubHeading>Status Kamar Saat Ini</SubHeading>
                <div className="d-flex flex-wrap gap-3 mt-3">
                    {Object.entries(occupancy.by_status ?? {}).length === 0 && (
                        <span className="text-body-secondary small">Tidak ada data</span>
                    )}
                    {Object.entries(occupancy.by_status ?? {}).map(([status, count]) => {
                        const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'secondary' };
                        return (
                            <div key={status} className="d-inline-flex align-items-center border border-secondary-subtle bg-body-tertiary rounded-pill p-1 pe-3">
                                <div className={`bg-${cfg.color} text-white rounded-circle d-flex align-items-center justify-content-center me-2`} style={{ width: 28, height: 28, fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {count}
                                </div>
                                <span className="small fw-medium text-body-secondary">{cfg.label}</span>
                            </div>
                        );
                    })}
                </div>
            </SectionCard>

            {/* Revenue */}
            <SectionCard title="Laporan Pendapatan" icon="bi-cash-stack">
                <div className="row g-3 mb-4">
                    <StatCard title="Total Pendapatan" value={fmt(revenue.total)} color="success" icon="bi-cash-stack" />
                    <StatCard title="Pendapatan F&B" value={fmt(revenue.fnb_revenue)} color="primary" icon="bi-cup-hot" />
                    <StatCard title="Pendapatan Laundry" value={fmt(revenue.laundry_revenue)} color="info" icon="bi-basket" />
                    <StatCard title="Refund" value={fmt(revenue.refunds)} color="danger" icon="bi-arrow-counterclockwise" />
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <SubHeading>Pendapatan per Metode Pembayaran</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr><Th>Metode</Th><Th className="text-end">Jumlah</Th></tr>
                                </thead>
                                <tbody>
                                    {Object.entries(revenue.by_method ?? {}).length === 0 && <EmptyRow cols={2} />}
                                    {Object.entries(revenue.by_method ?? {}).map(([method, amount]) => (
                                        <tr key={method}>
                                            <td>{methodLabel[method] ?? method}</td>
                                            <td className="text-end fw-semibold">{fmt(amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <SubHeading>Ringkasan</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <tbody>
                                    <tr>
                                        <td>Deposit Diterima</td>
                                        <td className="text-end fw-semibold">{fmt(revenue.deposits)}</td>
                                    </tr>
                                    <tr>
                                        <td>Refund Dikeluarkan</td>
                                        <td className="text-end fw-semibold text-danger">{fmt(revenue.refunds)}</td>
                                    </tr>
                                    <tr>
                                        <td>Pendapatan F&B</td>
                                        <td className="text-end fw-semibold">{fmt(revenue.fnb_revenue)}</td>
                                    </tr>
                                    <tr>
                                        <td>Pendapatan Laundry</td>
                                        <td className="text-end fw-semibold">{fmt(revenue.laundry_revenue)}</td>
                                    </tr>
                                    <tr className="table-active fw-bold">
                                        <td>Total Bersih</td>
                                        <td className="text-end text-success">{fmt(revenue.total)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Housekeeping */}
            <SectionCard title="Laporan Housekeeping" icon="bi-stars">
                <div className="row g-3 mb-4">
                    <StatCard title="Total Tugas" value={housekeeping.tasks_total} color="primary" icon="bi-list-check" />
                    <StatCard title="Selesai" value={housekeeping.tasks_completed} color="success" icon="bi-check-circle" />
                    <StatCard
                        title="Tingkat Penyelesaian"
                        value={`${housekeeping.completion_rate}%`}
                        icon="bi-percent"
                        color={housekeeping.completion_rate >= 80 ? 'success' : 'warning'}
                    />
                    <StatCard
                        title="Item Laundry"
                        value={Object.values(housekeeping.laundry_by_status ?? {}).reduce((a, b) => a + b, 0)}
                        color="info"
                        icon="bi-basket"
                    />
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <SubHeading>Tugas per Status</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead><tr><Th>Status</Th><Th className="text-center">Jumlah</Th></tr></thead>
                                <tbody>
                                    {Object.entries(housekeeping.by_status ?? {}).length === 0 && <EmptyRow cols={2} />}
                                    {Object.entries(housekeeping.by_status ?? {}).map(([s, c]) => (
                                        <tr key={s}><td className="text-capitalize">{s.replace('_', ' ')}</td><td className="text-center fw-semibold">{c}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <SubHeading>Tugas per Jenis</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead><tr><Th>Jenis</Th><Th className="text-center">Jumlah</Th></tr></thead>
                                <tbody>
                                    {Object.entries(housekeeping.by_type ?? {}).length === 0 && <EmptyRow cols={2} />}
                                    {Object.entries(housekeeping.by_type ?? {}).map(([t, c]) => (
                                        <tr key={t}><td className="text-capitalize">{t.replace('_', ' ')}</td><td className="text-center fw-semibold">{c}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <SubHeading>Laundry per Status</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead><tr><Th>Status</Th><Th className="text-center">Jumlah</Th></tr></thead>
                                <tbody>
                                    {Object.entries(housekeeping.laundry_by_status ?? {}).length === 0 && <EmptyRow cols={2} />}
                                    {Object.entries(housekeeping.laundry_by_status ?? {}).map(([s, c]) => (
                                        <tr key={s}><td className="text-capitalize">{s}</td><td className="text-center fw-semibold">{c}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* F&B */}
            <SectionCard title="Laporan F&B" icon="bi-cup-hot">
                <div className="row g-3 mb-4">
                    <StatCard title="Total Pesanan" value={fnb.total_orders} color="primary" icon="bi-receipt" cols="col-12 col-sm-6 col-xl-4" />
                    <StatCard title="Pendapatan F&B" value={fmt(fnb.total_revenue)} color="success" icon="bi-cash-stack" cols="col-12 col-sm-6 col-xl-4" />
                    <StatCard
                        title="Rata-rata per Pesanan"
                        value={fmt(fnb.total_orders > 0 ? fnb.total_revenue / fnb.total_orders : 0)}
                        color="info"
                        icon="bi-graph-up"
                        cols="col-12 col-sm-6 col-xl-4"
                    />
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <SubHeading>Pesanan per Tipe</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead><tr><Th>Tipe</Th><Th className="text-center">Pesanan</Th><Th className="text-end">Revenue</Th></tr></thead>
                                <tbody>
                                    {Object.entries(fnb.by_type ?? {}).length === 0 && <EmptyRow cols={3} />}
                                    {Object.entries(fnb.by_type ?? {}).map(([type, data]) => (
                                        <tr key={type}>
                                            <td>{orderTypeLabel[type] ?? type}</td>
                                            <td className="text-center fw-semibold">{data.count}</td>
                                            <td className="text-end fw-semibold">{fmt(data.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <SubHeading>Pesanan per Status</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead><tr><Th>Status</Th><Th className="text-center">Jumlah</Th></tr></thead>
                                <tbody>
                                    {Object.entries(fnb.by_status ?? {}).length === 0 && <EmptyRow cols={2} />}
                                    {Object.entries(fnb.by_status ?? {}).map(([s, c]) => (
                                        <tr key={s}><td className="text-capitalize">{s.replace('_', ' ')}</td><td className="text-center fw-semibold">{c}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <SubHeading>Top 10 Menu</SubHeading>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead><tr><Th>Menu</Th><Th className="text-center">Qty</Th><Th className="text-end">Revenue</Th></tr></thead>
                                <tbody>
                                    {(fnb.top_items ?? []).length === 0 && <EmptyRow cols={3} />}
                                    {(fnb.top_items ?? []).map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td className="text-center fw-semibold">{item.total_qty}</td>
                                            <td className="text-end fw-semibold">{fmt(item.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SectionCard>
        </AppLayout>
    );
}
