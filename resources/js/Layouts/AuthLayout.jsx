import { Head } from '@inertiajs/react';

export default function AuthLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <link rel="stylesheet" href="/dist/assets/compiled/css/auth.css" />
            <div id="auth">
                <div className="row h-100 g-0">
                    <div className="col-lg-5 col-12" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                        <div id="auth-left" style={{ padding: '3.5rem 3rem' }}>
                            {children}
                        </div>
                    </div>
                    <div className="col-lg-7 d-none d-lg-block p-0">
                        <div id="auth-right" className="position-relative overflow-hidden h-100">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 1
                                }}
                            >
                                <source src="/mazer/video/video_hotel_asri.mp4" type="video/mp4" />
                                Browser Anda tidak mendukung video.
                            </video>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark overlay
                                zIndex: 2
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
