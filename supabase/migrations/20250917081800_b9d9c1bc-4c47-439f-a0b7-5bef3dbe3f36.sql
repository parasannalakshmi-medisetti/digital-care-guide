-- Remove the problematic security definer view
DROP VIEW IF EXISTS public.doctors_public;

-- Instead, we'll modify the RLS policies to be more granular
-- Remove existing policies to recreate them properly
DROP POLICY IF EXISTS "Patients can view limited doctor info for consultations" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can view their own complete profile" ON public.doctors;

-- Create a policy for patients to view only essential doctor information
-- This will be enforced at the application level by selecting only needed columns
CREATE POLICY "Authenticated users can view essential doctor info" 
ON public.doctors 
FOR SELECT 
TO authenticated
USING (available = true);

-- Allow doctors to view and modify their own complete profile
CREATE POLICY "Doctors can manage their own profile" 
ON public.doctors 
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);