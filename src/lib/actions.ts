'use server';

import { supabase } from '@/lib/supabase';
import { appointmentFormSchema, type AppointmentFormValues } from '@/lib/validations';
import { sanitizeInputText, validateFormTiming } from '@/lib/security';

export async function createAppointmentAction(formData: AppointmentFormValues) {
  // 1. Zod Validation & Anti-Bot Verification
  const validationResult = appointmentFormSchema.safeParse(formData);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((e) => e.message).join(', ');
    return {
      success: false,
      error: errorMessages || 'Validation failed. Please verify your entries.',
    };
  }

  const {
    patient_name,
    patient_phone,
    patient_email,
    treatment_id,
    appointment_date,
    time_slot,
    dental_concern,
    doctor_id: preferredDoctorId,
    trap_website,
    form_rendered_at,
  } = validationResult.data;

  // 2. Reject automated bot spam if invisible honeypot field is filled
  if (trap_website && trap_website.length > 0) {
    return {
      success: false,
      error: 'Security verification failed. Please try again.',
    };
  }

  // 3. Reject automated instant submission (< 1.5 seconds)
  if (form_rendered_at && !validateFormTiming(form_rendered_at, 1.5)) {
    return {
      success: false,
      error: 'Submission was too fast. Please take your time to review details.',
    };
  }

  try {
    const bookingId = crypto.randomUUID();

    // Determine doctor_id if not explicitly provided
    let assignedDoctorId = preferredDoctorId;
    if (!assignedDoctorId) {
      if (
        treatment_id === 'a1000000-0000-0000-0000-000000000001' || // Clear Aligners
        (dental_concern && dental_concern.toLowerCase().includes('crook')) ||
        (dental_concern && dental_concern.toLowerCase().includes('align'))
      ) {
        assignedDoctorId = 'd1000000-0000-0000-0000-000000000002'; // Dr. Ananya
      } else {
        assignedDoctorId = 'd1000000-0000-0000-0000-000000000001'; // Dr. Sameer
      }
    }

    // Sanitize user inputs to prevent XSS / injection
    const cleanPatientName = sanitizeInputText(patient_name);
    const cleanPhone = patient_phone.trim();
    const cleanEmail = patient_email ? sanitizeInputText(patient_email.toLowerCase()) : null;
    const cleanConcern = dental_concern ? sanitizeInputText(dental_concern) : null;

    // 4. Parameterized Insert into Supabase appointments table with explicit columns (Block field tampering)
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          id: bookingId,
          patient_name: cleanPatientName,
          patient_phone: cleanPhone,
          patient_email: cleanEmail,
          treatment_id,
          doctor_id: assignedDoctorId,
          appointment_date,
          time_slot,
          dental_concern: cleanConcern,
          status: 'pending', // Immutable initial state
        },
      ]);

    if (error) {
      console.error('Supabase booking insert error:', error);
      return {
        success: false,
        error: error.message || 'Unable to schedule appointment. Please try again.',
      };
    }

    // 5. Trim API Response: return only safe, minimal fields
    return {
      success: true,
      data: {
        id: bookingId,
        patient_name: cleanPatientName,
        appointment_date,
        time_slot,
        status: 'pending',
      },
    };
  } catch (err: unknown) {
    console.error('Booking server action exception:', err);
    return {
      success: false,
      error: 'An unexpected error occurred while scheduling your consultation.',
    };
  }
}
