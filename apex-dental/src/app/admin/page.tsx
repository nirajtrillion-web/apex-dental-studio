'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  getAdminAppointmentsAction,
  updateAdminAppointmentStatusAction,
  authenticateDoctorAction,
  getDoctorSessionAction,
  logoutDoctorAction,
  DoctorSession,
} from '@/lib/adminActions';
import { Appointment, Treatment } from '@/lib/types';
import {
  Shield,
  Phone,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  LogOut,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';

export default function AdminPage() {
  const [session, setSession] = useState<DoctorSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Login form states (no hardcoded credentials)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentsMap, setTreatmentsMap] = useState<Record<string, Treatment>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Verify server-side authenticated session on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const verified = await getDoctorSessionAction();
        if (verified) {
          setSession(verified);
        }
      } catch {
        // Unauthenticated
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch treatments map
  useEffect(() => {
    async function loadTreatments() {
      const { data } = await supabase.from('treatments').select('*');
      if (data) {
        const map: Record<string, Treatment> = {};
        data.forEach((t) => {
          map[t.id] = t;
        });
        setTreatmentsMap(map);
      }
    }
    loadTreatments();
  }, []);

  // Fetch appointments for authenticated staff
  const fetchAppointments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getAdminAppointmentsAction();
      if (res.success && res.data) {
        setAppointments(res.data);
      } else {
        console.error('Error fetching appointments:', res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [session, fetchAppointments]);

  // Handle staff login via secure server action
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    const res = await authenticateDoctorAction(email, password);
    if (!res.success || !res.session) {
      setAuthError(res.error || 'Invalid credentials. Please verify your email and password.');
      setIsAuthenticating(false);
      return;
    }

    setSession(res.session);
    setIsAuthenticating(false);
  };

  const handleLogout = async () => {
    await logoutDoctorAction();
    setSession(null);
  };

  // Update appointment status
  const handleStatusUpdate = async (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const res = await updateAdminAppointmentStatusAction(id, newStatus);
      if (!res.success) {
        setActionMessage(`Error updating status: ${res.error}`);
      } else {
        setActionMessage(`Appointment #${id.slice(0, 8)} marked as ${newStatus.toUpperCase()}.`);
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        setTimeout(() => setActionMessage(null), 3500);
      }
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.patient_phone.includes(searchQuery) ||
      (app.dental_concern && app.dental_concern.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#0D9488]" />
          <span className="text-sm font-semibold">Loading Clinic Portal...</span>
        </div>
      </div>
    );
  }

  // Not logged in: Show Staff Login Screen
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white">
              <Shield className="w-5 h-5 text-[#0D9488]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Staff Reception Portal
              </h1>
              <p className="text-xs text-slate-500">Apex Dental Studio, Mumbai</p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Staff Email
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@apexdental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                id="admin-email-input"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                id="admin-password-input"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-2"
              id="admin-submit-login-btn"
            >
              <Shield className="w-4 h-4 text-[#0D9488]" />
              <span>{isAuthenticating ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clinic Site</span>
            </Link>
            <Link href="/staff/login" className="text-[#0D9488] font-semibold hover:underline">
              Doctor OPD Login &rarr;
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Logged In: Master Reception Queue
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      
      {/* Top Admin Header */}
      <header className="bg-[#0F172A] text-white py-4 px-4 sm:px-8 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
            </Link>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                <span>Apex Dental Studio &bull; Clinical Coordinator Hub</span>
              </h1>
              <p className="text-xs text-slate-400">
                Logged in as {session.name} ({session.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAppointments}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Appointments"
              id="admin-refresh-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0D9488]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-200 hover:text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              id="admin-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {actionMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1" id="stat-total">
              {appointments.length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block">
              Pending Action
            </span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1" id="stat-pending">
              {appointments.filter((a) => a.status === 'pending').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
              Confirmed Bookings
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1" id="stat-confirmed">
              {appointments.filter((a) => a.status === 'confirmed').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">
              Cancelled / Missed
            </span>
            <div className="text-3xl font-extrabold text-rose-600 mt-1" id="stat-cancelled">
              {appointments.filter((a) => a.status === 'cancelled').length}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, phone, or concern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              id="admin-search-input"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  statusFilter === filter
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="admin-appointments-table">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Treatment</th>
                  <th className="py-3.5 px-4">Date & Slot</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                      No appointment records found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => {
                    const treatmentName = app.treatment_id
                      ? treatmentsMap[app.treatment_id]?.name || 'Specialist Consultation'
                      : 'General Consultation';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          <div>{app.patient_name}</div>
                          {app.dental_concern && (
                            <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                              {app.dental_concern}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-700">
                          <div>+91 {app.patient_phone}</div>
                          {app.patient_email && (
                            <span className="text-[11px] text-slate-400 font-sans block">
                              {app.patient_email}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-medium border border-teal-100">
                            {treatmentName}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-700">
                          <div className="font-semibold text-xs text-slate-900">{app.appointment_date}</div>
                          <span className="text-[11px] text-slate-500">{app.time_slot}</span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'completed'
                                ? 'bg-indigo-100 text-indigo-800'
                                : app.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'confirmed'
                                  ? 'bg-emerald-600'
                                  : app.status === 'completed'
                                  ? 'bg-indigo-600'
                                  : app.status === 'cancelled'
                                  ? 'bg-rose-600'
                                  : 'bg-amber-500'
                              }`}
                            />
                            <span>{app.status}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:+91${app.patient_phone}`}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors"
                              title="Call Patient"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#0D9488]" />
                              <span className="hidden xl:inline">Call</span>
                            </a>

                            <a
                              href={`https://wa.me/91${app.patient_phone}?text=${encodeURIComponent(
                                `Hello ${app.patient_name}, this is Apex Dental Studio regarding your consultation scheduled for ${app.appointment_date} (${app.time_slot}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs flex items-center gap-1 transition-colors"
                              title="WhatsApp Patient"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </a>

                            {app.status !== 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1 transition-colors"
                                title="Confirm Booking"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="hidden xl:inline">Confirm</span>
                              </button>
                            )}

                            {app.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs flex items-center gap-1 transition-colors"
                                title="Cancel Booking"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="hidden xl:inline">Cancel</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
