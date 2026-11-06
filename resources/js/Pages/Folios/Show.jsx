import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DatePicker from '@/Components/DatePicker';

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    const s = String(dateStr).substring(0, 10);
    const [y, m, d] = s.split('-');
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function AddChargeModal({ folio, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        charge_type: 'room',
        description: '',
        quantity: 1,
        unit_price: '',
        charge_date: new Date().toISOString().slice(0, 10),
    });

    function submit(e) {
        e.preventDefault();
        post(route('folios.addCharge', folio.id), {
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Tagihan</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <form onSubmit={submit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Jenis Tagihan <span className="text-danger">*</span></label>
                                <select className={`form-select ${errors.charge_type ? 'is-invalid' : ''}`}
                                    value={data.charge_type} onChange={e => setData('charge_type', e.target.value)}>
                                    <option value="room">Kamar</option>
                                    <option value="fnb">F&B</option>
                                    <option value="laundry">Laundry</option>
                                    <option value="extra_bed">Extra Bed</option>
                                    <option value="minibar">Minibar</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                {errors.charge_type && <div className="invalid-feedback">{errors.charge_type}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Deskripsi <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    value={data.description} onChange={e => setData('description', e.target.value)} />
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Qty <span className="text-danger">*</span></label>
                                    <input type="number" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                        value={data.quantity} onChange={e => setData('quantity', e.target.value)} min="1" />
                                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Harga Satuan <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rp</span>
                                        <input type="number" className={`form-control ${errors.unit_price ? 'is-invalid' : ''}`}
                                            value={data.unit_price} onChange={e => setData('unit_price', e.target.value)} min="0" />
                                        {errors.unit_price && <div className="invalid-feedback">{errors.unit_price}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tanggal</label>
                                <DatePicker className="form-control"
                                    value={data.charge_date} onChange={e => setData('charge_date', e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={onClose}>Batal</button>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function AddPaymentModal({ folio, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        payment_type: 'payment',
        payment_method: 'Cash',
        amount: '',
        notes: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('folios.addPayment', folio.id), {
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Pembayaran</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <form onSubmit={submit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Jenis <span className="text-danger">*</span></label>
                                <select className={`form-select ${errors.payment_type ? 'is-invalid' : ''}`}
                                    value={data.payment_type} onChange={e => setData('payment_type', e.target.value)}>
                                    <option value="payment">Pembayaran</option>
                                    <option value="refund">Refund</option>
                                </select>
                                {errors.payment_type && <div className="invalid-feedback">{errors.payment_type}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Metode <span className="text-danger">*</span></label>
                                <select className={`form-select ${errors.payment_method ? 'is-invalid' : ''}`}
                                    value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}>
                                    <option value="Cash">Cash / Tunai</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="E-Wallet">E-Wallet</option>
                                </select>
                                {errors.payment_method && <div className="invalid-feedback">{errors.payment_method}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Jumlah <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text">Rp</span>
                                    <input type="number" className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                        value={data.amount} onChange={e => setData('amount', e.target.value)} min="0" step="1" />
                                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Catatan</label>
                                <textarea className="form-control" rows="2"
                                    value={data.notes} onChange={e => setData('notes', e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={onClose}>Batal</button>
                            <button type="submit" className="btn btn-success" disabled={processing}>
                                {processing ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


const chargeTypeLabel = {
    room: 'Kamar', fnb: 'F&B', laundry: 'Laundry',
    extra_bed: 'Extra Bed', minibar: 'Minibar', other: 'Lainnya',
};

const paymentTypeLabel = { deposit: 'Deposit', payment: 'Pembayaran', refund: 'Refund' };
const methodLabel = {
    'Cash': 'Cash', 'Bank Transfer': 'Bank Transfer', 'Credit Card': 'Credit Card', 'E-Wallet': 'E-Wallet',
    cash: 'Tunai', debit_card: 'Debit', credit_card: 'Kredit',
    transfer: 'Transfer', city_ledger: 'City Ledger',
};

export default function Show({ folio }) {
    const { auth } = usePage().props;
    const [showCharge, setShowCharge] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const canCharge = auth.permissions.includes('folio.charge');
    const canPayment = auth.permissions.includes('folio.payment');
    const canSettle = auth.permissions.includes('folio.settle');
    const canFnb = auth.permissions.includes('fnb.create');

    const statusBadge = {
        open: 'badge bg-primary',
        settled: 'badge bg-success',
        void: 'badge bg-secondary',
    };

    function settle() {
        if (!confirm('Tandai folio ini sebagai settled?')) return;
        router.post(route('folios.settle', folio.id));
    }

    const checkInRecord = folio.check_in || {};
    const reservation = checkInRecord.reservation || {};
    const guest = folio.guest || {};
    const charges = folio.charges || [];
    
    // Aggregate dates and nights
    const arrivalDate = reservation.check_in_date ? new Date(reservation.check_in_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}) : '';
    const departureDate = reservation.check_out_date ? new Date(reservation.check_out_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}) : '';
    const totalNight = reservation.check_out_date ? Math.round((new Date(reservation.check_out_date) - new Date(reservation.check_in_date)) / (1000 * 60 * 60 * 24)) : 0;
    
    const roomTypes = reservation.room_type?.name || checkInRecord.room?.room_number || '';
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
    const grandTotal = Number(folio.total_charges);
    
    const lastPayment = folio.payments && folio.payments.length > 0 ? folio.payments[folio.payments.length - 1] : null;
    const paymentMethodDisplay = lastPayment ? methodLabel[lastPayment.payment_method] : 'Cash';
    const paymentStatusDisplay = (folio.status === 'settled' || Number(folio.balance) <= 0) ? 'PAID' : 'UNPAID';

    // Hitung tagihan yang belum dibayar (FIFO)
    let remainingPayments = Number(folio.total_payments) || 0;
    const unpaidCharges = [];
    (folio.charges || []).forEach(c => {
        const amt = Number(c.amount);
        if (remainingPayments >= amt) {
            remainingPayments -= amt;
        } else if (remainingPayments > 0) {
            unpaidCharges.push({ ...c, unpaid_amount: amt - remainingPayments });
            remainingPayments = 0;
        } else {
            unpaidCharges.push({ ...c, unpaid_amount: amt });
        }
    });

    return (
        <AppLayout title={`Folio ${folio.folio_number}`}>
            {showCharge && <AddChargeModal folio={folio} onClose={() => setShowCharge(false)} />}
            {showPayment && <AddPaymentModal folio={folio} onClose={() => setShowPayment(false)} />}

            <div className="row d-print-none">
                {/* Folio Header */}
                <div className="col-12 mb-3">
                    <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div>
                                <h5 className="mb-1">
                                    Folio #{folio.folio_number}
                                    <span className={`ms-2 ${statusBadge[folio.status] ?? 'badge bg-secondary'}`}>
                                        {folio.status?.toUpperCase()}
                                    </span>
                                </h5>
                                <small className="text-muted">
                                    Tamu: <strong>{folio.guest?.full_name}</strong>
                                    {folio.check_in && (
                                        <> &mdash; Kamar: <strong>{folio.check_in?.room?.room_number}</strong></>
                                    )}
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-secondary" onClick={() => window.print()}>
                                    <i className="bi bi-printer me-1" />Print
                                </button>
                                {folio.status === 'open' && (
                                    <>
                                        {canCharge && (
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowCharge(true)}>
                                                <i className="bi bi-plus-circle me-1" />Tagihan
                                            </button>
                                        )}
                                        {canPayment && (
                                            <button className="btn btn-sm btn-outline-success" onClick={() => setShowPayment(true)}>
                                                <i className="bi bi-cash me-1" />Pembayaran
                                            </button>
                                        )}
                                        {canSettle && (
                                            <button className="btn btn-sm btn-success" onClick={settle}>
                                                <i className="bi bi-check-circle me-1" />Settle
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charges */}
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-header">
                            <h6 className="card-title mb-0">Daftar Tagihan</h6>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%', minWidth: '110px' }}>Tanggal</th>
                                        <th style={{ width: '12%', minWidth: '95px' }}>Jenis</th>
                                        <th style={{ width: '35%', minWidth: '160px' }}>Deskripsi</th>
                                        <th className="text-center" style={{ width: '8%', minWidth: '60px' }}>Qty</th>
                                        <th className="text-end" style={{ width: '15%', minWidth: '110px' }}>Harga</th>
                                        <th className="text-end" style={{ width: '15%', minWidth: '110px' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folio.charges?.length === 0 && (
                                        <tr><td colSpan="6" className="text-center text-muted py-3">Belum ada tagihan</td></tr>
                                    )}
                                    {folio.charges?.map(c => (
                                        <tr key={c.id}>
                                            <td>{formatTanggal(c.charge_date)}</td>
                                            <td><span className="badge bg-light text-dark">{chargeTypeLabel[c.charge_type]}</span></td>
                                            <td>{c.description}</td>
                                            <td className="text-center">{c.quantity}</td>
                                            <td className="text-end">Rp {Number(c.unit_price).toLocaleString('id-ID')}</td>
                                            <td className="text-end">Rp {Number(c.amount).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="card">
                        <div className="card-header">
                            <h6 className="card-title mb-0">Riwayat Pembayaran</h6>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th style={{ width: '20%', minWidth: '110px' }}>Tanggal</th>
                                        <th style={{ width: '25%', minWidth: '130px' }}>No. Pembayaran</th>
                                        <th style={{ width: '15%', minWidth: '100px' }}>Jenis</th>
                                        <th style={{ width: '18%', minWidth: '100px' }}>Metode</th>
                                        <th className="text-end" style={{ width: '22%', minWidth: '120px' }}>Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folio.payments?.length === 0 && (
                                        <tr><td colSpan="5" className="text-center text-muted py-3">Belum ada pembayaran</td></tr>
                                    )}
                                    {folio.payments?.map(p => (
                                        <tr key={p.id}>
                                            <td>{formatTanggal(p.payment_date)}</td>
                                            <td><code>{p.payment_number}</code></td>
                                            <td>
                                                <span className={`badge ${p.payment_type === 'refund' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                    {paymentTypeLabel[p.payment_type]}
                                                </span>
                                            </td>
                                            <td>{methodLabel[p.payment_method]}</td>
                                            <td className={`text-end ${p.payment_type === 'refund' ? 'text-danger' : 'text-success'}`}>
                                                {p.payment_type === 'refund' ? '-' : ''}Rp {Number(p.amount).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h6 className="card-title mb-0">Ringkasan</h6>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Tagihan</span>
                                <strong>Rp {Number(folio.total_charges).toLocaleString('id-ID')}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Pembayaran</span>
                                <strong className="text-success">Rp {Number(folio.total_payments).toLocaleString('id-ID')}</strong>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Sisa Tagihan</span>
                                <strong className={Number(folio.balance) > 0 ? 'text-danger fs-5' : 'text-success fs-5'}>
                                    Rp {Number(folio.balance).toLocaleString('id-ID')}
                                </strong>
                            </div>

                            {unpaidCharges.length > 0 && (
                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="fw-bold fs-6 mb-2 text-secondary">Rincian Belum Dibayar:</h6>
                                    <ul className="list-group list-group-flush small">
                                        {unpaidCharges.map(c => (
                                            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 bg-transparent border-0">
                                                <div>
                                                    <span className="fw-medium">{chargeTypeLabel[c.charge_type]}</span>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{c.description}</div>
                                                </div>
                                                <span className="fw-semibold text-danger">Rp {c.unpaid_amount.toLocaleString('id-ID')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                                    <span className={`badge ${paymentStatusDisplay === 'PAID' ? 'bg-success border-success text-success' : 'bg-warning border-warning text-warning'} bg-opacity-10 border border-opacity-25 rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center`}>
                                        <i className={`bi ${paymentStatusDisplay === 'PAID' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i> {paymentStatusDisplay === 'PAID' ? `Paid via ${paymentMethodDisplay}` : 'Payment Unsettled'}
                                    </span>
                                </div>
                                {paymentStatusDisplay === 'PAID' && String(paymentMethodDisplay).toLowerCase() === 'transfer' && (
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
                                <li className="mb-1">Reservasi tanpa jaminan (non-guaranteed) akan otomatis dibatalkan pada pukul 18:00 pada hari kedatangan.</li>
                                <li className="mb-1">Pembatalan reservasi yang dilakukan H-1 (kurang dari 24 jam) akan dikenakan biaya pembatalan sebesar 1 malam.</li>
                                <li>Tamu diwajibkan untuk menunjukkan kartu identitas (KTP/Paspor) yang masih berlaku pada saat check-in.</li>
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
