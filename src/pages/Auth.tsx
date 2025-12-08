import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn, signUp } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Invalid email or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        }
      } else {
        if (password.length < 6) {
          toast({
            title: "Signup Failed",
            description: "Password must be at least 6 characters",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          let errorMessage = error.message;
          if (error.message.includes("already registered")) {
            errorMessage = "This email is already registered. Please login instead.";
          }
          toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Successful",
            description: "Welcome to FedSecure AI!",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-30"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-accent rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: "3s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>
      
      <Card className="w-full max-w-md relative z-10 glass-strong border-gradient shadow-2xl glow-primary">
        <div className="p-8">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
              <Shield className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-primary blur-xl opacity-50"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2 animate-gradient">
              FedSecure AI
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Welcome back! Please login to continue" : "Create your account to get started"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-lg">
            <Button
              type="button"
              variant={isLogin ? "default" : "ghost"}
              className={`flex-1 transition-all duration-300 ${
                isLogin ? "shadow-lg shadow-primary/30" : ""
              }`}
              onClick={() => setIsLogin(true)}
              disabled={isSubmitting}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "ghost"}
              className={`flex-1 transition-all duration-300 ${
                !isLogin ? "shadow-lg shadow-primary/30" : ""
              }`}
              onClick={() => setIsLogin(false)}
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                minLength={6}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 glow-primary border-none shadow-lg transition-all duration-300 group"
            >
              <span className="flex items-center gap-2 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Login to Dashboard" : "Create Account"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-primary rounded-full animate-ping"></div>
      <div className="absolute bottom-10 left-10 w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
    </div>
  );
};

export default Auth;
