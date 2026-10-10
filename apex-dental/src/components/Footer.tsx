'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Ethos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#0F766E] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  APEX DENTAL
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#0D9488] border border-[#0D9488]/30 ml-1.5">
                  STUDIO
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Mumbai’s premier multi-specialty cosmetic and implant dental clinic. Combining hospital-grade surgical sterility with bespoke aesthetic artistry.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
              <span>Certified Class-B Bio-Sterilization</span>
            </div>
          </div>

          {/* Bandra West Clinic Card with Google Maps & Clickable Phone */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0D9488]" />
              <span>Bandra West Clinic</span>
            </div>
            
            <a
              href="https://www.google.com/maps/search/?api=1&query=Linking+Road+Bandra+West+Mumbai+Dental"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-[#0D9488] transition-colors leading-relaxed block group"
              title="Click to open Bandra West Clinic on Google Maps"
            >
              <span className="group-hover:underline">
                Bandra West Clinic: Linking Road, Near Bandra Station, Mumbai 400050
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#0D9488] mt-1 font-semibold">
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0D9488]" />
                <span className="text-slate-400">Helpline:</span>
                <a
                  href="tel:+919820123456"
                  className="font-semibold text-white hover:text-[#0D9488] transition-colors underline"
                  title="Call Bandra Clinic Helpline"
                >
                  +91 98201 23456
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>10:00 AM – 9:00 PM (Mon-Sat)</span>
              </div>
            </div>
          </div>

          {/* Kandivali East Clinic Card with Google Maps & Clickable Phone */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D97706]" />
              <span>Kandivali East Clinic</span>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Thakur+Village+Kandivali+East+Mumbai+Dental"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-[#D97706] transition-colors leading-relaxed block group"
              title="Click to open Kandivali East Clinic on Google Maps"
            >
              <span className="group-hover:underline">
                Kandivali East Clinic: Thakur Village, Near Thakur Cinema, Kandivali East, Mumbai 400101
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#D97706] mt-1 font-semibold">
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D97706]" />
                <span className="text-slate-400">Helpline:</span>
                <a
                  href="tel:+919820654321"
                  className="font-semibold text-white hover:text-[#D97706] transition-colors underline"
                  title="Call Kandivali Clinic Helpline"
                >
                  +91 98206 54321
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>09:30 AM – 8:30 PM (Mon-Sat)</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation & Staff Portal */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Portals &amp; Links
            </div>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>
                <a href="#treatments" className="hover:text-white transition-colors">
                  Treatments &amp; Pricing
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-white transition-colors">
                  Before &amp; After Smile Gallery
                </a>
              </li>
              <li>
                <a href="#specialists" className="hover:text-white transition-colors">
                  MDS Specialist Doctors
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  US FDA Laser Tech
                </a>
              </li>
              <li>
                <Link
                  href="/staff/login"
                  className="text-[#0D9488] hover:text-teal-300 font-semibold flex items-center gap-1 py-1"
                >
                  <span>Doctor &amp; Staff Login (/staff/login)</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 Apex Dental Studio. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Bandra West &amp; Kandivali East &bull; Mumbai Dental Excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
