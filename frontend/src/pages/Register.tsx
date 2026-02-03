import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api, { healthCheck } from "@/lib/api";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ============================================
    // FRONTEND VALIDATION
    // ============================================

    // Validate firstName
    if (!formData.firstName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "First name is required",
      });
      return;
    }

    // Validate lastName
    if (!formData.lastName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Last name is required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please enter a valid email address",
      });
      return;
    }

    // Validate password length
    if (!formData.password || formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Password must be at least 8 characters",
      });
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check backend connectivity before submitting
      console.log('🔍 Checking backend connectivity...');
      const isBackendOnline = await healthCheck();
      
      if (!isBackendOnline) {
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Cannot connect to backend server. Please try again later.",
        });
        setIsLoading(false);
        return;
      }

      // Combine firstName and lastName into full name
      const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      // Use selected role or default to 'patient'
      const role = formData.role || 'patient';

      // Send registration request to backend
      await api.post(
        '/auth/register',
        {
          name,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role,
        },
        { requiresAuth: false }
      );

      // Show success message
      toast({
        title: "Success!",
        description: "Your account has been created. Redirecting to login...",
      });

      // Redirect to login page after brief delay
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      // Extract error message from backend
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration";

      console.error('Registration error:', errorMessage);

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join HealthVillage Today
          </h2>
          <p className="text-lg opacity-90">
            Create your account and start managing your healthcare journey 
            with ease and confidence.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
                <span className="text-lg font-bold text-primary-foreground">H</span>
              </div>
              <span className="text-xl font-semibold text-foreground">HealthVillage</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="h-11"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="h-11"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="input-group">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <Label htmlFor="role">I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Healthcare Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="input-group">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="h-11"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters with a number and symbol
              </p>
            </div>

            <div className="input-group">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="h-11"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="/terms-of-service" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
