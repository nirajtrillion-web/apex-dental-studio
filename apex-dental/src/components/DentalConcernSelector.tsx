'use client';

import React from 'react';
import {
  Flame,
  Smile,
  Sparkles,
  ShieldAlert,
  Activity,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export interface ConcernOption {
  id: string;
  label: string;
  categoryFilter: string; // 'all' | 'Cosmetic' | 'General' | 'Implants'
  treatmentKeyword: string;
  description: string;
  icon: React.ReactNode;
}

export const CONCERN_OPTIONS: ConcernOption[] = [
  {
    id: 'tooth-pain',
    label: 'Tooth Pain / Sensitivity',
    categoryFilter: 'General',
    treatmentKeyword: 'Single-Sitting Rotary RCT',
    description: 'Painless microscopic root canal therapy with same-day relief',
    icon: <Flame className="w-4 h-4 text-rose-500" />,
  },
  {
    id: 'crooked-teeth',
    label: 'Crooked / Crowded Teeth',
    categoryFilter: 'Cosmetic',
    treatmentKeyword: 'Invisible Aligners',
    description: 'Custom clear aligners without unsightly metal braces',
    icon: <Smile className="w-4 h-4 text-[#0D9488]" />,
  },
  {
    id: 'yellow-teeth',
    label: 'Yellow / Stained Teeth',
    categoryFilter: 'Cosmetic',
    treatmentKeyword: 'Laser Teeth Whitening',
    description: 'Instant 6-8 shade brightening with zero enamel sensitivity',
    icon: <Sparkles className="w-4 h-4 text-[#D97706]" />,
  },
  {
    id: 'missing-tooth',
    label: 'Missing Tooth / Gap',
    categoryFilter: 'Implants',
    treatmentKeyword: 'Nobel Biocare Dental Implant',
    description: 'Permanent titanium implant with lifelong warranty',
    icon: <ShieldAlert className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'bleeding-gums',
    label: 'Bleeding Gums / Bad Breath',
    categoryFilter: 'General',
    treatmentKeyword: 'Pediatric Dental Cleaning & Fluoride',
    description: 'Ultrasonic calculus scaling and deep gum rejuvenation',
    icon: <Activity className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'smile-makeover',
    label: 'Chipped Tooth / Smile Makeover',
    categoryFilter: 'Cosmetic',
    treatmentKeyword: 'Ceramic Veneers & Laminates',
    description: 'Ultra-thin E.max porcelain laminates handcrafted for symmetry',
    icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />,
  },
];

interface DentalConcernSelectorProps {
  selectedConcernId: string | null;
  onSelectConcern: (concern: ConcernOption | null) => void;
  onBookDirect: (treatmentKeyword: string, concernLabel: string) => void;
}

export default function DentalConcernSelector({
  selectedConcernId,
  onSelectConcern,
  onBookDirect,
}: DentalConcernSelectorProps) {
  const activeConcern = CONCERN_OPTIONS.find((c) => c.id === selectedConcernId);

  return (
    <section className="py-12 bg-white border-y border-slate-200/60" id="concerns">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-[#0D9488] text-xs font-bold uppercase tracking-wider mb-2">
              Guided Symptom Finder
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Find Care by Dental Concern
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Select what best describes your dental need. We will filter the recommended treatments and prepare your consultation.
            </p>
          </div>

          {selectedConcernId && (
            <button
              onClick={() => onSelectConcern(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline self-start md:self-auto"
            >
              Clear filter (Show all treatments)
            </button>
          )}
        </div>

        {/* Concern Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => onSelectConcern(null)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              selectedConcernId === null
                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <span>All Treatments</span>
          </button>

          {CONCERN_OPTIONS.map((concern) => {
            const isSelected = selectedConcernId === concern.id;
            return (
              <button
                key={concern.id}
                onClick={() => onSelectConcern(isSelected ? null : concern)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                  isSelected
                    ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-md shadow-teal-900/15 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span>{concern.icon}</span>
                <span>{concern.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Concern Dynamic Prompt Banner */}
        {activeConcern && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-slate-50 border border-teal-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#0D9488]">
                {activeConcern.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  Recommended Solution for {activeConcern.label}
                </span>
                <p className="text-sm text-slate-700 font-medium">
                  {activeConcern.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onBookDirect(activeConcern.treatmentKeyword, activeConcern.label)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
            >
              <span>Book For This Concern</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
