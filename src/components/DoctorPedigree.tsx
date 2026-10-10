'use client';

import React from 'react';
import Doctors from './Doctors';
import { Doctor } from '@/lib/types';

interface DoctorPedigreeProps {
  doctors: Doctor[];
  onOpenBooking: (treatmentId?: string, concern?: string, doctorId?: string) => void;
}

export default function DoctorPedigree({ doctors, onOpenBooking }: DoctorPedigreeProps) {
  return <Doctors doctors={doctors} onOpenBooking={onOpenBooking} />;
}
