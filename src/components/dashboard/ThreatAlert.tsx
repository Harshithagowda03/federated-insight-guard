import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThreatAlertProps {
  type: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  source?: string;
  timestamp?: string;
  onTakeAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ThreatAlert = ({
  type,
  title,
  description,
  source,
  timestamp,
  onTakeAction,
  onDismiss,
  className,
}: ThreatAlertProps) => {
  const getTypeConfig = () => {
    switch (type) {
      case "critical":
        return {
          icon: XCircle,
          bgClass: "bg-destructive/10 border-destructive/50",
          iconClass: "text-destructive",
          glowClass: "shadow-[0_0_30px_hsl(var(--destructive)/0.5)]",
        };
      case "high":
        return {
          icon: AlertTriangle,
          bgClass: "bg-warning/10 border-warning/50",
          iconClass: "text-warning",
          glowClass: "shadow-[0_0_30px_hsl(var(--warning)/0.4)]",
        };
      case "medium":
        return {
          icon: AlertTriangle,
          bgClass: "bg-secondary/20 border-secondary/50",
          iconClass: "text-secondary",
          glowClass: "shadow-[0_0_25px_hsl(var(--secondary)/0.3)]",
        };
      case "low":
        return {
          icon: Info,
          bgClass: "bg-accent/10 border-accent/50",
          iconClass: "text-accent",
          glowClass: "shadow-[0_0_20px_hsl(var(--accent)/0.3)]",
        };
      case "info":
        return {
          icon: CheckCircle,
          bgClass: "bg-success/10 border-success/50",
          iconClass: "text-success",
          glowClass: "shadow-[0_0_20px_hsl(var(--success)/0.3)]",
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <Alert
      className={cn(
        "glass-strong relative overflow-hidden",
        config.bgClass,
        config.glowClass,
        "animate-fade-in",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Icon className={cn("h-5 w-5 relative z-10", config.iconClass)} />
          <div className={cn("absolute inset-0 blur-md opacity-50", config.iconClass)}></div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                {title}
                {type === "critical" && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
                )}
              </h4>
              <AlertDescription className="text-sm text-muted-foreground">
                {description}
              </AlertDescription>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
              >
                ×
              </Button>
            )}
          </div>

          {(source || timestamp) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {source && (
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {source}
                </span>
              )}
              {timestamp && <span>{timestamp}</span>}
            </div>
          )}

          {onTakeAction && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={onTakeAction}
                className="bg-gradient-primary hover:opacity-90 border-none text-white"
              >
                Take Action
              </Button>
              <Button variant="outline" size="sm" onClick={onDismiss}>
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Animated border effect for critical alerts */}
      {type === "critical" && (
        <div className="absolute inset-0 border-2 border-destructive/30 rounded-lg animate-pulse-glow pointer-events-none"></div>
      )}
    </Alert>
  );
};

export default ThreatAlert;
