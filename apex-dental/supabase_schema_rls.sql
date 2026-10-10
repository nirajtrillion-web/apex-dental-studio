-- ==============================================================================
-- Apex Dental Studio - Supabase PostgreSQL Schema with Row-Level Security (RLS)
-- ==============================================================================

-- 1. Enable Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Treatments Catalog Table
CREATE TABLE IF NOT EXISTS public.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    starting_price NUMERIC(10, 2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    is_featured BOOLEAN DEFAULT false,
    warranty_years INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Doctors Registry Table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    experience_years INT NOT NULL DEFAULT 5,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Secure Staff Users & Credentials Table (with Bcrypt Hashed Passwords)
CREATE TABLE IF NOT EXISTS public.staff_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Stored with crypt(password, gen_salt('bf'))
    role VARCHAR(50) DEFAULT 'doctor' NOT NULL, -- 'doctor' | 'admin' | 'receptionist'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Appointments & OPD Consultation Queue
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name VARCHAR(120) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(150),
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE RESTRICT,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    dental_concern TEXT,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row-Level Security (RLS) on All Tables
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: Treatments & Doctors (Public Read)
CREATE POLICY "Allow public read access to treatments"
    ON public.treatments FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to doctors"
    ON public.doctors FOR SELECT
    USING (true);

-- 8. RLS Policies: Appointments
-- Anyone can book an appointment, but only with initial 'pending' status
CREATE POLICY "Allow public insert for appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (status = 'pending');

-- Public cannot view sensitive patient appointment data directly
CREATE POLICY "Restrict direct public select on appointments"
    ON public.appointments FOR SELECT
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 9. RLS Policies: Staff Users (Strictly Private)
CREATE POLICY "Lock staff users table to service_role"
    ON public.staff_users FOR ALL
    USING (auth.role() = 'service_role');

-- 10. Secure Stored Procedures (RPCs) with Parameterization

-- Secure Staff Login Verification (Bcrypt Comparison in Postgres)
CREATE OR REPLACE FUNCTION public.verify_staff_login(p_email TEXT, p_password TEXT)
RETURNS TABLE (
    user_id UUID,
    doctor_id UUID,
    doctor_name VARCHAR,
    doctor_specialization VARCHAR,
    email VARCHAR,
    role VARCHAR
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id AS user_id,
        u.doctor_id,
        COALESCE(d.name, 'Clinical Administrator') AS doctor_name,
        COALESCE(d.specialization, 'Operations') AS doctor_specialization,
        u.email,
        u.role
    FROM public.staff_users u
    LEFT JOIN public.doctors d ON u.doctor_id = d.id
    WHERE LOWER(u.email) = LOWER(p_email)
      AND u.is_active = true
      AND u.password_hash = crypt(p_password, u.password_hash)
    LIMIT 1;
END;
$$;

-- Secure Doctor OPD Appointments Query (Parameterized & Filtered)
CREATE OR REPLACE FUNCTION public.get_doctor_appointments(p_doctor_id UUID)
RETURNS SETOF public.appointments
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.appointments
    WHERE doctor_id = p_doctor_id
    ORDER BY created_at DESC;
END;
$$;

-- Secure Reception & Clinical Coordinator Appointments Query
CREATE OR REPLACE FUNCTION public.get_all_appointments()
RETURNS SETOF public.appointments
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.appointments
    ORDER BY created_at DESC;
END;
$$;

-- Secure Appointment Status Updater
CREATE OR REPLACE FUNCTION public.update_appointment_status(p_id UUID, p_status VARCHAR)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_status NOT IN ('pending', 'confirmed', 'completed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition requested';
    END IF;

    UPDATE public.appointments
    SET status = p_status,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_id;

    RETURN FOUND;
END;
$$;
