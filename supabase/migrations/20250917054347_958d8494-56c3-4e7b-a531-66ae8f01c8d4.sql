-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  phone TEXT,
  bio TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  current_symptoms TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultation requests table
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  symptoms TEXT NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'video', -- 'video' or 'chat'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'completed'
  request_message TEXT,
  doctor_response TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_request_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  medications TEXT NOT NULL,
  dosage_instructions TEXT NOT NULL,
  health_tips TEXT,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (consultation_request_id) REFERENCES consultation_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for doctors
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update their own profile" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Doctors can insert their own profile" ON public.doctors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for patients
CREATE POLICY "Patients can view their own profile" ON public.patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view patient profiles for their consultations" ON public.patients FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM consultation_requests cr
    JOIN doctors d ON d.id = cr.doctor_id
    WHERE cr.patient_id = patients.id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Patients can update their own profile" ON public.patients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Patients can insert their own profile" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for consultation requests
CREATE POLICY "Patients can view their own consultation requests" ON public.consultation_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients p WHERE p.id = consultation_requests.patient_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can view consultation requests sent to them" ON public.consultation_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM doctors d WHERE d.id = consultation_requests.doctor_id AND d.user_id = auth.uid())
);
CREATE POLICY "Patients can create consultation requests" ON public.consultation_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM patients p WHERE p.id = consultation_requests.patient_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can update consultation requests sent to them" ON public.consultation_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM doctors d WHERE d.id = consultation_requests.doctor_id AND d.user_id = auth.uid())
);

-- Create policies for prescriptions
CREATE POLICY "Patients can view their own prescriptions" ON public.prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients p WHERE p.id = prescriptions.patient_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can view prescriptions they created" ON public.prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM doctors d WHERE d.id = prescriptions.doctor_id AND d.user_id = auth.uid())
);
CREATE POLICY "Doctors can create prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM doctors d WHERE d.id = prescriptions.doctor_id AND d.user_id = auth.uid())
);
CREATE POLICY "Doctors can update their own prescriptions" ON public.prescriptions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM doctors d WHERE d.id = prescriptions.doctor_id AND d.user_id = auth.uid())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consultation_requests_updated_at BEFORE UPDATE ON public.consultation_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors
INSERT INTO public.doctors (user_id, full_name, email, specialization, license_number, experience_years, phone, bio, available) VALUES
('11111111-1111-1111-1111-111111111111', 'Dr. Sarah Wilson', 'sarah.wilson@example.com', 'Cardiology', 'MD12345', 8, '+1-555-0101', 'Specialized in heart diseases and cardiovascular health.', true),
('22222222-2222-2222-2222-222222222222', 'Dr. Mike Chen', 'mike.chen@example.com', 'Dermatology', 'MD12346', 6, '+1-555-0102', 'Expert in skin conditions and cosmetic dermatology.', true),
('33333333-3333-3333-3333-333333333333', 'Dr. Emily Rodriguez', 'emily.rodriguez@example.com', 'Pediatrics', 'MD12347', 10, '+1-555-0103', 'Dedicated to children health and development.', true),
('44444444-4444-4444-4444-444444444444', 'Dr. James Thompson', 'james.thompson@example.com', 'Neurology', 'MD12348', 12, '+1-555-0104', 'Specialist in brain and nervous system disorders.', true),
('55555555-5555-5555-5555-555555555555', 'Dr. Lisa Park', 'lisa.park@example.com', 'Orthopedics', 'MD12349', 7, '+1-555-0105', 'Expert in bone, joint, and muscle conditions.', true);