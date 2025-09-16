import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be connected to Supabase authentication later
    console.log("Doctor login:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <Card className="shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-secondary p-3 rounded-full w-fit mb-4">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Doctor Login</CardTitle>
            <CardDescription>
              Access your medical practice portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: !!checked })}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" variant="doctor">
                Sign In to Doctor Portal
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New to our platform?{" "}
                <Link to="/register/doctor" className="text-primary hover:underline font-medium">
                  Apply to join
                </Link>
              </p>
            </div>

            {/* Quick Access Info */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Doctor Portal Features:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• View and manage patient requests</li>
                <li>• Set appointment schedules and availability</li>
                <li>• Conduct secure video consultations</li>
                <li>• Accept or decline consultation requests</li>
                <li>• Access patient medical histories</li>
                <li>• Issue digital prescriptions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorLogin;