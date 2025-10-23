import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: isLogin ? "Login Successful" : "Signup Successful",
      description: `Welcome ${isLogin ? "back" : "to SecureAI"}!`,
    });
    
    // Simulate successful auth and redirect to dashboard
    setTimeout(() => navigate("/"), 1500);
  };

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
            >
              Sign Up
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name" className="text-foreground/90 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
                />
              </div>
            )}

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
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-primary/20" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 glow-primary border-none shadow-lg transition-all duration-300 group"
            >
              <span className="flex items-center gap-2 text-white">
                {isLogin ? "Login to Dashboard" : "Create Account"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
