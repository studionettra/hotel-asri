import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ demoAccounts = [], demoMode = true }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: true,
    });

    const [loadingUser, setLoadingUser] = useState(null);
    const isSubmitting = processing || loadingUser !== null;

    function submit(e) {
        e.preventDefault();
        post(route('login'));
    }

    const handleQuickLogin = (account) => {
        setLoadingUser(account.username);
        router.post(route('login'), {
            username: account.username,
            password: account.password,
            remember: true,
        }, {
            onFinish: () => setLoadingUser(null),
        });
    };

    return (
        <AuthLayout title="Login">
            <div className="auth-logo mb-3">
                <a href="/">
                    <img src="/mazer/images/logo/logo-hotel-asri.png" alt="Hotel Asri" style={{ height: '90px', width: 'auto' }} />
                </a>
            </div>
            <h4 className="auth-title mb-1">Masuk Sistem Hotel</h4>
            <p className="auth-subtitle mb-4 text-muted small">Silakan masuk dengan akun Anda atau gunakan tombol Quick Login di bawah.</p>

            {/* Quick Demo Login Showcase Section */}
            {demoMode && demoAccounts.length > 0 && (
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="small fw-bold text-uppercase text-body-secondary d-flex align-items-center gap-1" style={{ letterSpacing: '0.04em', fontSize: '0.75rem' }}>
                            <i className="bi bi-stars text-warning fs-6"></i> 1-Click Quick Demo Login
                        </span>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle" style={{ fontSize: '0.65rem' }}>
                            Showcase Mode
                        </span>
                    </div>
                    <p className="text-muted small mb-2" style={{ fontSize: '0.8rem' }}>
                        Pilih peran departemen hotel untuk langsung mengeksplorasi modul:
                    </p>

                    <div className="row g-2 mb-3">
                        {demoAccounts.map(account => {
                            const isCurrentLoading = loadingUser === account.username;
                            return (
                                <div key={account.username} className="col-12 col-sm-6">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => !isSubmitting && handleQuickLogin(account)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !isSubmitting) handleQuickLogin(account); }}
                                        className={`card border shadow-sm h-100 mb-0 demo-account-card ${isCurrentLoading ? 'border-primary opacity-75' : ''}`}
                                        style={{
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            backgroundColor: 'var(--bs-tertiary-bg)',
                                        }}
                                        title={`Klik untuk langsung masuk sebagai ${account.role} (${account.username})`}
                                    >
                                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <div className={`rounded-circle d-flex align-items-center justify-content-center bg-${account.color}-subtle text-${account.color}`} style={{ width: 34, height: 34 }}>
                                                        <i className={`bi ${account.icon} fs-5`}></i>
                                                    </div>
                                                    <span className={`badge bg-${account.color}-subtle text-${account.color} border border-${account.color}-subtle rounded-pill`} style={{ fontSize: '0.65rem' }}>
                                                        {account.badge}
                                                    </span>
                                                </div>
                                                <h6 className="fw-bold mb-1 text-body" style={{ fontSize: '0.9rem' }}>{account.role}</h6>
                                                <p className="text-muted small mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>{account.desc}</p>
                                            </div>

                                            <div className="pt-2 border-top border-opacity-10 d-flex justify-content-between align-items-center mt-1">
                                                <span className="text-secondary small font-monospace" style={{ fontSize: '0.7rem' }}>
                                                    <code>{account.username}</code>
                                                </span>
                                                {isCurrentLoading ? (
                                                    <span className="spinner-border spinner-border-sm text-primary" role="status" style={{ width: 14, height: 14 }}></span>
                                                ) : (
                                                    <span className={`small fw-semibold text-${account.color}`} style={{ fontSize: '0.75rem' }}>
                                                        Masuk <i className="bi bi-arrow-right-short"></i>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="d-flex align-items-center my-3">
                        <hr className="flex-grow-1 my-0 text-muted" />
                        <span className="px-3 text-muted small" style={{ fontSize: '0.75rem' }}>
                            atau login manual
                        </span>
                        <hr className="flex-grow-1 my-0 text-muted" />
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <div className="form-group position-relative has-icon-left mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg${errors.username ? ' is-invalid' : ''}`}
                        placeholder="Username"
                        value={data.username}
                        onChange={e => setData('username', e.target.value)}
                        autoComplete="username"
                        disabled={isSubmitting}
                    />
                    <div className="form-control-icon">
                        <i className="bi bi-person"></i>
                    </div>
                    {errors.username && (
                        <div className="invalid-feedback">{errors.username}</div>
                    )}
                </div>

                <div className="form-group position-relative has-icon-left mb-3">
                    <input
                        type="password"
                        className={`form-control form-control-lg${errors.password ? ' is-invalid' : ''}`}
                        placeholder="Password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoComplete="current-password"
                        disabled={isSubmitting}
                    />
                    <div className="form-control-icon">
                        <i className="bi bi-shield-lock"></i>
                    </div>
                    {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>

                <div className="form-check d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                        <input
                            className="form-check-input me-2"
                            type="checkbox"
                            id="remember"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            disabled={isSubmitting}
                        />
                        <label className="form-check-label text-body-secondary small" htmlFor="remember">
                            Ingat sesi saya
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg shadow-sm w-100"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span><span className="spinner-border spinner-border-sm me-2" role="status"></span>Memproses...</span>
                    ) : (
                        <span><i className="bi bi-box-arrow-in-right me-2"></i>Log in Manual</span>
                    )}
                </button>
            </form>

            <style>{`
                .demo-account-card {
                    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
                }
                .demo-account-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
                    border-color: var(--bs-primary) !important;
                }
            `}</style>
        </AuthLayout>
    );
}
