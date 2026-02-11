import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { setAuth } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call backend login endpoint
      const response = await api.post('/auth/login', { email, password }, { requiresAuth: false });

      // Backend returns { token, user: { id, email, role } }
      const { token, user } = response;

      // Save auth data to localStorage
      setAuth(token, user);

      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
      });

      // Redirect based on role
      const roleRoutes = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        admin: '/admin/dashboard',
      };

      navigate(roleRoutes[user.role as keyof typeof roleRoutes] || '/');
    } catch (error) {
      // Show backend error message
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
                <span className="text-lg font-bold text-primary-foreground">H</span>
              </div>
              <span className="text-xl font-semibold text-foreground">HealthVillage</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-group">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our{" "}
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

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">
            Your Health, Your Control
          </h2>
          <p className="text-lg opacity-90">
            Access your appointments, medical records, and healthcare team 
            from one secure platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
