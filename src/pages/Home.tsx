import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Video, 
  FileText, 
  AlertCircle,
  UserCheck,
  Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/telemedicine-hero.jpg";

const Home = () => {
  const features = [
    {
      icon: Video,
      title: "Video Consultations",
      description: "High-quality, secure video calls with certified doctors"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access healthcare professionals anytime, anywhere"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your medical data is protected with industry-leading security"
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Receive and manage prescriptions electronically"
    },
    {
      icon: AlertCircle,
      title: "Emergency Support",
      description: "Immediate connection to emergency services when needed"
    },
    {
      icon: Users,
      title: "Specialist Network",
      description: "Access to a wide network of medical specialists"
    }
  ];

  const userTypes = [
    {
      title: "For Patients",
      description: "Get quality healthcare from the comfort of your home",
      icon: Heart,
      features: [
        "Consult with doctors instantly",
        "View and manage prescriptions", 
        "Access health tips and resources",
        "Emergency SOS services",
        "Send consultation requests"
      ],
      buttonText: "Patient Portal",
      buttonVariant: "patient" as const,
      href: "/login/patient"
    },
    {
      title: "For Doctors",
      description: "Provide quality care to patients remotely",
      icon: Stethoscope,
      features: [
        "Manage patient requests",
        "Set appointment schedules",
        "Conduct video consultations",
        "Accept or decline requests",
        "Access patient medical history"
      ],
      buttonText: "Doctor Portal",
      buttonVariant: "doctor" as const,
      href: "/login/doctor"
    },
    {
      title: "Support Staff",
      description: "Help patients navigate the telemedicine platform",
      icon: UserCheck,
      features: [
        "Assist patients with platform usage",
        "Guide through registration process",
        "Technical support services",
        "Educational resources",
        "24/7 patient assistance"
      ],
      buttonText: "Staff Portal",
      buttonVariant: "secondary" as const,
      href: "/login/support"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Telemedicine
              <span className="block text-medical-orange">Healthcare Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with certified doctors, manage your health, and get quality medical care 
              from anywhere with our secure telemedicine platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/login/patient">Get Started as Patient</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/login/doctor">Join as Doctor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Portal
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access specialized features designed for patients, doctors, and support staff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-4">
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="text-base">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant={type.buttonVariant} className="w-full" asChild>
                    <Link to={type.href}>{type.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose TeleMed?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience healthcare reimagined with cutting-edge technology and professional care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto bg-gradient-secondary p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;