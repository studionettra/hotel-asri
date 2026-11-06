import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    const profileForm = useForm({
        name: auth.user.name,
        username: auth.user.username,
        email: auth.user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.patch(route('profile.password'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AppLayout title="Profil Saya" breadcrumbs={[{ label: 'Dashboard', href: route('dashboard') }, { label: 'Profil' }]}>
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Informasi Profil</h4>
                            <p className="text-muted text-sm">Perbarui informasi profil dan alamat email akun Anda.</p>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updateProfile}>
                                <div className="form-group mb-3">
                                    <label htmlFor="name">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`form-control ${profileForm.errors.name ? 'is-invalid' : ''}`}
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {profileForm.errors.name && <div className="invalid-feedback">{profileForm.errors.name}</div>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className={`form-control ${profileForm.errors.username ? 'is-invalid' : ''}`}
                                        value={profileForm.data.username}
                                        onChange={(e) => profileForm.setData('username', e.target.value)}
                                        required
                                    />
                                    {profileForm.errors.username && <div className="invalid-feedback">{profileForm.errors.username}</div>}
                                </div>

                                <div className="form-group mb-4">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${profileForm.errors.email ? 'is-invalid' : ''}`}
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {profileForm.errors.email && <div className="invalid-feedback">{profileForm.errors.email}</div>}
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary" disabled={profileForm.processing}>
                                        {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Perbarui Kata Sandi</h4>
                            <p className="text-muted text-sm">Pastikan akun Anda menggunakan kata sandi acak yang panjang agar tetap aman.</p>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updatePassword}>
                                <div className="form-group mb-3">
                                    <label htmlFor="current_password">Kata Sandi Saat Ini</label>
                                    <input
                                        type="password"
                                        id="current_password"
                                        className={`form-control ${passwordForm.errors.current_password ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        required
                                    />
                                    {passwordForm.errors.current_password && <div className="invalid-feedback">{passwordForm.errors.current_password}</div>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="password">Kata Sandi Baru</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className={`form-control ${passwordForm.errors.password ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        required
                                    />
                                    {passwordForm.errors.password && <div className="invalid-feedback">{passwordForm.errors.password}</div>}
                                </div>

                                <div className="form-group mb-4">
                                    <label htmlFor="password_confirmation">Konfirmasi Kata Sandi Baru</label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        className={`form-control ${passwordForm.errors.password_confirmation ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    {passwordForm.errors.password_confirmation && <div className="invalid-feedback">{passwordForm.errors.password_confirmation}</div>}
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary" disabled={passwordForm.processing}>
                                        {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
