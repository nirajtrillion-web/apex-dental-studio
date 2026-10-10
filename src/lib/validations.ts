import { z } from 'zod';

export const appointmentFormSchema = z.object({
  patient_name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(80, { message: 'Name cannot exceed 80 characters.' })
    .regex(/^[a-zA-Z\s.'-]+$/, { message: 'Please enter a valid full name (letters, spaces, dots, hyphens only).' }),
  
  patient_phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, {
      message: 'Please enter a valid 10-digit Indian mobile number (e.g. 9820123456)',
    }),
  
  patient_email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address.' })
    .max(100, { message: 'Email cannot exceed 100 characters.' })
    .optional()
    .or(z.literal('')),
  
  treatment_id: z
    .string()
    .trim()
    .min(1, { message: 'Please select a valid treatment.' })
    .max(64, { message: 'Invalid treatment identifier.' }),
  
  appointment_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Appointment date must be in YYYY-MM-DD format.' }),
  
  time_slot: z
    .string()
    .trim()
    .min(1, { message: 'Please select an appointment time slot.' })
    .max(50, { message: 'Invalid time slot format.' }),
  
  dental_concern: z
    .string()
    .trim()
    .max(500, { message: 'Dental concern cannot exceed 500 characters.' })
    .optional()
    .or(z.literal('')),
    
  doctor_id: z
    .string()
    .trim()
    .max(64, { message: 'Invalid doctor identifier.' })
    .optional()
    .or(z.literal('')),
  
  // Anti-bot honeypot field: must remain empty
  trap_website: z
    .string()
    .max(0, { message: 'Automated bot activity detected.' })
    .optional()
    .or(z.literal('')),

  // Anti-bot timestamp challenge
  form_rendered_at: z.number().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const staffLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'A valid doctor or staff email is required.' })
    .max(120, { message: 'Email cannot exceed 120 characters.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' }),
});

export type StaffLoginValues = z.infer<typeof staffLoginSchema>;

export const appointmentStatusUpdateSchema = z.object({
  id: z.string().uuid({ message: 'Invalid appointment ID format.' }),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'], {
    message: 'Unauthorized appointment status value.',
  }),
});
