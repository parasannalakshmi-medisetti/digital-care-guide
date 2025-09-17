-- Fix RLS policies to prevent infinite recursion and allow proper user registration

-- First, drop problematic policies that might cause recursion
DROP POLICY IF EXISTS "Doctors can view patient profiles for their consultations" ON patients;
DROP POLICY IF EXISTS "Doctors can view patients for consultations" ON users;
DROP POLICY IF EXISTS "Authenticated users can view essential doctor info" ON doctors;
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;

-- Drop existing patients policies
DROP POLICY IF EXISTS "Patients can insert their own profile" ON patients;
DROP POLICY IF EXISTS "Patients can update their own profile" ON patients;
DROP POLICY IF EXISTS "Patients can view their own profile" ON patients;

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

-- Create new policy for public doctor info (only essential fields)
CREATE POLICY "Public can view basic doctor info" 
ON doctors 
FOR SELECT 
USING (available = true);

-- Drop existing profiles policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger function to auto-create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger to auto-create profiles on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();