'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import transformationsData from '@/data/transformations.json';
import {
  Sparkles,
  MoveHorizontal,
  CheckCircle2,
  Clock,
  UserCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface TransformationCase {
  id: string;
  title: string;
  category: string;
  doctor: string;
  duration: string;
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider() {
  const cases: TransformationCase[] = transformationsData;
  const categories = ['All', 'Aligners', 'Whitening', 'Veneers', 'Implants', 'Cosmetic'];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCaseId, setActiveCaseId] = useState<string>(cases[0].id);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activeCase =
    cases.find((c) => c.id === activeCaseId) || filteredCases[0] || cases[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative" id="transformations">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Clinical Evidence &bull; 15 Documented Cases</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Artful Smile Transformations
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Explore 15 real clinical outcomes treated by Dr. Sameer Merchant &amp; Dr. Ananya Parekh. Drag the interactive comparison divider horizontally.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? cases.length
                  : cases.filter((c) => c.category.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const matched =
                      cat === 'All'
                        ? cases[0]
                        : cases.find((c) => c.category.toLowerCase() === cat.toLowerCase());
                    if (matched) setActiveCaseId(matched.id);
                    setSliderPosition(50);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#0D9488] border-[#0D9488] text-white shadow-md shadow-teal-900/30'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="relative w-full h-[340px] sm:h-[460px] md:h-[540px] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-slate-700/80 shadow-2xl bg-slate-950"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              if (e.touches[0]) handleMove(e.touches[0].clientX);
            }}
          >
            {/* After Image (Background layer) */}
            <img
              src={activeCase.afterImage}
              alt={`${activeCase.title} - After Transformation`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* After Badge */}
            <div className="absolute top-4 right-4 z-20 bg-emerald-500/90 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>After Result</span>
            </div>

            {/* Before Image (Foreground clipped layer) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeCase.beforeImage}
                alt={`${activeCase.title} - Before Transformation`}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-slate-950/20" />

              {/* Before Badge */}
              <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-slate-200 font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                Before
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Draggable Circle Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl border-2 border-[#0D9488] active:scale-110 transition-transform"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <MoveHorizontal className="w-5 h-5 text-[#0D9488]" />
              </div>
            </div>

            {/* Interaction Instruction Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-slate-300 pointer-events-none flex items-center gap-2 border border-slate-800 shadow-md">
              <MoveHorizontal className="w-3.5 h-3.5 text-teal-400" />
              <span>Slide divider left or right</span>
            </div>
          </div>

          {/* Active Case Clinical Metadata Card */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-800/85 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center sm:text-left shadow-lg">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Clinical Case
              </span>
              <p className="font-extrabold text-slate-100 text-sm mt-0.5">
                {activeCase.title}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Category
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-500/30 text-xs font-semibold mt-1">
                {activeCase.category}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Lead Specialist
              </span>
              <p className="font-bold text-slate-200 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>{activeCase.doctor}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Treatment Duration
              </span>
              <p className="font-bold text-amber-400 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeCase.duration}</span>
              </p>
            </div>
          </div>

          {/* 15-Case Interactive Thumbnail Browser */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select from {filteredCases.length} Cases ({selectedCategory}):
              </span>
              <span className="text-[11px] text-teal-400 font-semibold">
                Showing Case {activeCase.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {filteredCases.map((item) => {
                const isCurrent = activeCase.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveCaseId(item.id);
                      setSliderPosition(50);
                    }}
                    className={`p-2 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isCurrent
                        ? 'bg-slate-800 border-[#0D9488] ring-2 ring-[#0D9488]/40 shadow-lg'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 bg-slate-950">
                      <img
                        src={item.afterImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <span className="absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-white font-mono">
                        {item.id}
                      </span>
                    </div>

                    <div className="font-bold text-[11px] text-slate-200 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.doctor.replace('Dr. ', '')} &bull; {item.duration}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
