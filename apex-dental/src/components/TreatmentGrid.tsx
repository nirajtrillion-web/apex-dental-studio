'use client';

import React, { useState } from 'react';
import { Treatment } from '@/lib/types';
import { Clock, Check, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';

interface TreatmentGridProps {
  treatments: Treatment[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onBookTreatment: (treatment: Treatment) => void;
}

export default function TreatmentGrid({
  treatments,
  selectedCategory,
  onCategoryChange,
  onBookTreatment,
}: TreatmentGridProps) {
  const categories = ['All', 'Cosmetic', 'General', 'Implants'];

  const filteredTreatments = treatments.filter((t) => {
    if (selectedCategory === 'All') return true;
    return t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F8FAFC]" id="treatments">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-[#0D9488] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Mumbai Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Curated Dental Specializations
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Every procedure is performed in an ultra-sterile, HEPA-filtered operatory using digital scans and painless microscopic techniques.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col luxury-card-shadow luxury-card-hover group"
            >
              {/* Treatment Image & Badges */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={treatment.image_url}
                  alt={treatment.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
                  {treatment.category}
                </span>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-white backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>{treatment.duration}</span>
                </div>

                {/* Price pill inside overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[11px] text-slate-300 font-medium block">Starting from</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-300">
                      {formatPrice(treatment.starting_price)}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-medium bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    Zero-Cost EMI Avail.
                  </span>
                </div>
              </div>

              {/* Treatment Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#0D9488] transition-colors">
                    {treatment.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {treatment.tagline}
                  </p>
                </div>

                {/* Checklist inclusions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                    What is Included:
                  </span>
                  <ul className="space-y-1.5">
                    {treatment.inclusions.map((inclusion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <div className="p-0.5 rounded-full bg-teal-50 text-[#0D9488] shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <div className="pt-3">
                  <button
                    onClick={() => onBookTreatment(treatment)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-[#0D9488] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-sm"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-sm">No treatments found for this selection.</p>
            <button
              onClick={() => onCategoryChange('All')}
              className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
