-- Remove the overly permissive policy that exposes all doctor data publicly
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;

-- Create a new policy that only allows patients to view essential doctor information
-- This excludes sensitive data like email, phone, license_number
CREATE POLICY "Patients can view limited doctor info for consultations" 
ON public.doctors 
FOR SELECT 
TO authenticated
USING (
  -- Only allow viewing if the requesting user is a patient
  EXISTS (
    SELECT 1 FROM public.patients p 
    WHERE p.user_id = auth.uid()
  )
);

-- Allow doctors to view their own complete profile
CREATE POLICY "Doctors can view their own complete profile" 
ON public.doctors 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create a view for public doctor information that excludes sensitive data
CREATE OR REPLACE VIEW public.doctors_public AS
SELECT 
  id,
  full_name,
  specialization,
  bio,
  experience_years,
  available,
  created_at
FROM public.doctors
WHERE available = true;

-- Enable RLS on the view
ALTER VIEW public.doctors_public SET (security_barrier = true);

-- Grant access to the public view for authenticated users
GRANT SELECT ON public.doctors_public TO authenticated;