import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  CheckCircle, 
  XCircle,
  User,
  Stethoscope,
  Phone
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  bio?: string;
  experience_years: number;
}

interface TimeSlot {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  doctor: Doctor;
}

interface PatientBooking {
  id: string;
  doctor_name: string;
  specialization: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  appointment_type: string;
  notes?: string;
}

const PatientBookingView = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [myBookings, setMyBookings] = useState<PatientBooking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');
  const [patientId, setPatientId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPatientId();
    }
  }, [user]);

  useEffect(() => {
    if (patientId) {
      fetchAvailableSlots();
      fetchMyBookings();
    }
  }, [patientId, selectedDate]);

  const fetchPatientId = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setPatientId(data.id);
    } catch (error) {
      console.error('Error fetching patient ID:', error);
      toast({
        title: "Error",
        description: "Unable to fetch patient profile",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableSlots = async () => {
    if (!patientId) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('doctor_schedule')
        .select(`
          *
        `)
        .eq('status', 'available')
        .eq('date', dateStr)
        .order('start_time');

      if (error) throw error;

      // Fetch doctor information for each slot
      const enrichedSlots = await Promise.all((data || []).map(async (slot) => {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', slot.doctor_id)
          .single();
        
        return {
          ...slot,
          doctor: doctorData || {
            id: slot.doctor_id,
            full_name: 'Unknown Doctor',
            specialization: 'General Practice',
            experience_years: 0
          }
        };
      }));

      setAvailableSlots(enrichedSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast({
        title: "Error",
        description: "Unable to fetch available slots",
        variant: "destructive",
      });
    }
  };

  const fetchMyBookings = async () => {
    if (!patientId) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *
        `)
        .eq('patient_id', patientId)
        .gte('scheduled_date', format(new Date(), 'yyyy-MM-dd'))
        .order('scheduled_date')
        .order('scheduled_time');

      if (error) throw error;

      // Fetch doctor information for each appointment
      const enrichedBookings = await Promise.all((data || []).map(async (booking) => {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('full_name, specialization')
          .eq('id', booking.doctor_id)
          .single();
        
        return {
          ...booking,
          doctor_name: doctorData?.full_name || 'Unknown Doctor',
          specialization: doctorData?.specialization || 'General Practice'
        };
      }));

      setMyBookings(enrichedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot || !patientId) return;

    setLoading(true);
    try {
      // Create consultation request first
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultation_requests')
        .insert({
          doctor_id: selectedSlot.doctor_id,
          patient_id: patientId,
          symptoms: bookingNotes || 'Scheduled appointment',
          consultation_type: 'video',
          status: 'accepted',
          request_message: bookingNotes || 'Direct booking via schedule',
          scheduled_time: new Date(`${selectedSlot.date}T${selectedSlot.start_time}`).toISOString()
        })
        .select()
        .single();

      if (consultationError) throw consultationError;

      // Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          doctor_id: selectedSlot.doctor_id,
          patient_id: patientId,
          consultation_request_id: consultationData.id,
          scheduled_date: selectedSlot.date,
          scheduled_time: selectedSlot.start_time,
          appointment_type: 'video',
          status: 'confirmed',
          notes: bookingNotes
        });

      if (appointmentError) throw appointmentError;

      // Update the time slot to booked
      const { error: slotError } = await supabase
        .from('doctor_schedule')
        .update({ 
          status: 'booked',
          patient_id: patientId,
          consultation_request_id: consultationData.id
        })
        .eq('id', selectedSlot.id);

      if (slotError) throw slotError;

      toast({
        title: "Booking Confirmed!",
        description: `Your appointment with Dr. ${selectedSlot.doctor.full_name} has been booked successfully.`,
      });

      setShowBookingDialog(false);
      setSelectedSlot(null);
      setBookingNotes('');
      fetchAvailableSlots();
      fetchMyBookings();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Unable to book the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (appointmentId: string) => {
    try {
      // Update appointment status to cancelled
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (appointmentError) throw appointmentError;

      // Find and update the corresponding time slot back to available
      const { error: slotError } = await supabase
        .from('doctor_schedule')
        .update({ 
          status: 'available',
          patient_id: null,
          consultation_request_id: null
        })
        .eq('patient_id', patientId);

      if (slotError) throw slotError;

      toast({
        title: "Booking Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });

      fetchAvailableSlots();
      fetchMyBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Unable to cancel the booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <p className="text-muted-foreground">
            Select a date to view available doctors and book appointments
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("w-full p-3 pointer-events-auto")}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </CardContent>
        </Card>

        {/* Available Slots Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Available Doctors
            </CardTitle>
            <CardDescription>
              {format(selectedDate, 'MMMM d, yyyy')} - Click to book
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No available slots</p>
                  <p className="text-sm">Try selecting a different date</p>
                </div>
              ) : (
                availableSlots.map((slot) => (
                  <div key={slot.id} className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dr. {slot.doctor.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{slot.doctor.specialization}</p>
                        <p className="text-xs text-muted-foreground">
                          {slot.doctor.experience_years} years experience
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        🟢 Available
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>🕒 {slot.start_time} - {slot.end_time}</span>
                      <span>📹 Video Call</span>
                    </div>
                    
                    {slot.doctor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {slot.doctor.bio}
                      </p>
                    )}
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setShowBookingDialog(true);
                      }}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Book Appointment
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Bookings Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              My Bookings
            </CardTitle>
            <CardDescription>
              Your upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {myBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming bookings</p>
                  <p className="text-sm">Book an appointment to get started</p>
                </div>
              ) : (
                myBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dr. {booking.doctor_name}</h4>
                        <p className="text-sm text-muted-foreground">{booking.specialization}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📅 {format(new Date(booking.scheduled_date), 'MMM d, yyyy')}</p>
                      <p>🕒 {booking.scheduled_time}</p>
                      <p>📹 {booking.appointment_type}</p>
                    </div>
                    
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {booking.notes}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      {booking.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="default" className="flex-1">
                            <Video className="h-3 w-3 mr-1" />
                            Join Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment Booking</DialogTitle>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Dr. {selectedSlot.doctor.full_name}</h4>
                <p className="text-sm text-muted-foreground">{selectedSlot.doctor.specialization}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>📅 {format(new Date(selectedSlot.date), 'MMMM d, yyyy')}</span>
                  <span>🕒 {selectedSlot.start_time} - {selectedSlot.end_time}</span>
                </div>
                <p className="text-sm">📹 Video Consultation</p>
              </div>
              
              <div>
                <Label htmlFor="bookingNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="bookingNotes"
                  placeholder="Describe your symptoms or reason for consultation..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookSlot} disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientBookingView;