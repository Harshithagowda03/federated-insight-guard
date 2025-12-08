import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Trash2,
  Radio,
  Zap
} from "lucide-react";
import { useRealtimeDetection, DetectedThreat } from "@/hooks/useRealtimeDetection";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ThreatCard = ({ 
  threat, 
  onMitigate, 
  onDismiss 
}: { 
  threat: DetectedThreat; 
  onMitigate: () => void; 
  onDismiss: () => void;
}) => {
  const Icon = threat.attackType.icon;
  const isActive = threat.status === "active";
  const isMitigated = threat.status === "mitigated";

  return (
    <div
      className={cn(
        "glass-strong p-4 rounded-lg border transition-all duration-300",
        isActive && "border-destructive/50 animate-pulse-glow",
        isMitigated && "border-success/50 opacity-75"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${threat.attackType.color}20` }}
          >
            <Icon 
              className="h-5 w-5" 
              style={{ color: threat.attackType.color }} 
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {threat.attackType.label}
              </span>
              <Badge
                variant={isActive ? "destructive" : "secondary"}
                className="text-xs"
              >
                {threat.status}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs"
                style={{ borderColor: threat.attackType.color, color: threat.attackType.color }}
              >
                {threat.attackType.severity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {threat.attackType.description}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Source: {threat.sourceIp}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Target: {threat.targetIp}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {threat.detectionLatency}ms latency
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Confidence:</span>
                <span 
                  className="font-bold"
                  style={{ color: threat.confidence >= 90 ? "hsl(var(--success))" : "hsl(var(--warning))" }}
                >
                  {threat.confidence}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                • {threat.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isActive && (
            <Button
              size="sm"
              variant="default"
              className="bg-gradient-primary text-white gap-1"
              onClick={() => {
                onMitigate();
                toast.success(`${threat.attackType.label} mitigated successfully`);
              }}
            >
              <CheckCircle className="h-3 w-3" />
              Mitigate
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-muted-foreground hover:text-destructive"
            onClick={onDismiss}
          >
            <Trash2 className="h-3 w-3" />
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

const RealtimeDetection = () => {
  const {
    threats,
    stats,
    isMonitoring,
    setIsMonitoring,
    mitigateThreat,
    dismissThreat,
    clearAllThreats,
  } = useRealtimeDetection(true);

  const activeThreats = threats.filter((t) => t.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Real-Time Detection
          </h2>
          <p className="text-muted-foreground">
            Live threat monitoring powered by federated AI model
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Radio className={cn("h-4 w-4", isMonitoring && "text-success animate-pulse")} />
            <span className="text-sm text-muted-foreground">Monitoring</span>
            <Switch
              checked={isMonitoring}
              onCheckedChange={setIsMonitoring}
            />
          </div>
          {threats.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllThreats}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-strong border-gradient">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeThreats}</p>
                <p className="text-xs text-muted-foreground">Active Threats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-gradient">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.mitigated}</p>
                <p className="text-xs text-muted-foreground">Mitigated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-gradient">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalDetected}</p>
                <p className="text-xs text-muted-foreground">Total Detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-gradient">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgLatency}ms</p>
                <p className="text-xs text-muted-foreground">Avg Latency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Threats List */}
      <Card className="glass-strong border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={cn(
              "inline-flex h-2 w-2 rounded-full",
              activeThreats.length > 0 ? "bg-destructive animate-pulse" : "bg-success"
            )} />
            Live Threat Feed
          </CardTitle>
          <CardDescription>
            {activeThreats.length > 0
              ? `${activeThreats.length} active threat${activeThreats.length > 1 ? "s" : ""} detected`
              : "No active threats - system secure"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {threats.length > 0 ? (
              <div className="space-y-3">
                {threats.map((threat) => (
                  <ThreatCard
                    key={threat.id}
                    threat={threat}
                    onMitigate={() => mitigateThreat(threat.id)}
                    onDismiss={() => dismissThreat(threat.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Shield className="h-12 w-12 text-success mb-3" />
                <p className="text-muted-foreground">
                  {isMonitoring 
                    ? "Monitoring active - waiting for threats..." 
                    : "Monitoring paused - enable to start detection"}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeDetection;
