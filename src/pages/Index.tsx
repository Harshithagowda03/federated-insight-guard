import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, Database, Zap, FileUp, Target } from "lucide-react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import FederatedLearning from "@/components/dashboard/FederatedLearning";
import ThreatAnalytics from "@/components/dashboard/ThreatAnalytics";
import AttackSimulator from "@/components/dashboard/AttackSimulator";
import DataUpload from "@/components/dashboard/DataUpload";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">FedSecure AI</h1>
              <p className="text-sm text-muted-foreground">
                Adaptive Threat Detection with Federated Learning
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="federated" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Federated</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Threats</span>
            </TabsTrigger>
            <TabsTrigger value="simulator" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <FileUp className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
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
