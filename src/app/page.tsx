'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Treatment, Doctor } from '@/lib/types';
import TopUtilityBar from '@/components/TopUtilityBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DentalConcernSelector, { ConcernOption } from '@/components/DentalConcernSelector';
import TreatmentGrid from '@/components/TreatmentGrid';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import DoctorPedigree from '@/components/DoctorPedigree';
import TechnologySection from '@/components/TechnologySection';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import StickyMobileActionBar from '@/components/StickyMobileActionBar';

export default function HomePage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & interaction state
  const [selectedConcernId, setSelectedConcernId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedTreatmentId, setPreselectedTreatmentId] = useState<string | undefined>(undefined);
  const [preselectedConcern, setPreselectedConcern] = useState<string | undefined>(undefined);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);

  // Fetch Treatments and Doctors from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [treatmentsRes, doctorsRes] = await Promise.all([
          supabase.from('treatments').select('*').order('starting_price', { ascending: true }),
          supabase.from('doctors').select('*').order('experience_years', { ascending: false }),
        ]);

        if (treatmentsRes.data) {
          setTreatments(treatmentsRes.data as Treatment[]);
        }
        if (doctorsRes.data) {
          setDoctors(doctorsRes.data as Doctor[]);
        }
      } catch (err) {
        console.error('Failed to load clinic data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handlers
  const handleOpenBooking = (treatmentId?: string, concern?: string, doctorId?: string) => {
    setPreselectedTreatmentId(treatmentId);
    setPreselectedConcern(concern);
    setPreselectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  const handleSelectConcern = (concern: ConcernOption | null) => {
    if (!concern) {
      setSelectedConcernId(null);
      setSelectedCategory('All');
    } else {
      setSelectedConcernId(concern.id);
      setSelectedCategory(concern.categoryFilter);
      // Smooth scroll to treatments
      const treatmentEl = document.getElementById('treatments');
      if (treatmentEl) {
        treatmentEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBookDirectConcern = (treatmentKeyword: string, concernLabel: string) => {
    const matched = treatments.find((t) =>
      t.name.toLowerCase().includes(treatmentKeyword.toLowerCase())
    );
    handleOpenBooking(matched ? matched.id : undefined, concernLabel);
  };

  const handleBookTreatment = (treatment: Treatment) => {
    handleOpenBooking(treatment.id, treatment.name);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* 1. Top Utility Bar */}
      <TopUtilityBar />

      {/* 2. Sticky Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection onOpenBooking={() => handleOpenBooking()} />

        {/* 4. Find Care by Dental Concern Quick Selector */}
        <DentalConcernSelector
          selectedConcernId={selectedConcernId}
          onSelectConcern={handleSelectConcern}
          onBookDirect={handleBookDirectConcern}
        />

        {/* 5. Interactive Treatment Grid (Fetching from Supabase) */}
        <TreatmentGrid
          treatments={treatments}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onBookTreatment={handleBookTreatment}
        />

        {/* 6. Interactive Before & After Transformation Slider */}
        <BeforeAfterSlider />

        {/* 7. Doctor Pedigree Section */}
        <DoctorPedigree
          doctors={doctors}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 8. US FDA Technology & Sterilization Standards */}
        <TechnologySection />
      </main>

      {/* 9. Luxury Footer */}
      <Footer />

      {/* 10. Multi-Step Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        treatments={treatments}
        initialTreatmentId={preselectedTreatmentId}
        initialConcern={preselectedConcern}
        initialDoctorId={preselectedDoctorId}
      />

      {/* 11. Floating WhatsApp Consultation Widget */}
      <WhatsAppWidget />

      {/* 12. Sticky Mobile Action Bar (Viewports < 768px) */}
      <StickyMobileActionBar onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
}
