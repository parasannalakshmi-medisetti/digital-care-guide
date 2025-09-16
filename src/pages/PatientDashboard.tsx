import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  User
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  // This would come from authentication context in real app
  const patientName = "John Smith";

  const quickActions = [
    {
      icon: Video,
      title: "Consult Doctor",
      description: "Start an instant video consultation",
      action: "consult",
      variant: "medical" as const
    },
    {
      icon: FileText,
      title: "View Prescriptions",
      description: "Access your digital prescriptions",
      action: "prescriptions",
      variant: "secondary" as const
    },
    {
      icon: BookOpen,
      title: "Health Tips",
      description: "Read personalized health advice",
      action: "tips",
      variant: "outline" as const
    },
    {
      icon: AlertCircle,
      title: "SOS Emergency Call",
      description: "Connect to nearby ambulance",
      action: "emergency",
      variant: "destructive" as const
    },
    {
      icon: Send,
      title: "Send Consultation Request",
      description: "Request appointment with specialist",
      action: "request",
      variant: "patient" as const
    }
  ];

  const recentActivity = [
    {
      type: "appointment",
      title: "Video consultation with Dr. Sarah Wilson",
      time: "2 hours ago",
      status: "completed"
    },
    {
      type: "prescription",
      title: "New prescription received",
      time: "1 day ago",
      status: "new"
    },
    {
      type: "request",
      title: "Consultation request sent to Dr. Mike Chen",
      time: "2 days ago",
      status: "pending"
    }
  ];

  const upcomingAppointments = [
    {
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiology",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Follow-up"
    },
    {
      doctor: "Dr. Mike Chen",
      specialty: "Dermatology", 
      date: "Friday",
      time: "10:30 AM",
      type: "Consultation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-primary p-2 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Hello, {patientName}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Welcome to your patient dashboard. Manage your health and connect with doctors.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-gradient-secondary p-3 rounded-full w-fit mb-3">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant={action.variant} className="w-full">
                  {action.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Upcoming Appointments</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{appointment.doctor}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{appointment.type}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {activity.type === 'appointment' && <Video className="h-4 w-4 text-primary" />}
                    {activity.type === 'prescription' && <FileText className="h-4 w-4 text-primary" />}
                    {activity.type === 'request' && <Send className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : activity.status === 'new' ? 'secondary' : 'outline'}
                      className="mt-1"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;