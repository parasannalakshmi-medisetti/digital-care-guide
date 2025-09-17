import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, 
  Video, 
  FileText, 
  AlertCircle,
  Send,
  BookOpen,
  Phone,
  Clock,
  Calendar,
  User,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DoctorList from "@/components/DoctorList";
import PrescriptionList from "@/components/PrescriptionList";

interface PatientProfile {
  full_name: string;
  emergency_contact: string;
}

interface ConsultationRequest {
  id: string;
  symptoms: string;
  consultation_type: string;
  status: string;
  created_at: string;
  doctor: {
    full_name: string;
    specialization: string;
  };
}

const PatientDashboard = () => {
  const { user, signOut } = useAuth();
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    if (user) {
      fetchPatientProfile();
      fetchConsultationRequests();
    }
  }, [user]);

  const fetchPatientProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('full_name, emergency_contact')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching patient profile:', error);
        toast({
          title: "Profile Error",
          description: "Unable to load your profile information. Please try refreshing the page.",
          variant: "destructive",
        });
      } else if (data) {
        setPatientProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchConsultationRequests = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (patientError) return;

      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          doctor:doctors(full_name, specialization)
        `)
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching consultation requests:', error);
      } else {
        setConsultationRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEmergencyCall = () => {
    if (patientProfile?.emergency_contact) {
      window.location.href = `tel:${patientProfile.emergency_contact}`;
    } else {
      toast({
        title: "Emergency Contact Not Set",
        description: "Please update your profile with an emergency contact number.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  const quickActions = [
    {
      icon: Video,
      title: "Consult Doctor",
      description: "Browse available doctors and send consultation requests",
      action: () => setShowDoctorList(true),
      variant: "default" as const
    },
    {
      icon: AlertCircle,
      title: "SOS Emergency Call",
      description: "Connect to your emergency contact",
      action: handleEmergencyCall,
      variant: "destructive" as const
    },
    {
      icon: FileText,
      title: "View Prescriptions",
      description: "Access your digital prescriptions and health tips",
      action: () => setShowPrescriptions(true),
      variant: "secondary" as const
    },
    {
      icon: BookOpen,
      title: "Health Tips",
      description: "Read personalized health advice",
      action: () => {},
      variant: "outline" as const
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  if (showPrescriptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPrescriptions(false)}
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Your Prescriptions</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <PrescriptionList />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Hello, {patientProfile?.full_name || user?.user_metadata?.full_name || 'Patient'}
              </h1>
              <p className="text-muted-foreground">
                Welcome to your patient dashboard. Manage your health and connect with doctors.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {quickActions.map((action, index) => (
            <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-secondary p-3 rounded-full w-fit mb-3">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant={action.variant} className="w-full" onClick={action.action}>
                  {action.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Consultation Requests */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <CardTitle>Recent Consultation Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultationRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No consultation requests yet</p>
                  <p className="text-sm">Click "Consult Doctor" to get started</p>
                </div>
              ) : (
                consultationRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{request.doctor.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{request.doctor.specialization}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {request.consultation_type}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Health Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Daily Wellness</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Drink at least 8 glasses of water daily to stay hydrated and maintain optimal health.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Exercise</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Aim for 30 minutes of moderate exercise daily to boost your immune system.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Sleep</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Get 7-9 hours of quality sleep each night for better physical and mental health.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Notice */}
        <Card className="mt-8 border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h4 className="font-medium text-destructive">Emergency Services</h4>
                <p className="text-sm text-muted-foreground">
                  For life-threatening emergencies, call 911 immediately or use the SOS Emergency Call feature above.
                  {patientProfile?.emergency_contact && (
                    <span className="block mt-1">
                      Your emergency contact: <strong>{patientProfile.emergency_contact}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor List Modal */}
      <Dialog open={showDoctorList} onOpenChange={setShowDoctorList}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Available Doctors</DialogTitle>
          </DialogHeader>
          <DoctorList onClose={() => setShowDoctorList(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;