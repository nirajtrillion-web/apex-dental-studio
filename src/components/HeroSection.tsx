'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Calendar,
  MessageCircle,
  Star,
  ShieldCheck,
  Users,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const whatsappUrl =
    'https://wa.me/919876543210?text=Hi%20Apex%20Dental,%20I%20would%20like%20to%20inquire%20about%20a%20consultation.';

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
      {/* Decorative ambient glowing backdrops */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            
            {/* Top pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold text-slate-800"
            >
              <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
              <span>NABH Standards &bull; US FDA-Approved Micro-Dentistry</span>
            </motion.div>

            {/* High-impact headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Precision Dentistry.{' '}
              <span className="block mt-1 font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#D97706]">
                Artful Smiles.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Mumbai’s premier clinic for painless root canals, invisible aligners, and full smile makeovers using US FDA-approved laser technology. Experience world-class care designed for effortless comfort.
            </p>

            {/* Dual Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                id="hero-book-consultation-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-base shadow-lg shadow-slate-900/15 hover:shadow-xl transition-all duration-300 active:scale-[0.98] group"
              >
                <Calendar className="w-5 h-5 text-[#0D9488] group-hover:scale-110 transition-transform" />
                <span>Book Doctor Consultation</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-base border border-emerald-200/80 transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-3 sm:gap-6 text-left"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 text-[#0D9488] shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base">12,000+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Happy Patients</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-50 text-[#D97706] shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base">4.9 / 5.0</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">600+ Google Reviews</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800 shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D9488]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base">100% Class-B</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Hospital Sterilization</div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Editorial Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer frame styling */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border-4 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
                  alt="Apex Dental Studio Modern Clinic Interior"
                  className="w-full h-[420px] sm:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Floating badge inside picture */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0D9488]">
                        <Award className="w-3.5 h-3.5" />
                        <span>Center of Excellence</span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        Bandra West &amp; Kandivali East
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-500 block">Single-Sitting</span>
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        Painless Laser RCT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Top Floating Card: Smile preview guarantee */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 max-w-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">3D Digital Scan Preview</div>
                  <div className="text-[11px] text-slate-500">See your final smile before starting</div>
                </div>
              </motion.div>

              {/* Verified Doctors Pill */}
              <motion.div
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute -bottom-4 -right-4 sm:-right-4 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
                    alt="Dr. Sameer Merchant"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover object-top"
                    src="/images/dr-ananya-parekh.png"
                    alt="Dr. Ananya Parekh"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Full-Time MDS Specialists</div>
                  <div className="text-[10px] text-slate-400">14+ Years Average Experience</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
