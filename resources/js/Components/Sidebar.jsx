import { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU = [
    {
        label: 'Dashboard',
        icon: 'bi-grid-fill',
        route: 'dashboard',
        permission: 'dashboard.view',
    },
    {
        label: 'Master Data',
        icon: 'bi-stack',
        permission: ['room.view', 'room-type.view'],
        children: [
            { label: 'Lantai', icon: 'bi-layers-fill', route: 'floors.index', permission: 'room.view' },
            { label: 'Tipe Kamar', icon: 'bi-building', route: 'room-types.index', permission: 'room-type.view' },
            { label: 'Kamar', icon: 'bi-door-open-fill', route: 'rooms.index', permission: 'room.view' },
        ],
    },
    {
        label: 'Front Office',
        icon: 'bi-person-lines-fill',
        permission: ['reservation.view', 'guest.view', 'checkin.create', 'checkout.create', 'folio.view'],
        children: [
            { label: 'Ketersediaan Kamar', icon: 'bi-grid-3x3-gap-fill', route: 'availability.index', activeRoutes: ['availability.*', 'bookings.checkin'], permission: 'reservation.view' },
            { label: 'Reservasi', icon: 'bi-calendar-check-fill', route: 'reservations.index', activeRoutes: ['reservations.*', 'check-ins.*', 'check-outs.*', 'folios.*'], permission: 'reservation.view' },
            { label: 'Tamu', icon: 'bi-people-fill', route: 'guests.index', permission: 'guest.view' },
        ],
    },
    {
        label: 'Housekeeping',
        icon: 'bi-brush-fill',
        permission: ['housekeeping.view', 'laundry.view', 'pool.view'],
        children: [
            { label: 'Cleaning Tasks', icon: 'bi-card-checklist', route: 'housekeeping.tasks.index', permission: 'housekeeping.view' },
            { label: 'Lost & Found', icon: 'bi-search', route: 'housekeeping.lost-and-found.index', permission: 'housekeeping.view' },
            { label: 'Guest Loans', icon: 'bi-box-seam', route: 'housekeeping.guest-loans.index', permission: 'housekeeping.view' },
            { label: 'Control Sheet', icon: 'bi-file-earmark-check', route: 'housekeeping.control-sheets.index', permission: 'housekeeping.view' },
            { label: 'Lapor Tagihan', icon: 'bi-wallet2', route: 'housekeeping.charges.index', permission: 'housekeeping.view' },
            { label: 'Laundry', icon: 'bi-basket-fill', route: 'laundry.index', permission: 'laundry.view' },
            { label: 'Pool Maintenance', icon: 'bi-droplet-fill', route: 'pool.index', permission: 'pool.view' },
        ],
    },
    {
        label: 'F&B',
        icon: 'bi-cup-fill',
        permission: ['fnb.view', 'menu.view'],
        children: [
            { label: 'Pesanan', icon: 'bi-receipt-cutoff', route: 'fnb.orders.index', permission: 'fnb.view' },
            { label: 'Menu', icon: 'bi-journal-text', route: 'menu.index', permission: 'menu.view' },
        ],
    },
    {
        label: 'Laporan',
        icon: 'bi-bar-chart-fill',
        route: 'reports.index',
        permission: 'report.view',
    },
    {
        label: 'Administrasi',
        icon: 'bi-shield-lock-fill',
        permission: ['user.view', 'settings.view'],
        children: [
            { label: 'Pengguna', icon: 'bi-person-badge-fill', route: 'users.index', permission: 'user.view' },
            { label: 'Audit Log', icon: 'bi-journal-code', route: 'activity-log.index', permission: 'user.view' },
            { label: 'Pengaturan', icon: 'bi-gear-fill', route: 'settings.index', permission: 'settings.view' },
        ],
    },
];

export default function Sidebar({ isActive = true, onToggle }) {
    const { auth, ziggy } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const currentPath = ziggy?.location ?? '';

    // Theme toggle logic
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-bs-theme', storedTheme);
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(storedTheme);
    }, []);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(newTheme);
    };

    const hasPermission = (permission) => {
        if (!permission) return true;
        if (Array.isArray(permission)) return permission.some(p => permissions.includes(p));
        return permissions.includes(permission);
    };

    const isActiveRoute = (item) => {
        try {
            if (item.activeRoutes && item.activeRoutes.some(r => route().current(r))) {
                return true;
            }
            const url = route(item.route);
            return currentPath === url || currentPath.startsWith(url + '/');
        } catch {
            return false;
        }
    };

    const isParentActive = (children) =>
        children?.some(c => isActiveRoute(c)) ?? false;

    // Track which parent menus are open
    const [openMenus, setOpenMenus] = useState(() => {
        const open = {};
        MENU.forEach(item => {
            if (item.children && isParentActive(item.children)) {
                open[item.label] = true;
            }
        });
        return open;
    });

    const toggleMenu = (label) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <div id="sidebar" className={isActive ? 'active' : ''}>
            <div className={`sidebar-wrapper ${isActive ? 'active' : ''} shadow-sm border-end border-opacity-10`}>
                <div className="sidebar-header pt-4 pb-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="logo w-100 text-center text-lg-start px-2">
                            <Link href="/dashboard">
                                <img src="/mazer/images/logo/logo-hotel-asri.png" alt="Hotel Asri" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                            </Link>
                        </div>
                        <div className="toggler">
                            <a href="#" className="sidebar-hide d-xl-none d-block fs-3" onClick={(e) => { e.preventDefault(); if (onToggle) onToggle(); }}>
                                <i className="bi bi-x bi-middle text-muted"></i>
                            </a>
                        </div>
                    </div>
                    
                    {/* Modern Theme Toggle */}
                    <div className="mt-4 px-3">
                        <div className="d-flex align-items-center p-1 rounded-pill w-100" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className={`btn btn-sm rounded-pill border-0 flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${theme === 'light' ? 'bg-white shadow-sm text-dark' : 'text-secondary'}`}
                                onClick={() => toggleTheme('light')}
                                style={{ height: '36px' }}
                            >
                                <i className="bi bi-sun-fill"></i>
                                <span className="fs-7 fw-medium" style={{ fontSize: '0.85rem' }}>Light</span>
                            </motion.button>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className={`btn btn-sm rounded-pill border-0 flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${theme === 'dark' ? 'bg-dark shadow-sm text-light' : 'text-secondary'}`}
                                onClick={() => toggleTheme('dark')}
                                style={{ height: '36px' }}
                            >
                                <i className="bi bi-moon-stars-fill"></i>
                                <span className="fs-7 fw-medium" style={{ fontSize: '0.85rem' }}>Dark</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="sidebar-menu px-3 mt-3">
                    <ul className="menu">
                        {MENU.map((item) => {
                            if (!hasPermission(item.permission)) return null;

                            // Simple link (no children)
                            if (!item.children) {
                                const active = isActiveRoute(item);
                                return (
                                    <li key={item.label} className={`sidebar-item${active ? ' active' : ''} mb-1`}>
                                        <motion.div whileTap={{ scale: 0.98 }}>
                                            <Link 
                                                href={route(item.route)} 
                                                className="sidebar-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 transition-all"
                                                style={{ display: 'flex', textDecoration: 'none' }}
                                            >
                                                <i className={`bi ${item.icon} fs-5`}></i>
                                                <span className="fw-medium">{item.label}</span>
                                            </Link>
                                        </motion.div>
                                    </li>
                                );
                            }

                            // Parent with children
                            const visibleChildren = item.children.filter(c => hasPermission(c.permission));
                            if (visibleChildren.length === 0) return null;

                            const parentActive = isParentActive(visibleChildren);
                            const isOpen = openMenus[item.label] ?? parentActive;

                            return (
                                <li key={item.label} className={`sidebar-item${parentActive ? ' active' : ''} mb-1`}>
                                    <motion.a 
                                        whileTap={{ scale: 0.98 }}
                                        href="#" 
                                        className="sidebar-link d-flex align-items-center justify-content-between py-2 px-3 rounded-3 transition-all"
                                        onClick={(e) => { e.preventDefault(); toggleMenu(item.label); }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={`bi ${item.icon} fs-5`}></i>
                                            <span className="fw-medium">{item.label}</span>
                                        </div>
                                        <motion.i 
                                            animate={{ rotate: isOpen ? 180 : 0 }} 
                                            transition={{ duration: 0.2 }}
                                            className="bi bi-chevron-down opacity-50" 
                                            style={{ fontSize: '0.8rem' }}
                                        ></motion.i>
                                    </motion.a>
                                    
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.ul 
                                                initial="collapsed"
                                                animate="open"
                                                exit="collapsed"
                                                variants={{
                                                    open: { opacity: 1, height: "auto", marginTop: "0.25rem" },
                                                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                                                }}
                                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                className="m-0 p-0 ps-4"
                                                style={{ overflow: 'hidden', listStyle: 'none', display: 'block' }}
                                            >
                                                {visibleChildren.map(child => {
                                                    const childActive = isActiveRoute(child);
                                                    return (
                                                        <li key={child.route} className={`mb-1`}>
                                                            <motion.div whileTap={{ scale: 0.98 }}>
                                                                <Link 
                                                                    href={route(child.route)} 
                                                                    className={`d-flex align-items-center gap-3 py-2 px-3 rounded-3 transition-all ${childActive ? 'fw-semibold text-primary' : 'text-body-secondary'}`}
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    <i className={`bi ${child.icon}`} style={{ fontSize: '1.1rem' }}></i>
                                                                    <span style={{ fontSize: '0.95rem' }}>{child.label}</span>
                                                                </Link>
                                                            </motion.div>
                                                        </li>
                                                    );
                                                })}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
