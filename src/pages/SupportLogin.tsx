import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SupportLogin = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be connected to Supabase authentication later
    console.log("Support staff login:", formData);
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
            <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-4">
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Support Staff Login</CardTitle>
            <CardDescription>
              Access your support dashboard to assist patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="EMP001"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use your assigned employee ID to access the support portal
                </p>
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
                <Link to="/support/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" variant="secondary">
                Sign In to Support Portal
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need access to the support portal?{" "}
                <Link to="/contact" className="text-primary hover:underline font-medium">
                  Contact IT Support
                </Link>
              </p>
            </div>

            {/* Support Portal Info */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Support Portal Access:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Assist patients with platform navigation</li>
                <li>• Guide users through registration process</li>
                <li>• Provide technical support and troubleshooting</li>
                <li>• Access educational resources and FAQs</li>
                <li>• Escalate complex issues to appropriate teams</li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Security Notice:</strong> Support staff accounts are monitored for compliance. 
                Do not share login credentials and report any suspicious activity immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportLogin;