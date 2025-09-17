-- Create patients table with required columns
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table with required columns
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  experience_years INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for patients table
CREATE POLICY "Anyone can insert into patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own patient profile" 
ON public.patients 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own patient profile" 
ON public.patients 
FOR UPDATE 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create policies for doctors table
CREATE POLICY "Anyone can insert into doctors" 
ON public.doctors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own doctor profile" 
ON public.doctors 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own doctor profile" 
ON public.doctors 
FOR UPDATE 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_patients_email ON public.patients(email);
CREATE INDEX idx_patients_phone ON public.patients(phone);
CREATE INDEX idx_doctors_email ON public.doctors(email);
CREATE INDEX idx_doctors_phone ON public.doctors(phone);
CREATE INDEX idx_doctors_license ON public.doctors(license_number);