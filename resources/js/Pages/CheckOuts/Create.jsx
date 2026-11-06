import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Swal from 'sweetalert2';

function hitungMalam(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const ci = String(checkIn).substring(0, 10);
    const co = String(checkOut).substring(0, 10);
    const [y1, m1, d1] = ci.split('-').map(Number);
    const [y2, m2, d2] = co.split('-').map(Number);
    if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;
    return Math.max(0, Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000));
}

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    const s = String(dateStr).substring(0, 10);
    const [y, m, d] = s.split('-');
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

const formatRp = v => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function Create({ checkin, folio }) {
    const tasks = checkin.room?.housekeepingTasks || checkin.room?.housekeeping_tasks || [];
    const hasInspectionTask = tasks.some(t => {
        if (t.task_type !== 'inspection') return false;
        return new Date(t.created_at) >= new Date(checkin.created_at);
    });
    
    const [isHkRequested, setIsHkRequested] = useState(hasInspectionTask);
    const [isPrinted, setIsPrinted] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        check_in_id: checkin.id,
        payment_amount: '',
        payment_method: 'Cash',
        feedback_rating: '',
        feedback_notes: '',
        notes: '',
    });

    const nights = hitungMalam(
        checkin.reservation?.check_in_date,
        checkin.reservation?.check_out_date
    );

    function submit(e) {
        e.preventDefault();

        // 1. Validasi HK
        if (!isHkRequested) {
            Swal.fire({
                title: 'Inspeksi HK Diperlukan',
                text: 'Harap minta Inspeksi HK terlebih dahulu dengan menekan tombol Minta Inspeksi.',
                icon: 'warning',
                confirmButtonText: 'Mengerti'
            });
            return;
        }

        const remaining = Number(folio?.balance) - Number(data.payment_amount || 0);

        // 2. Validasi Folio (Tagihan belum lunas)
        if (remaining > 0) {
            Swal.fire({
                title: 'Tagihan Belum Lunas',
                text: 'Ditemukan sisa tagihan. Silakan Buka Detail Folio atau lunasi pada form pelunasan di halaman ini.',
                icon: 'warning',
                confirmButtonText: 'Buka Folio',
                showCancelButton: true,
                cancelButtonText: 'Tutup'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = route('folios.show', folio.id);
                }
            });
            return;
        }

        // 3. Validasi Cetak
        if (!isPrinted) {
            Swal.fire({
                title: 'Cetak Folio',
                text: 'Pembayaran sudah settle. Silakan tekan tombol "Cetak Folio Lunas" untuk memberikan bukti kepada tamu.',
                icon: 'info',
                confirmButtonText: 'Mengerti'
            });
            return;
        }

        // Semua terpenuhi
        Swal.fire({
            title: 'Konfirmasi Check-Out',
            text: `Apakah Anda yakin tamu ${checkin.reservation?.guest?.full_name} siap check-out?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Check-Out',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('checkouts.store'), {
                    onSuccess: () => {
                        Swal.fire('Berhasil!', `Tamu ${checkin.reservation?.guest?.full_name} berhasil check-out.`, 'success');
                    }
                });
            }
        });
    }

    const reservation = checkin.reservation || {};
    const guest = reservation.guest || {};
    const charges = folio?.charges || [];
    
    // Aggregate dates and nights
    const arrivalDate = reservation.check_in_date ? new Date(reservation.check_in_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}) : '';
    const departureDate = reservation.check_out_date ? new Date(reservation.check_out_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}) : '';
    const totalNight = reservation.check_out_date ? Math.round((new Date(reservation.check_out_date) - new Date(reservation.check_in_date)) / (1000 * 60 * 60 * 24)) : 0;
    
    const roomTypes = reservation.room_type?.name || checkin.room?.room_number || '';
    const totalGuest = reservation.adults || 0;
    
    // Calculate Payment Breakdown
    let roomCharge = 0;
    let extraBedCharge = 0;
    let fnbCharge = 0;
    let tax = 0;
    let serviceCharge = 0;
    
    charges.forEach(c => {
        if (c.charge_type === 'room') roomCharge += Number(c.amount);
        else if (c.charge_type === 'extra_bed') extraBedCharge += Number(c.amount);
        else if (c.charge_type === 'fnb') fnbCharge += Number(c.amount);
        else if (c.charge_type === 'other' && String(c.description).includes('Tax')) tax += Number(c.amount);
        else if (c.charge_type === 'other' && String(c.description).includes('Service')) serviceCharge += Number(c.amount);
        else roomCharge += Number(c.amount);
    });

    const additionalCharge = extraBedCharge + fnbCharge;
    const grandTotal = Number(folio?.total_charges || 0);
    
    const lastPayment = folio?.payments && folio.payments.length > 0 ? folio.payments[folio.payments.length - 1] : null;
    let paymentMethodDisplay = 'Cash';
    if (lastPayment && lastPayment.payment_method) {
        const ml = { cash: 'Tunai', debit_card: 'Debit', credit_card: 'Kredit', transfer: 'Transfer', city_ledger: 'City Ledger' };
        paymentMethodDisplay = ml[lastPayment.payment_method] || lastPayment.payment_method;
    }
    const remainingAfterForm = Number(folio?.balance) - Number(data.payment_amount || 0);
    const paymentStatusDisplay = folio?.status === 'settled' || remainingAfterForm <= 0 ? 'PAID' : 'UNPAID';

    return (
        <AppLayout title="Proses Check-Out" breadcrumbs={[
            { label: 'Dashboard', href: route('dashboard') },
            { label: 'Reservasi', href: route('reservations.index') },
            { label: checkin.reservation?.reservation_code },
            { label: 'Check-Out' },
        ]}>
            <div className="row d-print-none">
                {/* Check-In Summary */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header pb-2 border-bottom">
                            <h4 className="card-title fs-5 mb-0">Informasi Tamu & Kamar</h4>
                        </div>
                        <div className="card-body mt-3">
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <small className="text-muted d-block">Tamu</small>
                                    <span className="fw-bold fs-6">{checkin.reservation?.guest?.full_name}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted d-block">No. Reservasi</small>
                                        <span className="fw-semibold">{checkin.reservation?.reservation_code}</span>
                                    </div>
                                    <div className="text-end">
                                        <small className="text-muted d-block">Kamar</small>
                                        <span className="badge bg-light-primary text-primary fs-6">{checkin.room?.room_number}</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted d-block">Check-In</small>
                                        <span className="fw-semibold">{formatTanggal(checkin.reservation?.check_in_date)}</span>
                                    </div>
                                    <div className="text-end">
                                        <small className="text-muted d-block">Check-Out</small>
                                        <span className="fw-semibold">{formatTanggal(checkin.reservation?.check_out_date)}</span>
                                    </div>
                                </div>
                                <div className="alert alert-light-info py-2 px-3 mb-0 d-flex justify-content-between align-items-center">
                                    <span className="text-info fw-semibold"><i className="bi bi-moon-stars me-2"></i>Durasi</span>
                                    <span className="text-info fw-bold">{nights} Malam</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Folio Summary */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm border-0" style={{ background: 'var(--bs-card-bg)' }}>
                        <div className="card-header pb-2 border-bottom">
                            <h4 className="card-title fs-5 mb-0">Ringkasan Pembayaran</h4>
                        </div>
                        <div className="card-body mt-3 d-flex flex-column">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Total Tagihan</span>
                                <span className="fw-semibold">{formatRp(folio?.total_charges ?? 0)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Total Dibayar</span>
                                <span className="text-success fw-semibold">- {formatRp(folio?.total_payments ?? 0)}</span>
                            </div>
                            
                            <hr className="my-2" />
                            
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-4">
                                <span className="fw-bold fs-6">Sisa Tagihan</span>
                                <span className={`fw-bold fs-4 ${Number(folio?.balance) > 0 ? 'text-danger' : 'text-success'}`}>
                                    {formatRp(folio?.balance ?? 0)}
                                </span>
                            </div>

                            <div className="mt-auto">
                                <div className="alert alert-info d-flex align-items-start mb-0 py-2 px-3 border-0">
                                    <i className="bi bi-info-circle me-2 mt-1"></i>
                                    <small style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                        Pastikan sisa tagihan adalah Rp 0 sebelum memproses Check-Out. Sisa tagihan positif berarti tamu harus membayar kekurangan.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Check-Out Form */}
                <div className="col-lg-4 col-md-12 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header pb-2 border-bottom">
                            <h4 className="card-title fs-5 mb-0">Form Check-Out</h4>
                        </div>
                        <div className="card-body mt-3">
                            <form onSubmit={submit} className="d-flex flex-column h-100">
                                {Number(folio?.balance) > 0 && (
                                    <>
                                        <h6 className="mb-2 fs-6 text-primary">Pelunasan Tagihan</h6>
                                        <div className="row mb-4">
                                            <div className="col-7">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text">Rp</span>
                                                    <input type="number"
                                                        className={`form-control ${errors.payment_amount ? 'is-invalid' : ''}`}
                                                        value={data.payment_amount} onChange={e => setData('payment_amount', e.target.value)}
                                                        min="0" step="1" placeholder={folio?.balance} />
                                                </div>
                                                {errors.payment_amount && <div className="text-danger small mt-1">{errors.payment_amount}</div>}
                                            </div>
                                            <div className="col-5">
                                                <select className={`form-select form-select-sm ${errors.payment_method ? 'is-invalid' : ''}`}
                                                    value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}>
                                                    <option value="Cash">Cash / Tunai</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Credit Card">Credit Card</option>
                                                    <option value="E-Wallet">E-Wallet</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <h6 className="mb-2 fs-6">Umpan Balik (Opsional)</h6>
                                <div className="mb-3">
                                    <div className="d-flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} type="button"
                                                className={`btn btn-sm ${star <= Number(data.feedback_rating) ? 'btn-warning text-white' : 'btn-outline-warning'}`}
                                                onClick={() => setData('feedback_rating', star)}
                                                style={{ padding: '0.2rem 0.5rem' }}>
                                                <i className={`bi ${star <= Number(data.feedback_rating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                        <textarea className={`form-control form-control-sm ${errors.feedback_notes ? 'is-invalid' : ''}`}
                                            rows="2" value={data.feedback_notes} onChange={e => setData('feedback_notes', e.target.value)}
                                            placeholder="Tuliskan pengalaman tamu, saran perbaikan, dll." />
                                    </div>

                                    <div className="mt-auto d-grid gap-2">
                                        <button type="button" className="btn btn-info" onClick={() => {
                                            router.post(route('checkouts.request-inspection', checkin.id), {}, {
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: () => {
                                                    setIsHkRequested(true);
                                                    Swal.fire('Berhasil', 'Permintaan inspeksi HK telah dikirim.', 'success');
                                                }
                                            })
                                        }}>
                                            <i className="bi bi-search me-2"></i>Minta Inspeksi HK (Minibar/Kerusakan)
                                        </button>
                                        
                                        <button type="button" className="btn btn-secondary" onClick={() => {
                                            setIsPrinted(true);
                                            window.print();
                                        }}>
                                            <i className="bi bi-printer me-2"></i>Cetak Folio Lunas
                                        </button>

                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing
                                            ? <><span className="spinner-border spinner-border-sm me-2" />Memproses...</>
                                            : <><i className="bi bi-check2-circle me-2" />Konfirmasi Check-Out</>}
                                        </button>

                                        {folio && (
                                            <a href={route('folios.show', folio.id)} className="btn btn-outline-secondary mt-2">
                                                <i className="bi bi-receipt me-2"></i>Buka Detail Folio
                                            </a>
                                        )}
                                    </div>
                                </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Only Layout */}
            <div className="d-none d-print-block print-container print-bg-white" style={{ maxWidth: '850px' }}>
                <div className="card-body p-5 print-p-0">
                    {/* Header: Logo & Folio Status */}
                    <div className="row align-items-center mb-5 pb-4 border-bottom">
                        <div className="col-sm-6 mb-4 mb-sm-0 text-center text-sm-start">
                            <img src="/mazer/images/logo/logo-hotel-asri.png" alt="Hotel Asri" className="print-logo mb-2" style={{ height: '48px', objectFit: 'contain' }} />
                            <div className="text-muted small" style={{ letterSpacing: '0.5px' }}>Jl. Raya Condet No. 1, Jakarta Timur<br/>+62 21 1234 5678</div>
                        </div>
                        <div className="col-sm-6 text-center text-sm-end">
                            <h4 className="fw-bold mb-1 text-uppercase tracking-wider">Guest Folio / Invoice</h4>
                            <div className="text-muted">Folio No: <strong className="text-body">{folio?.folio_number}</strong></div>
                            <div className="text-muted small mt-1">Date: {new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</div>
                        </div>
                    </div>

                    {/* Details Section: CSS Grid */}
                    <div className="row g-4 mb-5 pb-4 border-bottom">
                        <div className="col-12">
                            <h6 className="fw-bold text-uppercase text-muted mb-4" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Guest Details</h6>
                            <div className="row g-4">
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Primary Guest</div>
                                    <div className="fw-medium text-body">{guest.full_name || '-'}</div>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Contact Phone</div>
                                    <div className="fw-medium text-body">{guest.phone || '-'}</div>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Email Address</div>
                                    <div className="fw-medium text-body">{guest.email || '-'}</div>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Company</div>
                                    <div className="fw-medium text-body">{guest.company || '-'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 mt-5">
                            <h6 className="fw-bold text-uppercase text-muted mb-4" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Stay Information</h6>
                            <div className="row g-4">
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Check-in</div>
                                    <div className="fw-medium text-body">{arrivalDate} <span className="text-muted fw-normal">(14:00)</span></div>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Check-out</div>
                                    <div className="fw-medium text-body">{departureDate} <span className="text-muted fw-normal">(12:00)</span></div>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Duration & Pax</div>
                                    <div className="fw-medium text-body">{totalNight} Night(s) <span className="text-muted mx-1">·</span> {totalGuest} Guest(s)</div>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <div className="text-muted small mb-1">Room Types</div>
                                    <div className="fw-medium text-body">{roomTypes}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="mb-5">
                        <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Charges Summary</h6>
                        <div className="table-responsive">
                            <table className="table align-middle text-body">
                                <thead>
                                    <tr className="border-top border-bottom text-muted" style={{ fontSize: '0.9rem' }}>
                                        <th className="fw-normal py-3 border-0">Description</th>
                                        <th className="fw-normal py-3 border-0 text-end" style={{ width: '200px' }}>Amount (IDR)</th>
                                    </tr>
                                </thead>
                                <tbody className="border-bottom">
                                    {charges.length > 0 ? (
                                        <>
                                            <tr>
                                                <td className="py-3 border-0">Room Charge</td>
                                                <td className="py-3 border-0 text-end fw-medium">{roomCharge.toLocaleString('id-ID')}</td>
                                            </tr>
                                            {additionalCharge > 0 && (
                                                <tr>
                                                    <td className="py-3 border-0">Additional Charge (Extra Bed, F&B)</td>
                                                    <td className="py-3 border-0 text-end fw-medium">{additionalCharge.toLocaleString('id-ID')}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="py-3 border-0">Service Charge (10%)</td>
                                                <td className="py-3 border-0 text-end fw-medium">{serviceCharge.toLocaleString('id-ID')}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 border-0">Tax (11%)</td>
                                                <td className="py-3 border-0 text-end fw-medium">{tax.toLocaleString('id-ID')}</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td className="py-3 border-0">Total Folio Charge</td>
                                            <td className="py-3 border-0 text-end fw-medium">{grandTotal.toLocaleString('id-ID')}</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="py-4 border-0 text-end fw-bold text-muted" style={{ fontSize: '1.1rem' }}>GRAND TOTAL</td>
                                        <td className="py-4 border-0 text-end fw-bold text-body" style={{ fontSize: '1.25rem' }}>Rp {grandTotal.toLocaleString('id-ID')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Footer Info: Payment Method & Notes */}
                    <div className="row g-5">
                        <div className="col-sm-6">
                            <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Payment Details</h6>
                            <div>
                                <div className="mb-2 d-flex align-items-center">
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center">
                                        <i className="bi bi-check-circle-fill me-2"></i> Paid via {paymentMethodDisplay}
                                    </span>
                                </div>
                                {String(paymentMethodDisplay).toLowerCase() === 'transfer' && (
                                    <div className="text-muted small" style={{ lineHeight: '1.6' }}>
                                        Settled via Transfer to:<br/>
                                        <strong className="text-body">Bank Mandiri</strong> (A/N: Hotel Asri)<br/>
                                        Rek: 123-456-789-000
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Important Notes</h6>
                            <ul className="text-muted small ps-3 mb-0" style={{ lineHeight: '1.6' }}>
                                <li className="mb-1">Check-in time is from <strong className="text-body">14:00</strong> and Check-out time is until <strong className="text-body">12:00</strong>.</li>
                                <li className="mb-1">Tamu diwajibkan mengembalikan seluruh kunci kamar.</li>
                                <li>Terima kasih telah menginap di Hotel Asri.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .tracking-wider { letter-spacing: 0.05em; }
                
                @media print {
                    @page { size: A4 portrait; margin: 15mm; }
                    body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print-bg-white { background-color: white !important; padding: 0 !important; }
                    .print-container { display: block !important; max-width: 100% !important; width: 100% !important; padding: 0 !important; }
                    .d-print-none { display: none !important; }
                    #sidebar, .sidebar-wrapper, header, .page-title { display: none !important; }
                    #main { margin-left: 0 !important; padding: 0 !important; }
                    
                    /* Clean up print artifacts */
                    .print-no-border { border: none !important; }
                    .print-no-shadow { box-shadow: none !important; }
                    .print-p-0 { padding: 0 !important; }
                    
                    /* Typography Force Black for Printer */
                    body, .card-body, * { 
                        color: #000 !important;
                        font-family: 'Inter', 'Helvetica Neue', sans-serif !important; 
                    }
                    .text-muted { color: #555 !important; }
                    .text-body { color: #000 !important; }
                    .badge { 
                        color: #000 !important; 
                        border-color: #000 !important; 
                        background-color: transparent !important; 
                    }
                    .card { background-color: transparent !important; border: none !important; }
                    
                    /* Ensure tables print properly */
                    .table { margin-bottom: 0 !important; }
                    .table th, .table td { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; border-color: #888 !important; }
                }
            `}</style>
        </AppLayout>
    );
}
