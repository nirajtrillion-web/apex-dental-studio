'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export default function TechnologySection() {
  const techs = [
    {
      title: 'Biolase Epic Diode Laser',
      subtitle: 'Pain-Free Soft Tissue & Bleaching',
      desc: 'Enables bloodless gum contouring and instant laser tooth whitening with zero needle anxiety or post-op stitches.',
      badge: 'US FDA Approved',
    },
    {
      title: 'iTero Element 5D 3D Scanner',
      subtitle: 'Instant Optical Dental Mapping',
      desc: 'Eliminates uncomfortable silicone impression paste with 6,000 optical frames/sec for precision clear aligner fit.',
      badge: '6,000 Scans/Sec',
    },
    {
      title: 'Melag Class-B Hospital Autoclave',
      subtitle: '100% Zero-Infection Sterilization',
      desc: 'German vacuum autoclave technology delivering hospital-grade pathogen eradication across every clinical tool.',
      badge: 'EN 13060 Standard',
    },
    {
      title: 'Carl Zeiss Operating Dental Microscope',
      subtitle: 'Microscopic Endodontic Precision',
      desc: 'Up to 25x optical magnification ensuring no micro-canals are missed during single-sitting root canal therapy.',
      badge: '25x Magnification',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80" id="technology">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-[#0D9488] text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Digital Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Advanced Clinical Engineering
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Why patients travel from across South Mumbai, the Western Suburbs, and abroad to Apex Dental Studio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techs.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.45,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 luxury-card-shadow luxury-card-hover flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-[#0D9488] text-[10px] font-bold tracking-wider uppercase mb-3">
                  {t.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {t.title}
                </h3>
                <span className="text-xs font-semibold text-[#D97706] block mt-0.5 mb-2">
                  {t.subtitle}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Available at Bandra &amp; Kandivali</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
