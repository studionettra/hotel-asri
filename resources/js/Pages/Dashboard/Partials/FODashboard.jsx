import { Link } from '@inertiajs/react';
import StatCard from '@/Components/StatCard';

export default function FODashboard({ data }) {
    return (
        <div>
            {/* Quick Actions */}
            <div className="row mb-4">
                <div className="col-12 d-flex flex-wrap gap-2">
                    <Link href={route('availability.index')} className="btn btn-primary">
                        <i className="bi bi-calendar-plus me-2"></i>Buat Reservasi Baru
                    </Link>
                    <Link href={route('reservations.index')} className="btn btn-outline-primary">
                        <i className="bi bi-search me-2"></i>Cari Tamu
                    </Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="row g-3 mb-4">
                <StatCard title="Kedatangan Hari Ini" value={data.todays_arrivals} color="primary" icon="bi-box-arrow-in-right" cols="col-12 col-md-3" />
                <StatCard title="Keberangkatan Hari Ini" value={data.todays_departures} color="success" icon="bi-box-arrow-right" cols="col-12 col-md-3" />
                <StatCard title="Kamar Tersedia" value={data.available_rooms} color="danger" icon="bi-door-open" cols="col-12 col-md-3" />
                <StatCard title="Reservasi Aktif" value={data.active_reservations} color="warning" icon="bi-journal-check" cols="col-12 col-md-3" />
            </div>

            {/* Lists */}
            <div className="row g-4 mt-2">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-primary-subtle text-primary border-0">
                            <h6 className="mb-0 fw-bold">Kedatangan Diperkirakan</h6>
                        </div>
                        <div className="card-body p-0">
                            {data.arrival_list.length === 0 ? (
                                <p className="text-muted text-center py-4 mb-0 small">Tidak ada jadwal kedatangan hari ini.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent" style={{ minWidth: '130px' }}>Tamu</th>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent" style={{ minWidth: '110px' }}>Tipe</th>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent" style={{ minWidth: '80px' }}>Kamar</th>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent text-end" style={{ minWidth: '85px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.arrival_list.map((res) => (
                                                <tr key={res.id}>
                                                    <td>{res.guest?.full_name}</td>
                                                    <td>{res.room_type?.name}</td>
                                                    <td>{res.room?.room_number ?? <span className="text-muted fst-italic">TBD</span>}</td>
                                                    <td className="text-end">
                                                        <Link href={route('checkins.create', res.id)} className="btn btn-sm btn-primary">
                                                            Check-In
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
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-success-subtle text-success border-0">
                            <h6 className="mb-0 fw-bold">Keberangkatan Diperkirakan</h6>
                        </div>
                        <div className="card-body p-0">
                            {data.departure_list.length === 0 ? (
                                <p className="text-muted text-center py-4 mb-0 small">Tidak ada jadwal keberangkatan hari ini.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent" style={{ minWidth: '80px' }}>Kamar</th>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent" style={{ minWidth: '130px' }}>Tamu</th>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent" style={{ minWidth: '110px' }}>Tipe</th>
                                                <th className="text-uppercase fw-semibold text-body-secondary small border-0 bg-transparent text-end" style={{ minWidth: '150px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.departure_list.map((res) => (
                                                <tr key={res.id}>
                                                    <td className="fw-bold">{res.room?.room_number}</td>
                                                    <td>{res.guest?.full_name}</td>
                                                    <td>{res.room_type?.name}</td>
                                                    <td className="text-end">
                                                        <Link href={route('folios.show', res.id)} className="btn btn-sm btn-outline-success me-2">
                                                            Folio
                                                        </Link>
                                                        {res.check_in && (
                                                            <Link href={route('checkouts.create', res.check_in.id)} className="btn btn-sm btn-danger">
                                                                Check-Out
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
