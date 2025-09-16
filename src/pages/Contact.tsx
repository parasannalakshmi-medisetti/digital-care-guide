import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, AlertCircle, MessageSquare, HelpCircle } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "24/7 medical emergency support",
      contact: "+1-800-EMERGENCY",
      availability: "Available 24/7"
    },
    {
      icon: Phone,
      title: "General Support",
      description: "Platform help and general inquiries",
      contact: "+1-800-TELEMED",
      availability: "Mon-Fri: 8AM-8PM EST"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Non-urgent questions and feedback",
      contact: "support@telemed.com",
      availability: "Response within 24 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant chat with support team",
      contact: "Available in patient portal",
      availability: "Mon-Fri: 9AM-6PM EST"
    }
  ];

  const faqs = [
    {
      question: "How do I schedule an appointment?",
      answer: "Log into your patient portal and click 'Consult Doctor' to send a consultation request to available doctors."
    },
    {
      question: "What if I have a medical emergency?",
      answer: "For medical emergencies, call 911 immediately or use our SOS Emergency Call feature in the patient portal."
    },
    {
      question: "How secure is my medical information?",
      answer: "We are fully HIPAA compliant and use industry-leading encryption to protect all medical data and communications."
    },
    {
      question: "Can I get prescriptions through TeleMed?",
      answer: "Yes, doctors can prescribe medications during consultations, and you can view and manage prescriptions in your portal."
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to help. Reach out to us for support, questions, or emergency assistance.
          </p>
        </div>

        {/* Emergency Alert */}
        <Card className="mb-12 border-destructive shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Medical Emergency?</h3>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing a medical emergency, call 911 immediately or go to your nearest emergency room. 
                  TeleMed is not for emergency situations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userType">I am a...</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="support">Support Staff</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="medical">Medical Inquiry</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your question or concern in detail..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full" variant="medical">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-primary p-2 rounded-lg">
                          <method.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                          <p className="text-sm font-medium text-primary">{method.contact}</p>
                          <p className="text-xs text-muted-foreground">{method.availability}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Office Information */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Office Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-muted-foreground">
                  TeleMed Headquarters<br />
                  123 Healthcare Avenue<br />
                  Medical District<br />
                  San Francisco, CA 94102<br />
                  United States
                </address>
                <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Office Hours: Monday - Friday, 8:00 AM - 6:00 PM PST</span>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-foreground mb-1">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    {index < faqs.length - 1 && <hr className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;