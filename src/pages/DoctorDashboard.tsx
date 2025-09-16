import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Phone
} from "lucide-react";

const DoctorDashboard = () => {
  // This would come from authentication context in real app
  const doctorName = "Sarah Wilson";

  const dashboardStats = [
    {
      title: "Pending Requests",
      value: "12",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Today's Consultations",
      value: "8",
      icon: Video,
      color: "text-blue-600"
    },
    {
      title: "Patients This Week",
      value: "45",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Available Slots",
      value: "6",
      icon: Calendar,
      color: "text-purple-600"
    }
  ];

  const pendingRequests = [
    {
      patient: "John Smith",
      age: 34,
      condition: "Chest pain consultation",
      urgency: "Medium",
      requestTime: "30 min ago",
      preferredTime: "Today 3:00 PM"
    },
    {
      patient: "Emily Johnson",
      age: 28,
      condition: "Skin rash examination",
      urgency: "Low",
      requestTime: "1 hour ago",
      preferredTime: "Tomorrow 10:00 AM"
    },
    {
      patient: "Michael Brown",
      age: 52,
      condition: "Follow-up diabetes check",
      urgency: "High",
      requestTime: "2 hours ago",
      preferredTime: "Today 2:00 PM"
    }
  ];

  const todaySchedule = [
    {
      time: "9:00 AM",
      patient: "Lisa Davis",
      type: "Video Consultation",
      status: "completed"
    },
    {
      time: "10:30 AM",
      patient: "Robert Wilson",
      type: "Follow-up",
      status: "completed"
    },
    {
      time: "2:00 PM",
      patient: "Maria Garcia",
      type: "Initial Consultation",
      status: "upcoming"
    },
    {
      time: "3:30 PM",
      patient: "Available Slot",
      type: "Open",
      status: "available"
    }
  ];

  const quickActions = [
    {
      icon: Users,
      title: "View Pending Requests",
      description: "Review and respond to patient requests",
      variant: "doctor" as const
    },
    {
      icon: Calendar,
      title: "Manage Schedule",
      description: "Set availability and time slots",
      variant: "secondary" as const
    },
    {
      icon: Video,
      title: "Start Video Call",
      description: "Begin consultation with patient",
      variant: "medical" as const
    },
    {
      icon: Settings,
      title: "Consultation Settings",
      description: "Configure your practice preferences",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-secondary p-2 rounded-full">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Hello, Dr. {doctorName}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Welcome to your doctor dashboard. Manage your practice and connect with patients.
          </p>
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
                <Button variant={action.variant} size="sm" className="w-full">
                  {action.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Patient Requests */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pending Patient Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.map((request, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{request.patient}</h4>
                      <p className="text-sm text-muted-foreground">Age: {request.age}</p>
                    </div>
                    <Badge 
                      variant={request.urgency === 'High' ? 'destructive' : request.urgency === 'Medium' ? 'default' : 'secondary'}
                    >
                      {request.urgency}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{request.condition}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Requested: {request.requestTime}</span>
                    <span>Preferred: {request.preferredTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="medical" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Requests
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    <h4 className="text-sm">{appointment.patient}</h4>
                    <p className="text-xs text-muted-foreground">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        appointment.status === 'completed' ? 'default' : 
                        appointment.status === 'upcoming' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {appointment.status}
                    </Badge>
                    {appointment.status === 'upcoming' && (
                      <Button size="sm" variant="medical" className="mt-2">
                        <Video className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Manage Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

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
    </div>
  );
};

export default DoctorDashboard;