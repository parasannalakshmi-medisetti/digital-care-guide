-- Fix RLS policies step by step to prevent conflicts

-- Drop all existing policies on patients table
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'patients' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.patients';
    END LOOP;
END $$;

-- Drop all existing policies on doctors table  
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'doctors' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.doctors';
    END LOOP;
END $$;

-- Create secure policies for patients table
CREATE POLICY "Patients can insert their own profile" 
ON patients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Patients can update their own profile" 
ON patients 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Patients can view their own profile" 
ON patients 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a security definer function to check doctor access to patients
CREATE OR REPLACE FUNCTION public.doctor_can_view_patient(patient_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM consultation_requests cr
    JOIN doctors d ON d.id = cr.doctor_id
    JOIN patients p ON p.id = cr.patient_id
    WHERE p.user_id = patient_user_id 
    AND d.user_id = auth.uid()
  );
$$;

-- Create doctor access policy using the security definer function
CREATE POLICY "Doctors can view patients for consultations" 
ON patients 
FOR SELECT 
USING (public.doctor_can_view_patient(user_id));

-- Create secure policies for doctors table (only basic info visible publicly)
CREATE POLICY "Public can view basic doctor info" 
ON doctors 
FOR SELECT 
USING (available = true);

CREATE POLICY "Doctors can insert their own profile" 
ON doctors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile" 
ON doctors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view their own profile" 
ON doctors 
FOR ALL
USING (auth.uid() = user_id);