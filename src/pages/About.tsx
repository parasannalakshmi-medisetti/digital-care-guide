import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Users, Globe, Shield, Heart, Zap } from "lucide-react";

const About = () => {
  const stats = [
    { number: "10,000+", label: "Active Patients", icon: Users },
    { number: "500+", label: "Certified Doctors", icon: Award },
    { number: "50+", label: "Countries Served", icon: Globe },
    { number: "99.9%", label: "Uptime Reliability", icon: Zap }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make prioritizes patient well-being and accessibility to quality healthcare."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "We maintain the highest standards of data protection and HIPAA compliance for all medical information."
    },
    {
      icon: Award,
      title: "Medical Excellence",
      description: "Our platform connects patients with board-certified physicians and medical specialists."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Breaking down geographical barriers to provide healthcare access to underserved communities."
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">About TeleMed</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            We're revolutionizing healthcare delivery through innovative telemedicine technology, 
            making quality medical care accessible, affordable, and convenient for everyone.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16 shadow-medium">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              To democratize healthcare by providing secure, professional, and accessible telemedicine 
              services that connect patients with qualified healthcare providers, regardless of location 
              or circumstances. We believe everyone deserves quality medical care.
            </p>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-soft">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-muted-foreground mb-4">
                Founded in 2020 during the global pandemic, TeleMed emerged from the urgent need to 
                provide safe, remote healthcare services. Our team of healthcare professionals, 
                technologists, and patient advocates came together with a shared vision.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as an emergency solution has evolved into a comprehensive telemedicine 
                platform that serves patients and healthcare providers worldwide. We've learned that 
                remote care isn't just a temporary solution—it's the future of healthcare.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to innovate and expand our services, always keeping patient care 
                and provider efficiency at the center of everything we do.
              </p>
            </div>
            <Card className="shadow-medium">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Key Milestones</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm text-muted-foreground">2020: Platform launched during COVID-19</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm text-muted-foreground">2021: 1,000+ doctors joined our network</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm text-muted-foreground">2022: International expansion began</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm text-muted-foreground">2023: HIPAA compliance certification</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm text-muted-foreground">2024: 10,000+ active patients milestone</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-4">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <Card className="shadow-medium">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Team</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
              TeleMed is powered by a diverse team of healthcare professionals, software engineers, 
              patient advocates, and support specialists who are passionate about improving healthcare 
              access through technology.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Medical Advisory Board</h3>
                <p className="text-sm text-muted-foreground">
                  Board-certified physicians and specialists who guide our clinical protocols and ensure 
                  the highest standards of medical care.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Technology Team</h3>
                <p className="text-sm text-muted-foreground">
                  Experienced engineers and designers who build and maintain our secure, user-friendly 
                  telemedicine platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Patient Support</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support specialists who help patients navigate the platform and ensure 
                  a smooth healthcare experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;