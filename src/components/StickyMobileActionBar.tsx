'use client';

import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface StickyMobileActionBarProps {
  onOpenBooking: () => void;
}

export default function StickyMobileActionBar({ onOpenBooking }: StickyMobileActionBarProps) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 p-2.5 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      id="sticky-mobile-action-bar"
    >
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        {/* Left half: Call Clinic */}
        <a
          href="tel:+919820123456"
          id="mobile-call-btn"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors"
        >
          <Phone className="w-4 h-4 text-[#0D9488]" />
          <span>Call Clinic</span>
        </a>

        {/* Right half: Book Appointment */}
        <button
          onClick={onOpenBooking}
          id="mobile-book-btn"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#0F172A] active:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/20 transition-all"
        >
          <Calendar className="w-4 h-4 text-[#0D9488]" />
          <span>Book Consultation</span>
        </button>
      </div>
    </div>
  );
}
