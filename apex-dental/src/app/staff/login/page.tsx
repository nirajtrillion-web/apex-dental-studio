'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticateDoctorAction } from '@/lib/adminActions';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await authenticateDoctorAction(email, password);
    if (!res.success || !res.session) {
      setError(res.error || 'Invalid credentials. Please verify your doctor email and password.');
      setLoading(false);
      return;
    }

    // Store doctor session
    localStorage.setItem('apex_doctor_session', JSON.stringify(res.session));
    router.push('/staff/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-700/50">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6 text-[#0D9488]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Doctor OPD Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Apex Dental Studio &bull; Multi-Doctor Authentication
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form (Manual Login) */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Doctor Email
            </label>
            <input
              type="email"
              required
              placeholder="e.g. sameer@apexdental.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              id="staff-email-input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your doctor password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              id="staff-password-input"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-2"
            id="staff-submit-login-btn"
          >
            <Shield className="w-4 h-4 text-[#0D9488]" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Doctor OPD Queue'}</span>
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Clinic Website</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
