import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Video,
  Ban,
  Play
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'available' | 'booked' | 'blocked';
  patient_id?: string;
  patient_name?: string;
  consultation_request_id?: string;
  notes?: string;
}

interface Appointment {
  id: string;
  patient_name: string;
  scheduled_date: string;
  scheduled_time: string;
  appointment_type: string;
  status: string;
  notes?: string;
}

const DoctorScheduleManager = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [doctorId, setDoctorId] = useState<string>("");
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDoctorId();
    }
  }, [user]);

  useEffect(() => {
    if (doctorId && selectedDate) {
      fetchTimeSlots();
      fetchUpcomingAppointments();
    }
  }, [doctorId, selectedDate]);

  const fetchDoctorId = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setDoctorId(data.id);
    } catch (error) {
      console.error('Error fetching doctor ID:', error);
      toast({
        title: "Error",
        description: "Unable to fetch doctor profile",
        variant: "destructive",
      });
    }
  };

  const fetchTimeSlots = async () => {
    if (!doctorId) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('doctor_schedule')
        .select(`
          *
        `)
        .eq('doctor_id', doctorId)
        .eq('date', dateStr)
        .order('start_time');

      if (error) throw error;

      // Fetch patient names for booked slots
      const enrichedSlots = await Promise.all((data || []).map(async (slot) => {
        if (slot.patient_id) {
          const { data: patientData } = await supabase
            .from('patients')
            .select('full_name')
            .eq('id', slot.patient_id)
            .single();
          
          return {
            ...slot,
            status: slot.status as 'available' | 'booked' | 'blocked',
            patient_name: patientData?.full_name
          };
        }
        return {
          ...slot,
          status: slot.status as 'available' | 'booked' | 'blocked'
        };
      }));

      setTimeSlots(enrichedSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast({
        title: "Error",
        description: "Unable to fetch schedule",
        variant: "destructive",
      });
    }
  };

  const fetchUpcomingAppointments = async () => {
    if (!doctorId) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *
        `)
        .eq('doctor_id', doctorId)
        .gte('scheduled_date', format(new Date(), 'yyyy-MM-dd'))
        .order('scheduled_date')
        .order('scheduled_time')
        .limit(10);

      if (error) throw error;

      // Fetch patient names for appointments
      const enrichedAppointments = await Promise.all((data || []).map(async (appointment) => {
        const { data: patientData } = await supabase
          .from('patients')
          .select('full_name')
          .eq('id', appointment.patient_id)
          .single();
        
        return {
          ...appointment,
          patient_name: patientData?.full_name || 'Unknown Patient'
        };
      }));

      setAppointments(enrichedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAddTimeSlot = async () => {
    if (!doctorId || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('doctor_schedule')
        .insert({
          doctor_id: doctorId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: newSlot.startTime,
          end_time: newSlot.endTime,
          status: 'available',
          notes: newSlot.notes
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Time slot added successfully",
      });

      setShowAddSlotDialog(false);
      setNewSlot({ startTime: '', endTime: '', notes: '' });
      fetchTimeSlots();
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast({
        title: "Error",
        description: "Unable to add time slot",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('doctor_schedule')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      });

      fetchTimeSlots();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast({
        title: "Error",
        description: "Unable to delete time slot",
        variant: "destructive",
      });
    }
  };

  const handleToggleSlotStatus = async (slotId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'blocked' : 'available';
    
    try {
      const { error } = await supabase
        .from('doctor_schedule')
        .update({ status: newStatus })
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Slot ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      });

      fetchTimeSlots();
    } catch (error) {
      console.error('Error updating slot status:', error);
      toast({
        title: "Error",
        description: "Unable to update slot status",
        variant: "destructive",
      });
    }
  };

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'booked': return 'bg-red-100 text-red-800 border-red-200';
      case 'blocked': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSlotIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'booked': return <Video className="h-4 w-4" />;
      case 'blocked': return <Ban className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Schedule</h2>
          <p className="text-muted-foreground">
            Manage your availability and view upcoming appointments
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
            <div className="mt-4 space-y-2">
              <Button 
                onClick={() => setShowAddSlotDialog(true)}
                className="w-full"
                disabled={!selectedDate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              Manage your availability for the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {timeSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No time slots for this date</p>
                  <p className="text-sm">Click "Add Time Slot" to get started</p>
                </div>
              ) : (
                timeSlots.map((slot) => (
                  <div key={slot.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSlotIcon(slot.status)}
                        <span className="font-medium">
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>
                      <Badge className={getSlotStatusColor(slot.status)}>
                        {slot.status}
                      </Badge>
                    </div>
                    
                    {slot.patient_name && (
                      <p className="text-sm text-muted-foreground">
                        Patient: {slot.patient_name}
                      </p>
                    )}
                    
                    {slot.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {slot.notes}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      {slot.status !== 'booked' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleSlotStatus(slot.id, slot.status)}
                        >
                          {slot.status === 'available' ? (
                            <>
                              <Ban className="h-3 w-3 mr-1" />
                              Block
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Unblock
                            </>
                          )}
                        </Button>
                      )}
                      
                      {slot.status === 'booked' && (
                        <Button size="sm" variant="default">
                          <Play className="h-3 w-3 mr-1" />
                          Start Consultation
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                        disabled={slot.status === 'booked'}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Your confirmed appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{appointment.patient_name}</span>
                      <Badge variant="default">{appointment.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>📅 {format(new Date(appointment.scheduled_date), 'MMM d, yyyy')}</p>
                      <p>🕒 {appointment.scheduled_time}</p>
                      <p>📹 {appointment.appointment_type}</p>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {appointment.notes}
                      </p>
                    )}
                    <Button size="sm" className="w-full">
                      <Play className="h-3 w-3 mr-1" />
                      Start Consultation
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Date: {format(selectedDate, 'MMMM d, yyyy')}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this time slot..."
                value={newSlot.notes}
                onChange={(e) => setNewSlot({ ...newSlot, notes: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSlotDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot} disabled={loading}>
              {loading ? "Adding..." : "Add Time Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorScheduleManager;