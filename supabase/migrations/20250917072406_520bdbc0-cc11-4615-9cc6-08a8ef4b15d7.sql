-- Create a unified users table for all registration data
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'doctor')),
  
  -- Doctor-specific fields
  specialization TEXT,
  license_number TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  available BOOLEAN DEFAULT true,
  
  -- Patient-specific fields
  date_of_birth DATE,
  gender TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = auth_user_id);

-- Doctors can view patient profiles for their consultations
CREATE POLICY "Doctors can view patients for consultations" 
ON public.users 
FOR SELECT 
USING (
  user_type = 'patient' AND EXISTS (
    SELECT 1 FROM consultation_requests cr
    JOIN doctors d ON d.id = cr.doctor_id
    WHERE d.user_id = auth.uid()
    AND cr.patient_id IN (
      SELECT p.id FROM patients p WHERE p.user_id = users.auth_user_id
    )
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();