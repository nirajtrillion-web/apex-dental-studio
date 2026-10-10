'use client';

import React, { useState, useEffect } from 'react';
import { Treatment } from '@/lib/types';
import { createAppointmentAction } from '@/lib/actions';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  MessageCircle,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  treatments: Treatment[];
  initialTreatmentId?: string;
  initialConcern?: string;
  initialDoctorId?: string;
}

const MORNING_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
];

const EVENING_SLOTS = [
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
];

export default function BookingModal({
  isOpen,
  onClose,
  treatments,
  initialTreatmentId,
  initialConcern,
  initialDoctorId,
}: BookingModalProps) {
  // Wizard steps: 1 = Service, 2 = Date & Slot, 3 = Patient Details, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || 'd1000000-0000-0000-0000-000000000001'
  );
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [dentalConcern, setDentalConcern] = useState<string>('');
  const [trapWebsite, setTrapWebsite] = useState<string>(''); // Invisible Honeypot

  // Validation & Submission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<{
    id: string;
    patient_name: string;
    appointment_date: string;
    time_slot: string;
  } | null>(null);

  const [formRenderedAt, setFormRenderedAt] = useState<number>(0);

  // Tomorrow as default min date
  const [minDateStr, setMinDateStr] = useState<string>('');

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setMinDateStr(dateStr);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormRenderedAt(Date.now());
      if (initialTreatmentId) {
        setSelectedTreatmentId(initialTreatmentId);
        // Auto-assign doctor based on treatment specialization
        if (initialTreatmentId === 'a1000000-0000-0000-0000-000000000001') {
          setSelectedDoctorId('d1000000-0000-0000-0000-000000000002');
        } else if (!initialDoctorId) {
          setSelectedDoctorId('d1000000-0000-0000-0000-000000000001');
        }
      } else if (treatments.length > 0 && !selectedTreatmentId) {
        setSelectedTreatmentId(treatments[0].id);
      }
      if (initialDoctorId) {
        setSelectedDoctorId(initialDoctorId);
      }
      if (initialConcern) {
        setDentalConcern(initialConcern);
        if (initialConcern.toLowerCase().includes('crook') || initialConcern.toLowerCase().includes('align')) {
          setSelectedDoctorId('d1000000-0000-0000-0000-000000000002');
        }
      }
      if (!appointmentDate && minDateStr) {
        setAppointmentDate(minDateStr);
      }
      if (!timeSlot) {
        setTimeSlot(MORNING_SLOTS[0]);
      }
    }
  }, [isOpen, initialTreatmentId, initialConcern, initialDoctorId, treatments, minDateStr, appointmentDate, timeSlot]);

  if (!isOpen) return null;

  const handleStep1Next = () => {
    if (!selectedTreatmentId) {
      setErrors({ treatment: 'Please choose a treatment service.' });
      return;
    }
    // Auto-assign doctor based on selected treatment
    if (selectedTreatmentId === 'a1000000-0000-0000-0000-000000000001') {
      setSelectedDoctorId('d1000000-0000-0000-0000-000000000002'); // Dr. Ananya (Aligners)
    } else if (!initialDoctorId) {
      setSelectedDoctorId('d1000000-0000-0000-0000-000000000001'); // Dr. Sameer (Implants/Cosmetic/General)
    }
    setErrors({});
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    const newErrors: Record<string, string> = {};
    if (!appointmentDate) newErrors.date = 'Please pick a consultation date.';
    if (!timeSlot) newErrors.slot = 'Please select a preferred time slot.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCurrentStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side quick check
    const newErrors: Record<string, string> = {};
    if (!patientName.trim() || patientName.trim().length < 2) {
      newErrors.name = 'Please provide full patient name (at least 2 letters).';
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(patientPhone.trim())) {
      newErrors.phone = 'Valid 10-digit Indian mobile number required (starting with 6, 7, 8, or 9).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createAppointmentAction({
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail || '',
        treatment_id: selectedTreatmentId,
        doctor_id: selectedDoctorId,
        appointment_date: appointmentDate,
        time_slot: timeSlot,
        dental_concern: dentalConcern,
        trap_website: trapWebsite,
        form_rendered_at: formRenderedAt,
      });

      if (!response.success) {
        setErrors({ form: response.error || 'Failed to schedule booking.' });
        setIsSubmitting(false);
        return;
      }

      // Success
      setCreatedBooking(response.data as any);
      setCurrentStep(4);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      setErrors({ form: 'An unexpected connection error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTreatment = treatments.find((t) => t.id === selectedTreatmentId);

  // Generate Google Calendar URL
  const getGoogleCalendarUrl = () => {
    if (!createdBooking) return '#';
    const title = encodeURIComponent(`Dental Consultation at Apex Dental Studio: ${selectedTreatment?.name || 'Consultation'}`);
    const details = encodeURIComponent(
      `Appointment with Apex Dental Studio.\nPatient: ${createdBooking.patient_name}\nTime Slot: ${createdBooking.time_slot}\nClinic: Linking Road Bandra / Kandivali East\nHelpline: +91 98765 43210`
    );
    const location = encodeURIComponent('Apex Dental Studio, Linking Road, Bandra West, Mumbai');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#0F172A] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                Apex Dental Studio
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs text-slate-400">Step {currentStep} of 3</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white mt-0.5">
              {currentStep === 1 && 'Select Your Treatment'}
              {currentStep === 2 && 'Choose Date & Preferred Time'}
              {currentStep === 3 && 'Patient Details & Contact'}
              {currentStep === 4 && 'Consultation Scheduled!'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            id="modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep < 4 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            <div
              className={`h-full bg-[#0D9488] transition-all duration-300 ${
                currentStep === 1 ? 'w-1/3' : currentStep === 2 ? 'w-2/3' : 'w-full'
              }`}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: Select Treatment */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Choose the clinical procedure or dental service you wish to consult for:
              </p>

              {errors.treatment && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.treatment}</span>
                </div>
              )}

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {treatments.map((treatment) => {
                  const isSelected = selectedTreatmentId === treatment.id;
                  return (
                    <div
                      key={treatment.id}
                      onClick={() => setSelectedTreatmentId(treatment.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#0D9488] bg-teal-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={treatment.image_url}
                          alt={treatment.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {treatment.name}
                            </span>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {treatment.category}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {treatment.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900 block">
                          ₹{treatment.starting_price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {treatment.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
                  id="step-1-next-btn"
                >
                  <span>Continue to Date &amp; Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pick Doctor, Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Preferred Doctor Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Preferred Doctor
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctorId('d1000000-0000-0000-0000-000000000001')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedDoctorId === 'd1000000-0000-0000-0000-000000000001'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs">Dr. Sameer Merchant</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Implants &amp; Cosmetic Dentist</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDoctorId('d1000000-0000-0000-0000-000000000002')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedDoctorId === 'd1000000-0000-0000-0000-000000000002'
                        ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs">Dr. Ananya Parekh</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Orthodontist &amp; Aligners</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Consultation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={minDateStr}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    id="booking-date-input"
                  />
                </div>
                {errors.date && (
                  <p className="text-rose-600 text-xs mt-1.5">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Time Slot
                </label>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Morning (10:00 AM - 01:00 PM)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MORNING_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            timeSlot === slot
                              ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Evening (04:00 PM - 08:00 PM)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {EVENING_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            timeSlot === slot
                              ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {errors.slot && (
                  <p className="text-rose-600 text-xs mt-1.5">{errors.slot}</p>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
                  id="step-2-next-btn"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Name & 10-digit Phone */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errors.form && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Mehta"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    id="booking-name-input"
                  />
                </div>
                {errors.name && (
                  <p className="text-rose-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* 10-digit Indian Mobile Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Indian Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9820123456"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 rounded-r-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    id="booking-phone-input"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Format: 10 digits starting with 6, 7, 8, or 9
                </span>
                {errors.phone && (
                  <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Optional Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional for calendar invite)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="vikram.mehta@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    id="booking-email-input"
                  />
                </div>
              </div>

              {/* Dental Concern Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Specific Dental Concern / Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild sensitivity on upper molar, interested in same-day scan"
                  value={dentalConcern}
                  onChange={(e) => setDentalConcern(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  id="booking-concern-input"
                />
              </div>

              {/* Invisible Honeypot Anti-Spam Field */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="trap_website">Website</label>
                <input
                  type="text"
                  id="trap_website"
                  name="trap_website"
                  value={trapWebsite}
                  onChange={(e) => setTrapWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Summary Recap Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Service:</span>
                  <span>{selectedTreatment?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Scheduled:</span>
                  <span>{appointmentDate} at {timeSlot}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-teal-900/20 disabled:opacity-50"
                  id="booking-submit-btn"
                >
                  {isSubmitting ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Book Consultation</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 4: Booking Confirmation with Ref ID */}
          {currentStep === 4 && createdBooking && (
            <div className="text-center py-4 space-y-5">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
                  Booking Received
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-1">
                  We look forward to seeing you, {createdBooking.patient_name}!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-2">
                  Your appointment has been registered in our clinic management system. Our receptionist will call to confirm your appointment.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Reference ID:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]" id="booking-reference-id">
                    {createdBooking.id.substring(0, 13)}...
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Date &amp; Slot:</span>
                  <span className="font-semibold text-slate-800">
                    {createdBooking.appointment_date} ({createdBooking.time_slot})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Location:</span>
                  <span className="font-semibold text-slate-800">Apex Dental Studio (Bandra West)</span>
                </div>
              </div>

              {/* Next actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-[#D97706]" />
                  <span>Add to Google Calendar</span>
                </a>

                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hi Apex Dental, I have booked a consultation for ${createdBooking.patient_name} on ${createdBooking.appointment_date} (${createdBooking.time_slot}). Booking ID: ${createdBooking.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Clinic</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Close Window
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
