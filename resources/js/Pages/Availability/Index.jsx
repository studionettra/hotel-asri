import { router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AppLayout from '@/Layouts/AppLayout';
import DatePicker from '@/Components/DatePicker';

// Status housekeeping = info sekunder, ditampilkan sebagai titik warna kecil
const STATUS_CONFIG = {
    vc:  { label: 'Vacant Clean',   color: 'success' },
    vd:  { label: 'Vacant Dirty',   color: 'warning' },
    oc:  { label: 'Occupied Clean', color: 'primary' },
    od:  { label: 'Occupied Dirty', color: 'danger' },
    ooo: { label: 'Out of Order',   color: 'secondary' },
    oos: { label: 'Out of Service', color: 'dark' },
};

// Ketersediaan = sinyal warna utama (dipakai badge kartu, ringkasan, dan legenda)
const AVAILABILITY = {
    available: { label: 'Tersedia',       color: 'success' },
    booked:    { label: 'Dipesan',        color: 'danger' },
    ooo:       { label: 'Tidak Tersedia', color: 'secondary' },
};

function StatusDot({ color }) {
    return (
        <span
            className={`bg-${color} rounded-circle d-inline-block flex-shrink-0`}
            style={{ width: 8, height: 8, boxShadow: 'inset 0 0 0 1px rgba(var(--bs-body-color-rgb), .15)' }}
        />
    );
}

function StatCard({ label, value, color, icon }) {
    return (
        <div className="col">
            <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between gap-3">
                    <div>
                        <div className="fs-3 fw-bold lh-1 mb-2">{value}</div>
                        <div className="text-uppercase fw-semibold text-body-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>{label}</div>
                    </div>
                    <div className={`bg-${color}-subtle text-${color} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: 48, height: 48 }}>
                        <i className={`bi ${icon} fs-4`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RoomCard({ room, nights, showFloor, isSelected, onSelect, onConfigChange, config }) {
    const [showFacilities, setShowFacilities] = useState(false);
    const isBooked = room.is_booked;
    const isOoo = ['ooo', 'oos'].includes(room.status);
    const isAvailable = !isBooked && !isOoo;

    const availability = isBooked ? AVAILABILITY.booked : isOoo ? AVAILABILITY.ooo : AVAILABILITY.available;
    const hk = STATUS_CONFIG[room.status] || { label: room.status, color: 'secondary' };

    const hasBreakfastFacility = Array.isArray(room.room_type?.facilities) && room.room_type.facilities.some(f => f.toLowerCase().includes('breakfast') || f.toLowerCase().includes('sarapan'));
    const includedBreakfast = hasBreakfastFacility || room.room_type?.name?.toLowerCase().includes('breakfast');

    const baseRoomPrice = Number(room.room_type?.base_price ?? 0) * nights;
    let cardTotal = baseRoomPrice;
    if (config?.extrabed) cardTotal += (200000 * nights);
    if (config?.breakfast && !includedBreakfast) cardTotal += (150000 * nights);

    return (
        <div className="col">
            <div
                className={`card h-100 shadow-sm position-relative ${isSelected ? 'border-primary' : ''} ${isAvailable ? '' : 'bg-body-tertiary'}`}
                style={{
                    cursor: isAvailable ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    boxShadow: isSelected ? '0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15)' : undefined,
                }}
                onClick={() => { if (isAvailable && onSelect) onSelect(room); }}
            >
                {isSelected && (
                    <span
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center position-absolute"
                        style={{ width: 22, height: 22, top: -8, right: -8, zIndex: 2, border: '2px solid var(--bs-body-bg)' }}
                    >
                        <i className="bi bi-check-lg" style={{ fontSize: '0.7rem' }}></i>
                    </span>
                )}

                <div className="card-body p-3 d-flex flex-column">
                    {/* Nomor kamar + badge ketersediaan */}
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                        <h6 className={`mb-0 fw-bold ${isAvailable ? '' : 'text-body-secondary'}`}>Kamar {room.room_number}</h6>
                        <span className={`badge bg-${availability.color}-subtle text-${availability.color} border border-${availability.color}-subtle rounded-pill flex-shrink-0`} style={{ fontSize: '0.7rem' }}>
                            {availability.label}
                        </span>
                    </div>

                    {/* Status housekeeping + lantai */}
                    <div className="d-flex align-items-center gap-2 text-body-secondary" style={{ fontSize: '0.75rem' }}>
                        <StatusDot color={hk.color} />
                        <span className="text-truncate">
                            {hk.label}{showFloor && ` · Lt. ${room.floor?.floor_number}`}
                        </span>
                    </div>

                    {/* Info kamar */}
                    <div className="mt-2 pt-2 border-top d-flex flex-column gap-1" style={{ fontSize: '0.75rem' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-body-secondary"><i className="bi bi-door-open me-1"></i>Tipe</span>
                            <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: '110px' }}>{room.room_type?.name ?? '—'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-body-secondary"><i className="bi bi-people me-1"></i>Kapasitas</span>
                            <span className="fw-semibold">{room.room_type?.max_capacity ?? '—'} Orang</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-body-secondary"><i className="bi bi-tag me-1"></i>Harga/mlm</span>
                            <span className="fw-semibold">Rp {room.room_type?.base_price ? Number(room.room_type.base_price).toLocaleString('id-ID') : '—'}</span>
                        </div>
                    </div>

                    {/* Fasilitas */}
                    <div className="d-flex flex-wrap gap-1 mt-auto pt-2">
                        {Array.isArray(room.room_type?.facilities) && room.room_type.facilities.length > 0 ? (
                            <>
                                {room.room_type.facilities.slice(0, showFacilities ? undefined : 2).map((f, idx) => (
                                    <span key={idx} className="badge bg-body-secondary text-body-secondary fw-normal" style={{ fontSize: '0.7rem' }}>{f}</span>
                                ))}
                                {!showFacilities && room.room_type.facilities.length > 2 && (
                                    <span
                                        className="badge bg-primary-subtle text-primary fw-semibold"
                                        style={{ fontSize: '0.7rem', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setShowFacilities(true); }}
                                    >
                                        +{room.room_type.facilities.length - 2}
                                    </span>
                                )}
                            </>
                        ) : <span className="text-body-secondary" style={{ fontSize: '0.75rem' }}>—</span>}
                    </div>

                    {/* Opsi kamar terpilih */}
                    {isSelected && (
                        <div className="mt-2 pt-2 border-top" onClick={e => e.stopPropagation()}>
                            <div className="form-check form-switch mb-1">
                                <input className="form-check-input" type="checkbox" id={`extrabed-${room.id}`} checked={config?.extrabed || false} onChange={e => onConfigChange(room.id, 'extrabed', e.target.checked)} />
                                <label className="form-check-label" htmlFor={`extrabed-${room.id}`} style={{ fontSize: '0.75rem' }}>Extra Bed (+200rb)</label>
                            </div>
                            <div className="form-check form-switch mb-0">
                                <input className="form-check-input" type="checkbox" id={`breakfast-${room.id}`} checked={includedBreakfast || (config?.breakfast || false)} disabled={includedBreakfast} onChange={e => onConfigChange(room.id, 'breakfast', e.target.checked)} />
                                <label className="form-check-label" htmlFor={`breakfast-${room.id}`} style={{ fontSize: '0.75rem' }}>
                                    {includedBreakfast ? 'Sarapan (termasuk)' : 'Sarapan (+150rb)'}
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Total harga */}
                {isSelected && (
                    <div className="card-footer bg-primary-subtle border-0 py-2 px-3 d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-semibold" style={{ fontSize: '0.75rem' }}>Total {nights} malam</span>
                        <span className="text-primary fw-bold" style={{ fontSize: '0.9rem' }}>Rp {cardTotal.toLocaleString('id-ID')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}


export default function Index({ floors, filters, summary }) {
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [checkIn, setCheckIn] = useState(filters.checkIn);
    const [checkOut, setCheckOut] = useState(filters.checkOut);
    const [sortBy, setSortBy] = useState(filters.sortBy || 'floor');

    function handleSelectRoom(room) {
        setSelectedRooms(prev => {
            const exists = prev.find(r => r.id === room.id);
            if (exists) return prev.filter(r => r.id !== room.id); // unselect
            if (prev.length >= 5) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Maksimal 5 kamar',
                    text: 'Maksimal memilih 5 kamar dalam satu transaksi.',
                    toast: true,
                    position: 'top-end',
                    timer: 2500,
                    showConfirmButton: false,
                });
                return prev;
            }
            return [...prev, { id: room.id, extrabed: false, breakfast: room.room_type?.name?.toLowerCase().includes('breakfast') || false, room }];
        });
    }

    function handleConfigChange(roomId, field, value) {
        setSelectedRooms(prev => prev.map(r =>
            r.id === roomId ? { ...r, [field]: value } : r
        ));
    }

    function applyFilter(e) {
        e.preventDefault();
        router.get(route('availability.index'), {
            check_in:  checkIn,
            check_out: checkOut,
            sort:      sortBy,
        }, { preserveState: true });
    }

    // Flatten all rooms for sort view
    const allRooms = floors.flatMap(f =>
        f.rooms.map(r => ({ ...r, floor: f }))
    );

    // Sort options
    const sortedRooms = (sort) => {
        const rooms = [...allRooms];
        if (sort === 'status') return rooms.sort((a, b) => a.status.localeCompare(b.status));
        if (sort === 'type')   return rooms.sort((a, b) => (a.room_type?.name ?? '').localeCompare(b.room_type?.name ?? ''));
        if (sort === 'price')  return rooms.sort((a, b) => (a.room_type?.base_price ?? 0) - (b.room_type?.base_price ?? 0));
        if (sort === 'available') return rooms.sort((a, b) => Number(a.is_booked) - Number(b.is_booked));
        return rooms; // default: floor order
    };

    const nights = Math.max(1, Math.ceil(
        (new Date(filters.checkOut) - new Date(filters.checkIn)) / 86400000
    ));

    const isFloorView = !filters.sortBy || filters.sortBy === 'floor';

    const cartTotal = selectedRooms.reduce((acc, curr) => {
        const hasBreakfastFacility = Array.isArray(curr.room.room_type?.facilities) && curr.room.room_type.facilities.some(f => f.toLowerCase().includes('breakfast') || f.toLowerCase().includes('sarapan'));
        const includedBreakfast = hasBreakfastFacility || curr.room.room_type?.name?.toLowerCase().includes('breakfast');

        let total = Number(curr.room.room_type?.base_price ?? 0) * nights;
        if (curr.extrabed) total += (200000 * nights);
        if (curr.breakfast && !includedBreakfast) total += (150000 * nights);
        return acc + total;
    }, 0);

    function proceedToCheckout() {
        router.post(route('bookings.checkin'), {
            rooms: selectedRooms.map(r => ({ id: r.id, extrabed: r.extrabed, breakfast: r.breakfast })),
            check_in: filters.checkIn,
            check_out: filters.checkOut
        });
    }

    return (
        <AppLayout title="Ketersediaan Kamar">
            {/* Filter Bar */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={applyFilter} className="row g-3 align-items-end">
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label small fw-semibold text-body-secondary mb-1">Check-In</label>
                            <DatePicker value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label small fw-semibold text-body-secondary mb-1">Check-Out</label>
                            <DatePicker value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label small fw-semibold text-body-secondary mb-1">Urutkan</label>
                            <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="floor">Per Lantai</option>
                                <option value="available">Tersedia Dulu</option>
                                <option value="status">Status</option>
                                <option value="type">Tipe Kamar</option>
                                <option value="price">Harga</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <button type="submit" className="btn btn-primary w-100 m-0 fw-semibold">
                                <i className="bi bi-search me-2"></i>Tampilkan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Summary */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
                <StatCard label="Total Kamar" value={summary.total} color="primary" icon="bi-door-open" />
                <StatCard label="Tersedia" value={summary.available} color="success" icon="bi-check-circle" />
                <StatCard label="Terisi" value={summary.occupied} color="danger" icon="bi-people" />
                <StatCard label="OOO / OOS" value={summary.ooo} color="secondary" icon="bi-tools" />
            </div>

            {/* Legend */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body py-3 px-4 d-flex flex-wrap align-items-center column-gap-4 row-gap-2">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <span className="small fw-semibold text-body-secondary me-1">Ketersediaan:</span>
                        {Object.values(AVAILABILITY).map(a => (
                            <span key={a.label} className={`badge bg-${a.color}-subtle text-${a.color} border border-${a.color}-subtle rounded-pill`} style={{ fontSize: '0.7rem' }}>{a.label}</span>
                        ))}
                    </div>
                    <div className="vr d-none d-lg-block"></div>
                    <div className="d-flex flex-wrap align-items-center column-gap-3 row-gap-1">
                        <span className="small fw-semibold text-body-secondary me-1">Housekeeping:</span>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <span key={key} className="d-inline-flex align-items-center gap-1 text-body-secondary" style={{ fontSize: '0.75rem' }}>
                                <StatusDot color={cfg.color} /> {cfg.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floor View */}
            {isFloorView ? (
                floors.map(floor => (
                    <div key={floor.id} className="mb-5">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                                <i className="bi bi-layers-fill fs-5"></i>
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold">Lantai {floor.floor_number}</h5>
                                {floor.floor_name && <small className="text-body-secondary">{floor.floor_name}</small>}
                            </div>
                            <span className="badge bg-body-secondary text-body-secondary rounded-pill fw-semibold">{floor.rooms.length} Kamar</span>
                            <div className="flex-grow-1 border-bottom"></div>
                        </div>

                        {floor.rooms.length === 0 ? (
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center text-body-secondary py-5">Tidak ada kamar di lantai ini</div>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                                {floor.rooms.map(room => (
                                    <RoomCard key={room.id} room={room} nights={nights} showFloor={false}
                                        isSelected={!!selectedRooms.find(r => r.id === room.id)}
                                        config={selectedRooms.find(r => r.id === room.id)}
                                        onSelect={handleSelectRoom}
                                        onConfigChange={handleConfigChange}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                /* Sorted flat view */
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        {sortedRooms(filters.sortBy).length === 0 ? (
                            <div className="text-center text-body-secondary py-5">Tidak ada kamar</div>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                                {sortedRooms(filters.sortBy).map(room => (
                                    <RoomCard key={room.id} room={room} nights={nights} showFloor={true}
                                        isSelected={!!selectedRooms.find(r => r.id === room.id)}
                                        config={selectedRooms.find(r => r.id === room.id)}
                                        onSelect={handleSelectRoom}
                                        onConfigChange={handleConfigChange}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Sticky Checkout Bar */}
            {selectedRooms.length > 0 && (
                <>
                    <div style={{ height: 96 }}></div>
                    <div className="position-fixed bottom-0 start-0 end-0 bg-body border-top p-3 z-3" style={{ boxShadow: '0 -0.5rem 1.5rem rgba(0, 0, 0, 0.08)' }}>
                        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 48, height: 48 }}>
                                    <i className="bi bi-cart-fill fs-5"></i>
                                </div>
                                <div>
                                    <div className="fw-bold">{selectedRooms.length} Kamar Terpilih</div>
                                    <div className="small text-body-secondary">Total Estimasi: <strong className="text-primary">Rp {cartTotal.toLocaleString('id-ID')}</strong></div>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-lg m-0 px-4 fw-semibold" onClick={proceedToCheckout}>
                                Lanjutkan ke Registrasi <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}
