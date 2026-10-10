'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  DoctorSession,
  getDoctorAppointmentsAction,
  getDoctorSessionAction,
  logoutDoctorAction,
  updateAdminAppointmentStatusAction,
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
  AlertCircle,
  MessageCircle,
  Clock,
  User,
  Check,
} from 'lucide-react';

export default function DoctorStaffDashboardPage() {
  const router = useRouter();
  const [doctorSession, setDoctorSession] = useState<DoctorSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Appointments queue
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentsMap, setTreatmentsMap] = useState<Record<string, Treatment>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Verify doctor session from server cookie and storage fallback
  useEffect(() => {
    async function verifyAuth() {
      try {
        const serverSession = await getDoctorSessionAction();
        if (serverSession && serverSession.doctorId) {
          setDoctorSession(serverSession);
          setLoading(false);
          return;
        }

        const saved = localStorage.getItem('apex_doctor_session');
        if (saved) {
          const parsed: DoctorSession = JSON.parse(saved);
          if (parsed.doctorId) {
            setDoctorSession(parsed);
            setLoading(false);
            return;
          }
        }
        router.push('/staff/login');
      } catch {
        router.push('/staff/login');
      } finally {
        setLoading(false);
      }
    }
    verifyAuth();
  }, [router]);

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

  // Fetch appointments for this specific doctor
  const fetchDoctorAppointments = useCallback(async () => {
    if (!doctorSession?.doctorId) return;
    setIsRefreshing(true);

    try {
      const res = await getDoctorAppointmentsAction(doctorSession.doctorId);
      if (res.success && res.data) {
        setAppointments(res.data);
      } else {
        console.error('Error fetching doctor OPD queue:', res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [doctorSession?.doctorId]);

  useEffect(() => {
    if (doctorSession?.doctorId) {
      fetchDoctorAppointments();
    }
  }, [doctorSession?.doctorId, fetchDoctorAppointments]);

  // Handle Logout
  const handleLogout = async () => {
    localStorage.removeItem('apex_doctor_session');
    await logoutDoctorAction();
    router.push('/staff/login');
  };

  // Update Status Action
  const handleStatusUpdate = async (
    id: string,
    newStatus: 'confirmed' | 'completed' | 'cancelled'
  ) => {
    try {
      const res = await updateAdminAppointmentStatusAction(id, newStatus);
      if (!res.success) {
        setActionMessage(`Error updating status: ${res.error}`);
      } else {
        setActionMessage(`Patient consultation status updated to "${newStatus.toUpperCase()}".`);
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

  if (loading || !doctorSession) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#0D9488]" />
          <span className="text-sm font-semibold">Loading Doctor OPD Queue...</span>
        </div>
      </div>
    );
  }

  const isAnanya = doctorSession.email.includes('ananya');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      
      {/* Top Doctor Navbar */}
      <header className="bg-[#0F172A] text-white py-4 px-4 sm:px-8 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Header Doctor Title */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  isAnanya ? 'bg-[#0D9488]' : 'bg-[#1E293B] border border-slate-700'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
            </Link>
            <div>
              {/* Header: Welcome, Dr. [Name] | OPD Queue */}
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                <span>Welcome, {doctorSession.name} | OPD Queue</span>
              </h1>
              <p className="text-[11px] text-teal-300 font-medium">
                {doctorSession.specialization} &bull; Apex Dental Studio
              </p>
            </div>
          </div>

          {/* Controls: Refresh, Doctor Badge, Logout */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden lg:inline">
              OPD ID: <strong className="text-white font-mono">{doctorSession.doctorId.slice(0, 10)}...</strong>
            </span>

            <button
              onClick={fetchDoctorAppointments}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh OPD Queue"
              id="doctor-refresh-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0D9488]' : ''}`} />
              <span className="hidden sm:inline">Refresh Queue</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-200 hover:text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              id="doctor-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Banner Action Notification */}
        {actionMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Doctor OPD Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Assigned Patients
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1" id="stat-doctor-total">
              {appointments.length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block">
              Awaiting Confirmation
            </span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1" id="stat-doctor-pending">
              {appointments.filter((a) => a.status === 'pending').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
              Confirmed Consultations
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1" id="stat-doctor-confirmed">
              {appointments.filter((a) => a.status === 'confirmed').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
              Completed Procedures
            </span>
            <div className="text-3xl font-extrabold text-indigo-700 mt-1" id="stat-doctor-completed">
              {appointments.filter((a) => a.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, mobile, or clinical concern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              id="doctor-search-input"
            />
          </div>

          {/* Status Filter Buttons */}
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

        {/* Filtered Doctor OPD Queue Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="doctor-appointments-table">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Patient Phone</th>
                  <th className="py-3.5 px-4">Procedure / Concern</th>
                  <th className="py-3.5 px-4">Consultation Slot</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Doctor Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                      No patients in this queue for {doctorSession.name}.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => {
                    const treatmentName = app.treatment_id
                      ? treatmentsMap[app.treatment_id]?.name || 'Specialist Consultation'
                      : 'General Consultation';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Patient Name & Notes */}
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{app.patient_name}</span>
                          </div>
                          {app.dental_concern && (
                            <span className="text-[11px] text-slate-500 font-normal block mt-0.5 line-clamp-1">
                              Concern: {app.dental_concern}
                            </span>
                          )}
                          {app.patient_email && (
                            <span className="text-[11px] text-slate-400 font-normal block">
                              {app.patient_email}
                            </span>
                          )}
                        </td>

                        {/* Patient Phone & Native Call Trigger */}
                        <td className="py-4 px-4 font-mono font-medium text-slate-700">
                          <a
                            href={`tel:+91${app.patient_phone}`}
                            className="inline-flex items-center gap-1.5 text-slate-900 hover:text-[#0D9488] font-semibold underline"
                            title="Direct call patient"
                          >
                            <Phone className="w-3 h-3 text-[#0D9488]" />
                            <span>+91 {app.patient_phone}</span>
                          </a>
                        </td>

                        {/* Procedure Requested */}
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-100">
                            {treatmentName}
                          </span>
                        </td>

                        {/* Consultation Date & Slot */}
                        <td className="py-4 px-4 text-slate-700">
                          <div className="font-bold text-xs text-slate-900">
                            {app.appointment_date}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {app.time_slot}
                          </span>
                        </td>

                        {/* Status Badge */}
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

                        {/* Doctor Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Click to Call Patient Button */}
                            <a
                              href={`tel:+91${app.patient_phone}`}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Call Patient"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#0D9488]" />
                              <span className="hidden lg:inline">Call</span>
                            </a>

                            {/* WhatsApp Patient */}
                            <a
                              href={`https://wa.me/91${app.patient_phone}?text=${encodeURIComponent(
                                `Hello ${app.patient_name}, this is ${doctorSession.name} from Apex Dental Studio regarding your upcoming consultation.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="WhatsApp Patient"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden lg:inline">WhatsApp</span>
                            </a>

                            {/* Status Toggle: Confirm */}
                            {app.status !== 'confirmed' && app.status !== 'completed' && (
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Confirm Appointment"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">Confirm</span>
                              </button>
                            )}

                            {/* Status Toggle: Mark Completed */}
                            {app.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'completed')}
                                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Mark Completed"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">Completed</span>
                              </button>
                            )}

                            {/* Status Toggle: Cancel */}
                            {app.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">Cancel</span>
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
