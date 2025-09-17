import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Video,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Settings,
  User,
  Phone,
  LogOut,
  Send
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DoctorProfile {
  id: string;
  full_name: string;
  specialization: string;
}

interface ConsultationRequest {
  id: string;
  patient_id: string;
  symptoms: string;
  consultation_type: string;
  status: string;
  created_at: string;
  request_message: string;
  patient: {
    full_name: string;
    emergency_contact: string;
  };
}

const DoctorDashboard = () => {
  const { user, signOut } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: '',
    dosageInstructions: '',
    healthTips: '',
    followUpDate: '',
    notes: ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDoctorProfile();
      fetchConsultationRequests();
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching doctor profile:', error);
      } else {
        setDoctorProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchConsultationRequests = async () => {
    try {
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (doctorError) return;

      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          patient:patients(full_name, emergency_contact)
        `)
        .eq('doctor_id', doctorData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching consultation requests:', error);
      } else {
        setConsultationRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAcceptRequest = async (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setResponseMessage(`Your consultation request has been accepted. I'll be ready for a ${request.consultation_type} consultation. Please be available at your preferred time.`);
    setShowResponseDialog(true);
  };

  const handleDeclineRequest = async (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setResponseMessage('Thank you for your consultation request. Unfortunately, I am not available at your preferred time. Please consider rescheduling.');
    setShowResponseDialog(true);
  };

  const handleSendResponse = async (accept: boolean) => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({
          status: accept ? 'accepted' : 'rejected',
          doctor_response: responseMessage
        })
        .eq('id', selectedRequest.id);

      if (error) {
        throw new Error('Failed to update consultation request');
      }

      toast({
        title: "Response Sent",
        description: `Consultation request ${accept ? 'accepted' : 'declined'} successfully.`,
      });

      setShowResponseDialog(false);
      setSelectedRequest(null);
      setResponseMessage('');
      fetchConsultationRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async () => {
    if (!selectedRequest || !doctorProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          consultation_request_id: selectedRequest.id,
          patient_id: selectedRequest.patient_id,
          doctor_id: doctorProfile.id,
          medications: prescriptionData.medications,
          dosage_instructions: prescriptionData.dosageInstructions,
          health_tips: prescriptionData.healthTips,
          follow_up_date: prescriptionData.followUpDate || null,
          notes: prescriptionData.notes
        });

      if (error) {
        throw new Error('Failed to create prescription');
      }

      // Update consultation status to completed
      await supabase
        .from('consultation_requests')
        .update({ status: 'completed' })
        .eq('id', selectedRequest.id);

      toast({
        title: "Prescription Created",
        description: "Prescription has been sent to the patient successfully.",
      });

      setShowPrescriptionDialog(false);
      setSelectedRequest(null);
      setPrescriptionData({
        medications: '',
        dosageInstructions: '',
        healthTips: '',
        followUpDate: '',
        notes: ''
      });
      fetchConsultationRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create prescription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  const dashboardStats = [
    {
      title: "Pending Requests",
      value: consultationRequests.filter(r => r.status === 'pending').length.toString(),
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Accepted Today",
      value: consultationRequests.filter(r => r.status === 'accepted' && 
        new Date(r.created_at).toDateString() === new Date().toDateString()).length.toString(),
      icon: Video,
      color: "text-blue-600"
    },
    {
      title: "Total Requests",
      value: consultationRequests.length.toString(),
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Completed",
      value: consultationRequests.filter(r => r.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  const quickActions = [
    {
      icon: Users,
      title: "View Pending Requests",
      description: "Review and respond to patient requests",
      variant: "default" as const,
      action: () => {}
    },
    {
      icon: Calendar,
      title: "Manage Schedule",
      description: "Set availability and time slots",
      variant: "secondary" as const,
      action: () => {}
    },
    {
      icon: Video,
      title: "Start Video Call",
      description: "Begin consultation with patient",
      variant: "outline" as const,
      action: () => {}
    },
    {
      icon: Settings,
      title: "Consultation Settings",
      description: "Configure your practice preferences",
      variant: "outline" as const,
      action: () => {}
    }
  ];

  const getUrgencyVariant = (symptoms: string) => {
    const urgentKeywords = ['chest pain', 'breathing', 'emergency', 'severe', 'urgent'];
    const isUrgent = urgentKeywords.some(keyword => 
      symptoms.toLowerCase().includes(keyword)
    );
    return isUrgent ? 'destructive' : 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-secondary p-2 rounded-full">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Hello, {doctorProfile?.full_name || 'Doctor'}
              </h1>
              <p className="text-muted-foreground">
                {doctorProfile?.specialization} • Manage your practice and connect with patients.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-3">
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm">{action.title}</CardTitle>
                <CardDescription className="text-xs">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant={action.variant} size="sm" className="w-full" onClick={action.action}>
                  {action.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consultation Requests */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Consultation Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultationRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No consultation requests yet</p>
              </div>
            ) : (
              consultationRequests.map((request) => (
                <div key={request.id} className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{request.patient.full_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Emergency Contact: {request.patient.emergency_contact}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getUrgencyVariant(request.symptoms)}>
                        {getUrgencyVariant(request.symptoms) === 'destructive' ? 'Urgent' : 'Normal'}
                      </Badge>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm"><strong>Symptoms:</strong> {request.symptoms}</p>
                    <p className="text-sm"><strong>Type:</strong> {request.consultation_type}</p>
                    {request.request_message && (
                      <p className="text-sm"><strong>Message:</strong> {request.request_message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Requested: {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="flex-1"
                          onClick={() => handleAcceptRequest(request)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleDeclineRequest(request)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'accepted' && (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowPrescriptionDialog(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Create Prescription
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Professional Notice */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-primary">Professional Practice</h4>
                <p className="text-sm text-muted-foreground">
                  All consultations are recorded for quality assurance and legal compliance. 
                  Patient data is protected under HIPAA regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Response to Patient</DialogTitle>
            <DialogDescription>
              Patient: {selectedRequest?.patient.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="response">Response Message</Label>
              <Textarea
                id="response"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Enter your response message..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleSendResponse(responseMessage.includes('accepted'))}
              disabled={loading || !responseMessage}
            >
              {loading ? "Sending..." : "Send Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prescription Dialog */}
      <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Prescription</DialogTitle>
            <DialogDescription>
              Patient: {selectedRequest?.patient.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="medications">Medications *</Label>
              <Textarea
                id="medications"
                value={prescriptionData.medications}
                onChange={(e) => setPrescriptionData({...prescriptionData, medications: e.target.value})}
                placeholder="List all prescribed medications..."
                required
              />
            </div>

            <div>
              <Label htmlFor="dosage">Dosage Instructions *</Label>
              <Textarea
                id="dosage"
                value={prescriptionData.dosageInstructions}
                onChange={(e) => setPrescriptionData({...prescriptionData, dosageInstructions: e.target.value})}
                placeholder="Detailed dosage instructions..."
                required
              />
            </div>

            <div>
              <Label htmlFor="healthTips">Health Tips</Label>
              <Textarea
                id="healthTips"
                value={prescriptionData.healthTips}
                onChange={(e) => setPrescriptionData({...prescriptionData, healthTips: e.target.value})}
                placeholder="Health tips related to patient's symptoms..."
              />
            </div>

            <div>
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={prescriptionData.followUpDate}
                onChange={(e) => setPrescriptionData({...prescriptionData, followUpDate: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={prescriptionData.notes}
                onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                placeholder="Any additional notes for the patient..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrescriptionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePrescription}
              disabled={loading || !prescriptionData.medications || !prescriptionData.dosageInstructions}
            >
              {loading ? "Creating..." : "Create Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;