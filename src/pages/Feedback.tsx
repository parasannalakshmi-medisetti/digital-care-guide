import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MessageSquare, ThumbsUp, Award, Users } from "lucide-react";
import { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      feedback: "TeleMed has been a lifesaver! I was able to consult with a doctor from home when my child was sick. The platform is easy to use and the doctors are very professional.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      feedback: "As a doctor, I appreciate how streamlined TeleMed makes patient consultations. The scheduling system is efficient and the video quality is excellent for remote examinations.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Patient",
      feedback: "The prescription management feature is fantastic. I can easily view and track all my medications in one place. Highly recommend TeleMed to anyone seeking convenient healthcare.",
      rating: 4
    }
  ];

  const renderStars = (count: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          index < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoveredRating(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
      />
    ));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">Your Feedback Matters</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us improve TeleMed by sharing your experience. Your input helps us provide better healthcare for everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Submit Your Feedback</span>
                </CardTitle>
                <CardDescription>
                  Whether it's a compliment, suggestion, or issue - we want to hear from you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedbackName">Name</Label>
                    <Input id="feedbackName" placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedbackEmail">Email</Label>
                    <Input id="feedbackEmail" type="email" placeholder="your.email@example.com" />
                  </div>
                </div>

                {/* User Type */}
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup defaultValue="patient" className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="patient" id="patient" />
                      <Label htmlFor="patient">Patient</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="doctor" id="doctor" />
                      <Label htmlFor="doctor">Doctor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="support" id="support" />
                      <Label htmlFor="support">Support Staff</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Overall Rating */}
                <div className="space-y-3">
                  <Label>Overall Rating</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderStars(hoveredRating || rating, true)}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {rating > 0 && `${rating} out of 5 stars`}
                    </span>
                  </div>
                </div>

                {/* Feedback Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Feedback Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliment">Compliment</SelectItem>
                      <SelectItem value="suggestion">Suggestion for Improvement</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Concern</SelectItem>
                      <SelectItem value="doctor">Doctor Experience</SelectItem>
                      <SelectItem value="platform">Platform Usability</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Features */}
                <div className="space-y-3">
                  <Label>Which features are you providing feedback about? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Video Consultations",
                      "Appointment Scheduling",
                      "Prescription Management", 
                      "Emergency Services",
                      "Mobile App",
                      "Doctor Portal",
                      "Payment System",
                      "Customer Support"
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox id={feature.toLowerCase().replace(/\s+/g, '-')} />
                        <Label htmlFor={feature.toLowerCase().replace(/\s+/g, '-')} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="space-y-2">
                  <Label htmlFor="detailedFeedback">Detailed Feedback</Label>
                  <Textarea 
                    id="detailedFeedback" 
                    placeholder="Please share your detailed feedback, suggestions, or describe any issues you've experienced..."
                    className="min-h-[150px]"
                  />
                </div>

                {/* Anonymity Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="anonymous" />
                  <Label htmlFor="anonymous" className="text-sm">
                    Submit this feedback anonymously
                  </Label>
                </div>

                {/* Follow-up Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="followup" />
                  <Label htmlFor="followup" className="text-sm">
                    I would like someone to follow up with me about this feedback
                  </Label>
                </div>

                <Button className="w-full" variant="medical">
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Our Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.8/5</div>
                  <div className="flex justify-center space-x-1 mb-1">
                    {renderStars(5)}
                  </div>
                  <p className="text-sm text-muted-foreground">Average rating from 2,847 reviews</p>
                </div>
                <hr />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Patient Satisfaction</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Doctor Recommendation</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Reliability</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Testimonials */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>What Others Say</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="flex space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">"{testimonial.feedback}"</p>
                    {index < testimonials.length - 1 && <hr />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feedback Guidelines */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5" />
                  <span>Feedback Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about your experience</li>
                  <li>• Include relevant dates and details</li>
                  <li>• Mention any staff members who helped you</li>
                  <li>• Suggest concrete improvements</li>
                  <li>• Rate honestly - your opinion matters</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;