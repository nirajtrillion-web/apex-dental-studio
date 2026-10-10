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

const DEFAULT_TREATMENTS: Treatment[] = [
  {
    id: 't1000000-0000-0000-0000-000000000001',
    name: 'Clear Aligner Smile Correction',
    category: 'Cosmetic',
    tagline: 'Custom US-FDA certified clear aligners designed by Dr. Ananya Parekh for gap & crowding correction.',
    starting_price: 65000,
    duration: '6 - 14 Months',
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    inclusions: ['3D Intraoral Digital Scan', 'AI-Powered Smile Preview', 'All Aligner Trays + Retainers', 'Bi-Monthly Progress Checkups'],
  },
  {
    id: 't1000000-0000-0000-0000-000000000002',
    name: 'Single Tooth / Full Arch Implant',
    category: 'Implants',
    tagline: 'Permanent Swedish titanium implant with computer-guided surgical precision by Dr. Sameer Merchant.',
    starting_price: 32000,
    duration: '3 - 6 Months',
    image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    inclusions: ['3D CBCT Bone Density Scan', 'Grade-5 Titanium Implant Post', 'Custom Zirconia Crown', 'Lifetime Manufacturer Warranty'],
  },
  {
    id: 't1000000-0000-0000-0000-000000000003',
    name: 'Hollywood Porcelain Veneers',
    category: 'Cosmetic',
    tagline: 'Hand-sculpted ultra-thin E.Max ceramic veneers for permanent radiance and stain resistance.',
    starting_price: 18000,
    duration: '2 - 3 Sessions',
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
    inclusions: ['Digital Smile Design (DSD)', 'Mockup Fitting & Try-In', 'Custom Color Shading & Glaze', '10-Year Fracture Guarantee'],
  },
  {
    id: 't1000000-0000-0000-0000-000000000004',
    name: 'Laser Teeth Whitening (In-Office)',
    category: 'Cosmetic',
    tagline: 'Instant 6 to 8 shades lighter radiance in a single 45-minute painless laser session.',
    starting_price: 12000,
    duration: '45 Minutes',
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    inclusions: ['Ultrasonic Enamel Polishing', 'Cold Blue Laser Activation Gel', 'Anti-Sensitivity Desensitizer', 'Take-Home Maintenance Kit'],
  },
  {
    id: 't1000000-0000-0000-0000-000000000005',
    name: 'Microscopic Root Canal Therapy',
    category: 'General',
    tagline: 'Single-sitting painless root canal under Carl Zeiss surgical magnification.',
    starting_price: 8500,
    duration: '45 - 60 Minutes',
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    inclusions: ['Digital RVG X-Rays', '3D Rotary Apex Locator', 'Biocompatible Gutta Percha Seal', 'Monitored Local Anesthesia'],
  },
  {
    id: 't1000000-0000-0000-0000-000000000006',
    name: 'Comprehensive Oral & Cancer Screening',
    category: 'General',
    tagline: 'Full-mouth digital wellness audit, HD intraoral camera tour, and ultrasonic scaling.',
    starting_price: 1500,
    duration: '30 Minutes',
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    inclusions: ['Full Mouth Ultrasonic Scaling', 'HD Intraoral Camera Tour', 'Enamel Mineralization Audit', 'Personalized Care Blueprint'],
  },
];

export default function HomePage() {
  const [treatments, setTreatments] = useState<Treatment[]>(DEFAULT_TREATMENTS);
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

        if (treatmentsRes.data && treatmentsRes.data.length > 0) {
          setTreatments(treatmentsRes.data as Treatment[]);
        }
        if (doctorsRes.data && doctorsRes.data.length > 0) {
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
      // Smooth scroll to treatments with Lenis
      const treatmentEl = document.getElementById('treatments');
      if (treatmentEl) {
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(treatmentEl, { offset: -80, duration: 1.2 });
        } else {
          treatmentEl.scrollIntoView({ behavior: 'smooth' });
        }
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
