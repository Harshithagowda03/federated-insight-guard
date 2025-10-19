import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const DashboardOverview = () => {
  const stats = [
    { label: "Active Nodes", value: "12", icon: Shield, color: "text-primary" },
    { label: "Threats Detected", value: "247", icon: AlertTriangle, color: "text-destructive" },
    { label: "Models Trained", value: "8", icon: CheckCircle, color: "text-accent" },
    { label: "Accuracy", value: "94.2%", icon: TrendingUp, color: "text-success" },
  ];

  const recentThreats = [
    { id: 1, type: "DDoS Attack", severity: "high", timestamp: "2 min ago" },
    { id: 2, type: "SQL Injection", severity: "medium", timestamp: "15 min ago" },
    { id: 3, type: "Port Scan", severity: "low", timestamp: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Real-time threat detection and system status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Federated learning network health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Model Synchronization</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Pipeline</span>
              <Badge variant="default">Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Health</span>
              <Badge variant="default">Healthy</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Threats</CardTitle>
            <CardDescription>Latest detected security events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentThreats.map((threat) => (
              <Alert key={threat.id}>
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{threat.type}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{threat.timestamp}</span>
                  </div>
                  <Badge
                    variant={
                      threat.severity === "high"
                        ? "destructive"
                        : threat.severity === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {threat.severity}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
