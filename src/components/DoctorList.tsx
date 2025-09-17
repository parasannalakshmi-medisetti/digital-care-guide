import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Clock, Star, Send, Video, MessageCircle, ArrowLeft, Filter } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  experience_years: number;
  bio: string;
  available: boolean;
}

interface DoctorListProps {
  onClose: () => void;
  symptoms?: string;
  category?: string;
  onBack?: () => void;
}

const DoctorList = ({ onClose, symptoms: userSymptoms = "", category = "", onBack }: DoctorListProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [symptoms, setSymptoms] = useState(userSymptoms);
  const [consultationType, setConsultationType] = useState('video');
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (userSymptoms) {
      setSymptoms(userSymptoms);
    }
  }, [userSymptoms]);

  useEffect(() => {
    filterDoctorsByCategory();
  }, [doctors, category]);

  const filterDoctorsByCategory = () => {
    if (!category || category === "General Medicine") {
      setFilteredDoctors(doctors);
      return;
    }

    const categorySpecializations: { [key: string]: string[] } = {
      "Cardiology": ["Cardiology", "Cardiovascular Surgery", "Heart"],
      "Orthopedics": ["Orthopedics", "Sports Medicine", "Bone", "Joint"],
      "Dermatology": ["Dermatology", "Skin"],
      "Neurology": ["Neurology", "Neurosurgery", "Brain", "Nerve"],
      "Gastroenterology": ["Gastroenterology", "Digestive", "Stomach"],
      "Pediatrics": ["Pediatrics", "Child", "Children"],
      "Psychiatry": ["Psychiatry", "Mental Health", "Psychology"],
      "ENT": ["ENT", "Ear", "Nose", "Throat"],
      "Ophthalmology": ["Ophthalmology", "Eye", "Vision"],
      "Urology": ["Urology", "Kidney", "Bladder"]
    };

    const targetSpecs = categorySpecializations[category] || [category];
    
    const filtered = doctors.filter(doctor => 
      targetSpecs.some(spec => 
        doctor.specialization.toLowerCase().includes(spec.toLowerCase())
      )
    );

    // If no doctors found for specific category, show all doctors but prioritize relevant ones
    if (filtered.length === 0) {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(filtered);
    }
  };

  const fetchDoctors = async () => {
    // Only select essential columns, excluding sensitive data like email, phone, license_number
    const { data, error } = await supabase
      .from('doctors')
      .select('id, full_name, specialization, bio, experience_years, available, created_at')
      .eq('available', true)
      .order('full_name');

    if (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive",
      });
    } else {
      setDoctors(data || []);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedDoctor || !user || !symptoms) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First get the patient record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (patientError) {
        throw new Error('Patient profile not found');
      }

      // Create consultation request
      const { error: requestError } = await supabase
        .from('consultation_requests')
        .insert({
          patient_id: patientData.id,
          doctor_id: selectedDoctor.id,
          symptoms,
          consultation_type: consultationType,
          request_message: requestMessage,
        });

      if (requestError) {
        throw new Error('Failed to send consultation request');
      }

      toast({
        title: "Success",
        description: "Consultation request sent successfully!",
      });

      setShowRequestDialog(false);
      setSelectedDoctor(null);
      setSymptoms('');
      setRequestMessage('');
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header with back button and filtering info */}
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Symptoms
            </Button>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
              {category && ` for ${category}`}
            </span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">
                {category ? (
                  <>No doctors available for {category} at the moment.</>
                ) : (
                  <>No doctors are currently available.</>
                )}
              </p>
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Different Symptoms
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="shadow-medium hover:shadow-strong transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-3">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2">
                      <Badge variant="secondary">{doctor.specialization}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{doctor.experience_years} years experience</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
                    <Button 
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowRequestDialog(true);
                      }}
                      className="w-full"
                      variant="default"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Consultation Request</DialogTitle>
            <DialogDescription>
              Request a consultation with {selectedDoctor?.full_name} ({selectedDoctor?.specialization})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="symptoms">Symptoms/Health Concerns *</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms and health concerns..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Consultation Type</Label>
              <RadioGroup value={consultationType} onValueChange={setConsultationType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Call
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chat" id="chat" />
                  <Label htmlFor="chat" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Any additional information for the doctor..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendRequest} disabled={loading || !symptoms}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorList;