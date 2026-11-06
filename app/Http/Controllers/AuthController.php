<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function create()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        $demoMode = (bool) config('app.demo_mode', env('DEMO_MODE', true));

        $demoAccounts = $demoMode ? [
            [
                'role' => 'Administrator',
                'username' => 'admin',
                'password' => 'admin12345',
                'badge' => 'GM / Admin',
                'desc' => 'Finansial & Master Data',
                'icon' => 'bi-shield-check',
                'color' => 'primary',
            ],
            [
                'role' => 'Front Office',
                'username' => 'fo1',
                'password' => 'fo12345',
                'badge' => 'Front Desk',
                'desc' => 'Reservasi & Billing',
                'icon' => 'bi-person-badge',
                'color' => 'success',
            ],
            [
                'role' => 'Housekeeping',
                'username' => 'hk1',
                'password' => 'hk12345',
                'badge' => 'HK Staff',
                'desc' => 'Status Kamar & Laundry',
                'icon' => 'bi-brush',
                'color' => 'warning',
            ],
            [
                'role' => 'F&B Service',
                'username' => 'fnb1',
                'password' => 'fnb12345',
                'badge' => 'F&B Team',
                'desc' => 'Restoran & Room Service',
                'icon' => 'bi-cup-hot',
                'color' => 'info',
            ],
        ] : [];

        return Inertia::render('Auth/Login', [
            'demoAccounts' => $demoAccounts,
            'demoMode' => $demoMode,
        ]);
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            return back()->withErrors([
                'username' => 'Username atau password salah.',
            ])->onlyInput('username');
        }

        if (! Auth::user()->is_active) {
            Auth::logout();
            return back()->withErrors([
                'username' => 'Akun Anda tidak aktif. Hubungi Administrator.',
            ])->onlyInput('username');
        }

        Auth::user()->update(['last_login_at' => now()]);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
