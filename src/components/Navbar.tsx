'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Menu, X, Shield, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (treatmentId?: string, concern?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#0D9488]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
                APEX
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-[#0D9488] border border-[#0D9488]/20 tracking-wider">
                STUDIO
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase font-medium text-slate-500">
              Cosmetic &amp; Implant Dental Clinic
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a
            href="#treatments"
            className="hover:text-[#0D9488] transition-colors py-1"
          >
            Treatments
          </a>
          <a
            href="#transformations"
            className="hover:text-[#0D9488] transition-colors py-1"
          >
            Before &amp; After
          </a>
          <a
            href="#specialists"
            className="hover:text-[#0D9488] transition-colors py-1"
          >
            MDS Specialists
          </a>
          <a
            href="#technology"
            className="hover:text-[#0D9488] transition-colors py-1"
          >
            US FDA Tech
          </a>
          <Link
            href="/staff/login"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Doctor & Staff Portal"
          >
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>Staff Portal</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onOpenBooking()}
            id="nav-book-btn"
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:shadow-slate-900/10 transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-[#0D9488]" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="text-xs font-semibold bg-[#0F172A] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Book</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="#treatments"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0D9488]"
          >
            Treatments &amp; Pricing
          </a>
          <a
            href="#transformations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0D9488]"
          >
            Before &amp; After Transformations
          </a>
          <a
            href="#specialists"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0D9488]"
          >
            Doctor Pedigree (MDS)
          </a>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0D9488]"
          >
            Class-B Laser Technology
          </a>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/staff/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs text-slate-600 font-medium py-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Doctor / Staff Login</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
            <span className="text-xs text-slate-400">Bandra &amp; Kandivali</span>
          </div>
        </div>
      )}
    </header>
  );
}
