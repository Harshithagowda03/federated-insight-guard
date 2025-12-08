import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import ThreatAlert from "./ThreatAlert";
import { useToast } from "@/hooks/use-toast";
import { ATTACK_TYPES, SEVERITY_COLORS, getAttackById } from "@/config/attackTypes";

const ThreatAnalytics = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical" as const,
      title: "Critical DDoS Attack Detected",
      description: "A sophisticated distributed denial-of-service attack is targeting your infrastructure from multiple IP addresses. Our AI has automatically activated defense protocols.",
      source: "FedSecure AI Detection Engine",
      timestamp: "2 minutes ago",
      userName: "Security Team",
      location: "Main Server",
      recommendedAction: "Activate DDoS protection and monitor traffic patterns",
    },
    {
      id: 2,
      type: "high" as const,
      title: "SQL Injection Attempt Blocked",
      description: "Multiple SQL injection attempts were detected and neutralized. The attacker was trying to access your user database through a vulnerable endpoint.",
      source: "Web Application Firewall",
      timestamp: "15 minutes ago",
      userName: "Admin User",
      location: "Database Server",
      recommendedAction: "Review security logs and patch vulnerable endpoints",
    },
  ]);
  const { toast } = useToast();

  const handleTakeAction = (alertId: number) => {
    toast({
      title: "Security Action Initiated",
      description: "Automated response protocols have been deployed. Your security team has been notified.",
    });
  };

  const handleDismiss = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };
  const threatTrend = [
    { time: "00:00", threats: 12 },
    { time: "04:00", threats: 8 },
    { time: "08:00", threats: 24 },
    { time: "12:00", threats: 35 },
    { time: "16:00", threats: 28 },
    { time: "20:00", threats: 19 },
  ];

  // Generate threat types data from centralized config
  const threatTypes = [
    { name: getAttackById("ddos").label, count: 87, color: getAttackById("ddos").color },
    { name: getAttackById("sql-injection").label, count: 64, color: getAttackById("sql-injection").color },
    { name: getAttackById("xss").label, count: 42, color: getAttackById("xss").color },
    { name: getAttackById("port-scan").label, count: 31, color: getAttackById("port-scan").color },
    { name: getAttackById("brute-force").label, count: 23, color: getAttackById("brute-force").color },
    // New attack types with simulated data
    { name: getAttackById("dns-tunneling").label, count: 18, color: getAttackById("dns-tunneling").color },
    { name: getAttackById("arp-spoofing").label, count: 12, color: getAttackById("arp-spoofing").color },
    { name: getAttackById("mitm-attack").label, count: 9, color: getAttackById("mitm-attack").color },
    { name: getAttackById("data-exfiltration").label, count: 7, color: getAttackById("data-exfiltration").color },
    { name: getAttackById("insider-misuse").label, count: 5, color: getAttackById("insider-misuse").color },
  ];

  const threatDistribution = [
    { name: "Critical", value: 15, color: SEVERITY_COLORS.critical },
    { name: "High", value: 35, color: SEVERITY_COLORS.high },
    { name: "Medium", value: 28, color: SEVERITY_COLORS.medium },
    { name: "Low", value: 22, color: SEVERITY_COLORS.low },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Threat Analytics
        </h2>
        <p className="text-muted-foreground">Real-time threat detection and analysis powered by AI</p>
      </div>

      {/* Active Threat Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
            Active Threat Alerts
          </h3>
          {alerts.map((alert) => (
            <ThreatAlert
              key={alert.id}
              type={alert.type}
              title={alert.title}
              description={alert.description}
              source={alert.source}
              timestamp={alert.timestamp}
              userName={alert.userName}
              location={alert.location}
              recommendedAction={alert.recommendedAction}
              onTakeAction={() => handleTakeAction(alert.id)}
              onDismiss={() => handleDismiss(alert.id)}
            />
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-strong border-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">●</span>
              Threat Timeline
            </CardTitle>
            <CardDescription>24-hour threat detection trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-strong border-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-secondary">●</span>
              Threat Distribution
            </CardTitle>
            <CardDescription>By severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-accent">●</span>
            Top Threat Types
          </CardTitle>
          <CardDescription>Most common attack patterns detected</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={threatTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {threatTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatAnalytics;
