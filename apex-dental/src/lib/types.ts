export interface Treatment {
  id: string;
  name: string;
  category: 'Cosmetic' | 'General' | 'Implants' | string;
  tagline: string;
  duration: string;
  starting_price: number;
  inclusions: string[];
  image_url: string;
  created_at?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  degrees: string;
  image_url: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string | null;
  treatment_id?: string | null;
  doctor_id?: string | null;
  appointment_date: string;
  time_slot: string;
  dental_concern?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  treatments?: Treatment;
  doctor?: Doctor;
}

export type DentalConcern = {
  id: string;
  label: string;
  iconName: string;
  defaultTreatmentId?: string;
  description: string;
};
