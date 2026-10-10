'use client';

import React from 'react';
import Image from 'next/image';
import { Doctor } from '@/lib/types';
import { Award, GraduationCap, Clock, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

interface DoctorsProps {
  doctors: Doctor[];
  onOpenBooking: (treatmentId?: string, concern?: string, doctorId?: string) => void;
}

export default function Doctors({ doctors, onOpenBooking }: DoctorsProps) {
  // Fallback doctor profiles if not yet loaded from DB
  const defaultDoctors: Doctor[] = [
    {
      id: 'd1000000-0000-0000-0000-000000000001',
      name: 'Dr. Sameer Merchant, MDS',
      specialization: 'Chief Cosmetic Dentist & Oral Implantologist',
      experience_years: 14,
      degrees: 'BDS, MDS (Prosthodontics) - KEM Hospital & Seth GS Medical College, Mumbai | Fellow ICOI (USA)',
      image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'd1000000-0000-0000-0000-000000000002',
      name: 'Dr. Ananya Parekh, MDS',
      specialization: 'Orthodontist & Dentofacial Orthopedics (Clear Aligners Specialist)',
      experience_years: 9,
      degrees: 'BDS, MDS (Orthodontics), Certified Invisalign Provider | Ex-Nair Hospital Dental College',
      image_url: '/images/dr-ananya-parekh.png',
    },
  ];

  const displayDoctors = (doctors && doctors.length >= 2 ? doctors : defaultDoctors).map((doc) => {
    if (doc.name.includes('Ananya')) {
      return { ...doc, image_url: '/images/dr-ananya-parekh.png' };
    }
    return doc;
  });

  return (
    <section className="py-20 bg-white border-b border-slate-200/80" id="specialists">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-[#0D9488] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>MDS Leadership &amp; Pedigree</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Consult Mumbai’s Leading Dental Specialists
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Every clinical procedure is personally administered by distinguished Masters in Dental Surgery (MDS). No junior interns or outsourced general dentists.
          </p>
        </div>

        {/* Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto" id="doctors-grid">
          {displayDoctors.map((doctor) => {
            const isDrAnanya = doctor.name.includes('Ananya');

            return (
              <div
                key={doctor.id}
                className="bg-[#F8FAFC] rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col luxury-card-shadow luxury-card-hover group"
              >
                {/* Doctor Headshot & Badges */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-200">
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 text-slate-900 px-3 py-1 rounded-full text-xs font-extrabold shadow-md backdrop-blur-md flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>
                      {isDrAnanya ? '9+ Years Experience' : `${doctor.experience_years}+ Years Experience`}
                    </span>
                  </div>

                  {/* Certified Provider / Council Badge */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>
                      {isDrAnanya ? 'Certified Invisalign Provider' : 'Maharashtra Dental Council Reg.'}
                    </span>
                  </div>

                  {/* Name & Title over dark gradient */}
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <h3 className="text-2xl font-black tracking-tight">{doctor.name}</h3>
                    <p className="text-teal-300 text-xs sm:text-sm font-semibold mt-0.5">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                {/* Bio & Academic Credentials */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Degree & Hospital affiliations */}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        Academic Pedigree &amp; Qualifications
                      </span>
                      <div className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                        <GraduationCap className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                        <span>{doctor.degrees}</span>
                      </div>
                    </div>

                    {/* Clinical Specializations */}
                    <div className="pt-3 border-t border-slate-200/60">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                        Clinical Focus Areas
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {isDrAnanya ? (
                          <>
                            <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                              Invisible Clear Aligners
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                              Dentofacial Orthopedics
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                              Adult &amp; Teen Smile Alignment
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 font-semibold">
                              Invisalign Platinum Elite
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                              Full Arch Implants (All-on-4)
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                              E.max Ceramic Veneers
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                              Digital Smile Design
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                              Fellow ICOI (USA)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consultation trigger */}
                  <button
                    onClick={() => onOpenBooking(undefined, undefined, doctor.id)}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm group-hover:border-slate-400"
                    id={`book-with-${doctor.id}`}
                  >
                    <Calendar className="w-4 h-4 text-[#0D9488]" />
                    <span>Book Consultation with {doctor.name.split(',')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
