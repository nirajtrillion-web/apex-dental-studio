'use client';

import React from 'react';
import { MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';

export default function TopUtilityBar() {
  return (
    <aside aria-label="Clinic announcement and contact bar" className="bg-[#0F172A] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Clinic Locations with Google Maps links */}
        <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
          <MapPin className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
          <a
            href="https://www.google.com/maps/search/?api=1&query=Linking+Road+Bandra+West+Mumbai+Dental"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:underline transition-colors text-slate-200 font-medium"
            title="Open Bandra West Clinic on Google Maps"
          >
            Bandra West (Linking Rd)
          </a>
          <span className="text-slate-500">&bull;</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Thakur+Village+Kandivali+East+Mumbai+Dental"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:underline transition-colors text-slate-200 font-medium"
            title="Open Kandivali East Clinic on Google Maps"
          >
            Kandivali East (Thakur Village)
          </a>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-[#D97706]" />
            Mon - Sat: 9:30 AM - 9:00 PM
          </span>
        </div>

        {/* Clickable Phone Numbers & Accreditation */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-[11px] font-semibold tracking-wide uppercase">ISO 9001:2015 &amp; Class-B Autoclave Certified</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919820123456"
              className="flex items-center gap-1 text-white font-medium hover:text-[#0D9488] transition-colors bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 text-[11px]"
              title="Call Bandra Clinic Helpline"
            >
              <Phone className="w-2.5 h-2.5 text-[#0D9488]" />
              <span>Bandra: +91 98201 23456</span>
            </a>

            <a
              href="tel:+919820654321"
              className="flex items-center gap-1 text-white font-medium hover:text-[#0D9488] transition-colors bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 text-[11px]"
              title="Call Kandivali Clinic Helpline"
            >
              <Phone className="w-2.5 h-2.5 text-[#D97706]" />
              <span>Kandivali: +91 98206 54321</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
