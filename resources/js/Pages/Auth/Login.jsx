import { useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('login'));
    }

    return (
        <AuthLayout title="Login">
            <div className="auth-logo mb-4">
                <a href="/">
                    <img src="/mazer/images/logo/logo-hotel-asri.png" alt="Hotel Asri" style={{ height: '100px', width: 'auto' }} />
                </a>
            </div>
            <h5 className="auth-title">Log In.</h5>
            <p className="auth-subtitle mb-4">Silahkan masuk dengan username dan password Anda.</p>

            <form onSubmit={submit}>
                <div className="form-group position-relative has-icon-left mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-xl${errors.username ? ' is-invalid' : ''}`}
                        placeholder="Username"
                        value={data.username}
                        onChange={e => setData('username', e.target.value)}
                        autoFocus
                        autoComplete="username"
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
                        className={`form-control form-control-xl${errors.password ? ' is-invalid' : ''}`}
                        placeholder="Password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoComplete="current-password"
                    />
                    <div className="form-control-icon">
                        <i className="bi bi-shield-lock"></i>
                    </div>
                    {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>

                <div className="form-check form-check-lg d-flex align-items-end mb-3">
                    <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="remember"
                        checked={data.remember}
                        onChange={e => setData('remember', e.target.checked)}
                    />
                    <label className="form-check-label text-gray-600" htmlFor="remember">
                        Ingat saya
                    </label>
                </div>

                <button
                    className="btn btn-primary btn-block btn-lg shadow-lg mt-3"
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'Log in'}
                </button>
            </form>
        </AuthLayout>
    );
}
