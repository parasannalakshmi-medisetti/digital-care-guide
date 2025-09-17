-- Create doctor_schedule table for managing doctor availability
CREATE TABLE public.doctor_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked')),
  patient_id UUID NULL,
  consultation_request_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.doctor_schedule ENABLE ROW LEVEL SECURITY;

-- Create policies for doctor_schedule
CREATE POLICY "Doctors can manage their own schedule" 
ON public.doctor_schedule 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM doctors d 
  WHERE d.id = doctor_schedule.doctor_id 
  AND d.user_id = auth.uid()
));

CREATE POLICY "Patients can view available slots and their booked slots" 
ON public.doctor_schedule 
FOR SELECT
USING (
  status = 'available' OR 
  (patient_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM patients p 
    WHERE p.id = doctor_schedule.patient_id 
    AND p.user_id = auth.uid()
  ))
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_doctor_schedule_updated_at
BEFORE UPDATE ON public.doctor_schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create appointments table for confirmed bookings
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  consultation_request_id UUID NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'rescheduled')),
  appointment_type TEXT NOT NULL DEFAULT 'video' CHECK (appointment_type IN ('video', 'chat', 'phone')),
  notes TEXT,
  prescription_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Doctors can view their appointments" 
ON public.appointments 
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM doctors d 
  WHERE d.id = appointments.doctor_id 
  AND d.user_id = auth.uid()
));

CREATE POLICY "Patients can view their appointments" 
ON public.appointments 
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM patients p 
  WHERE p.id = appointments.patient_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Doctors can create and update their appointments" 
ON public.appointments 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM doctors d 
  WHERE d.id = appointments.doctor_id 
  AND d.user_id = auth.uid()
));

CREATE POLICY "Patients can update their own appointments" 
ON public.appointments 
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM patients p 
  WHERE p.id = appointments.patient_id 
  AND p.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_doctor_schedule_doctor_date ON public.doctor_schedule(doctor_id, date);
CREATE INDEX idx_doctor_schedule_status ON public.doctor_schedule(status);
CREATE INDEX idx_appointments_doctor_date ON public.appointments(doctor_id, scheduled_date);
CREATE INDEX idx_appointments_patient_date ON public.appointments(patient_id, scheduled_date);