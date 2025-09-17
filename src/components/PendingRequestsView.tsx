import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User, 
  Phone,
  Video,
  MessageCircle,
  ArrowLeft,
  Filter
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface PendingRequest {
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
    email: string;
    phone: string;
  };
}

interface PendingRequestsViewProps {
  onClose: () => void;
  doctorId: string;
}

const PendingRequestsView = ({ onClose, doctorId }: PendingRequestsViewProps) => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PendingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [responseMessage, setResponseMessage] = useState('');
  const [prescriptionData, setPrescriptionData] = useState({
    medications: '',
    dosageInstructions: '',
    healthTips: '',
    followUpDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, [doctorId]);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          patient:patients(full_name, emergency_contact, email, phone)
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: "Error",
          description: "Failed to load consultation requests.",
          variant: "destructive",
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filterRequests = () => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === statusFilter));
    }
  };

  const handleAcceptRequest = async (request: PendingRequest) => {
    setSelectedRequest(request);
    const consultationType = request.consultation_type === 'video' ? 'video call' : 'chat';
    setResponseMessage(`Your consultation request has been accepted! I'm ready to provide a ${consultationType} consultation. Please be available at your preferred time. For video calls, ensure you have a stable internet connection and a working camera/microphone.`);
    setShowResponseDialog(true);
  };

  const handleDeclineRequest = async (request: PendingRequest) => {
    setSelectedRequest(request);
    setResponseMessage('Thank you for your consultation request. Unfortunately, I am not available at your preferred time. Please consider rescheduling or consulting another doctor.');
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
      fetchRequests();
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
    if (!selectedRequest) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          consultation_request_id: selectedRequest.id,
          patient_id: selectedRequest.patient_id,
          doctor_id: doctorId,
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
      fetchRequests();
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

  const getUrgencyVariant = (symptoms: string) => {
    const urgentKeywords = ['chest pain', 'breathing', 'emergency', 'severe', 'urgent', 'blood', 'unconscious'];
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

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Consultation Requests</h2>
              <p className="text-muted-foreground">
                {pendingCount} pending request{pendingCount !== 1 ? 's' : ''} awaiting your response
              </p>
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm bg-background"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending Only</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No requests found</h3>
                <p className="text-muted-foreground">
                  {statusFilter === 'all' 
                    ? "You haven't received any consultation requests yet."
                    : `No ${statusFilter} requests at the moment.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="shadow-medium">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-primary p-2 rounded-full">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{request.patient.full_name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {request.patient.emergency_contact}
                          </span>
                          <span className="flex items-center gap-1">
                            {request.consultation_type === 'video' ? 
                              <Video className="h-3 w-3" /> : 
                              <MessageCircle className="h-3 w-3" />
                            }
                            {request.consultation_type}
                          </span>
                        </div>
                      </div>
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
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Patient Symptoms:</h4>
                    <p className="text-sm">{request.symptoms}</p>
                  </div>
                  
                  {request.request_message && (
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Additional Message:</h4>
                      <p className="text-sm">{request.request_message}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Requested: {new Date(request.created_at).toLocaleString()}
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
                </CardContent>
              </Card>
            ))
          )}
        </div>
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
    </>
  );
};

export default PendingRequestsView;