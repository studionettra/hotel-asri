import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Confirmed({ booking }) {
    const handlePrint = () => {
        window.print();
    };

    const firstRes = booking.reservations && booking.reservations.length > 0 ? booking.reservations[0] : null;
    const guest = firstRes?.guest || {};
    const checkInRecord = firstRes?.check_in || {};
    const folio = checkInRecord?.guest_folio || {};
    const charges = folio?.charges || [];
    
    // Aggregate dates and nights
    const arrivalDate = firstRes ? new Date(firstRes.check_in_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}) : '';
    const departureDate = firstRes ? new Date(firstRes.check_out_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}) : '';
    const totalNight = firstRes ? Math.round((new Date(firstRes.check_out_date) - new Date(firstRes.check_in_date)) / (1000 * 60 * 60 * 24)) : 0;
    
    // Combine room types & adults
    const roomTypesList = booking.reservations ? booking.reservations.map(r => r.room_type?.name) : [];
    const uniqueRoomTypes = [...new Set(roomTypesList)];
    const roomTypes = uniqueRoomTypes.length > 0 ? uniqueRoomTypes.join(', ') : '';
    const totalGuest = booking.reservations ? booking.reservations.reduce((sum, r) => sum + r.adults, 0) : 0;

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
        else roomCharge += Number(c.amount); // Fallback to room charge for unknown types
    });

    const additionalCharge = extraBedCharge + fnbCharge;
    const grandTotal = Number(booking.total_amount);

    return (
        <div className="min-vh-100 py-5 print-bg-white">
            <Head title="Reservation Confirmation" />
            
            <div className="container print-container" style={{ maxWidth: '850px' }}>
                {/* Top Action Bar */}
                <div className="d-flex justify-content-between align-items-center mb-5 d-print-none">
                    <Link href={route('availability.index')} className="btn btn-outline-secondary px-4">
                        <i className="bi bi-arrow-left me-2"></i> Kembali ke Beranda
                    </Link>
                    <button className="btn btn-primary px-4 shadow-sm" onClick={handlePrint}>
                        <i className="bi bi-printer me-2"></i> Cetak Reservasi
                    </button>
                </div>

                <div className="card shadow-sm border-0 print-no-border print-no-shadow" id="print-area">
                    <div className="card-body p-5 print-p-0">
                        
                        {/* Header: Logo & Booking Status */}
                        <div className="row align-items-center mb-5 pb-4 border-bottom">
                            <div className="col-sm-6 mb-4 mb-sm-0 text-center text-sm-start">
                                <img src="/mazer/images/logo/logo-hotel-asri.png" alt="Hotel Asri" className="print-logo mb-2" style={{ height: '48px', objectFit: 'contain' }} />
                                <div className="text-muted small" style={{ letterSpacing: '0.5px' }}>Jl. Raya Condet No. 1, Jakarta Timur<br/>+62 21 1234 5678</div>
                            </div>
                            <div className="col-sm-6 text-center text-sm-end">
                                <h4 className="fw-bold mb-1 text-uppercase tracking-wider">Reservation Confirmed</h4>
                                <div className="text-muted">Booking Ref: <strong className="text-body">{booking.booking_code}</strong></div>
                                <div className="text-muted small mt-1">Date: {new Date(booking.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</div>
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
                                                <td className="py-3 border-0">Total Booking Charge</td>
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
                                            <i className="bi bi-check-circle-fill me-2"></i> Paid via {booking.payment_method || 'Cash'}
                                        </span>
                                    </div>
                                    {String(booking.payment_method).toLowerCase() === 'bank transfer' && (
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
                                    <li className="mb-1">Tamu diwajibkan untuk menunjukkan kartu identitas resmi pada saat kedatangan.</li>
                                    <li>Reservasi ini tidak dapat dibatalkan (non-refundable) tanpa pemberitahuan 24 jam sebelumnya.</li>
                                </ul>
                            </div>
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
                    .card { background-color: transparent !important; }
                    
                    /* Ensure tables print properly */
                    .table { margin-bottom: 0 !important; }
                    .table th, .table td { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; border-color: #888 !important; }
                }
            `}</style>
        </div>
    );
}
