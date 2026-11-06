import { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ users, roles }) {
    const [search, setSearch] = useState('');

    function destroy(user) {
        if (confirm(`Hapus user "${user.name}"?`)) {
            router.delete(route('users.destroy', user.id));
        }
    }

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout title="User Management" breadcrumbs={[{ label: 'Dashboard', href: route('dashboard') }, { label: 'Users' }]}>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Daftar User</h4>
                    <Link href={route('users.create')} className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-lg me-1"></i> Tambah User
                    </Link>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Cari nama atau username..."
                            value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '5%', minWidth: '40px' }}>#</th>
                                    <th style={{ width: '20%', minWidth: '140px' }}>Nama</th>
                                    <th style={{ width: '15%', minWidth: '110px' }}>Username</th>
                                    <th style={{ width: '22%', minWidth: '160px' }}>Email</th>
                                    <th style={{ width: '15%', minWidth: '120px' }}>Role</th>
                                    <th style={{ width: '11%', minWidth: '100px' }}>Status</th>
                                    <th style={{ width: '12%', minWidth: '90px' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="text-center text-muted py-4">Tidak ada data user.</td></tr>
                                )}
                                {filtered.map((user, i) => (
                                    <tr key={user.id}>
                                        <td>{i + 1}</td>
                                        <td><strong>{user.name}</strong></td>
                                        <td><code>{user.username}</code></td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.roles?.map(r => (
                                                <span key={r.id} className="badge bg-info text-dark me-1">{r.name}</span>
                                            ))}
                                        </td>
                                        <td>
                                            <span className={`badge bg-${user.is_active ? 'success' : 'secondary'}`}>
                                                {user.is_active ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={route('users.edit', user.id)} className="btn btn-sm btn-warning me-1">
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <button className="btn btn-sm btn-danger" onClick={() => destroy(user)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
