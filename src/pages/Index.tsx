import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, Database, Zap, FileUp, Target, LogIn, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import FederatedLearning from "@/components/dashboard/FederatedLearning";
import ThreatAnalytics from "@/components/dashboard/ThreatAnalytics";
import AttackSimulator from "@/components/dashboard/AttackSimulator";
import DataUpload from "@/components/dashboard/DataUpload";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import RealtimeDetection from "@/components/dashboard/RealtimeDetection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 bg-circuit-pattern opacity-30 pointer-events-none"></div>
      <div className="fixed top-20 left-20 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-accent rounded-full blur-3xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: "3s" }}></div>
      <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse-glow pointer-events-none"></div>

      {/* Header with Glassmorphism */}
      <header className="glass-strong border-b relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary relative z-10" />
                <div className="absolute inset-0 bg-primary blur-lg opacity-50 animate-pulse-glow"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                  FedSecure AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Adaptive Threat Detection with Federated Learning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <UserProfileMenu onLogout={signOut} />
              ) : (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="gap-2 bg-gradient-primary hover:opacity-90 transition-all duration-300 glow-primary border-none"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-strong grid w-full grid-cols-7 lg:w-auto border-gradient">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <Radio className="h-4 w-4" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger value="federated" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Federated</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Threats</span>
            </TabsTrigger>
            <TabsTrigger value="simulator" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <FileUp className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <RealtimeDetection />
          </TabsContent>

          <TabsContent value="federated" className="space-y-6">
            <FederatedLearning />
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <ThreatAnalytics />
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <AttackSimulator />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <DataUpload />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
