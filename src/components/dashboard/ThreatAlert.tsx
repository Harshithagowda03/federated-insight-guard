import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Copy, MessageCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateThreatMessages } from "@/utils/threatMessageGenerator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ThreatAlertProps {
  type: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  source?: string;
  timestamp?: string;
  userName?: string;
  location?: string;
  recommendedAction?: string;
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
  userName = "User",
  location,
  recommendedAction,
  onTakeAction,
  onDismiss,
  className,
}: ThreatAlertProps) => {
  const { toast } = useToast();
  const [showMessages, setShowMessages] = useState(false);

  const messages = generateThreatMessages({
    type: title,
    location,
    time: timestamp || new Date().toLocaleTimeString(),
    severity: type,
    userName,
    action: recommendedAction,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 💕",
      description: `${label} message copied to clipboard`,
    });
  };
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

          <div className="flex flex-wrap gap-2 pt-2">
            {onTakeAction && (
              <Button
                size="sm"
                onClick={onTakeAction}
                className="bg-gradient-primary hover:opacity-90 border-none text-white"
              >
                Take Action
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMessages(!showMessages)}
              className="gap-2"
            >
              <MessageCircle className="h-3 w-3" />
              {showMessages ? "Hide" : "Show"} Messages
            </Button>
          </div>

          {showMessages && (
            <div className="mt-4 space-y-3 pt-3 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    SMS Message
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(messages.sms, "SMS")}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs bg-background/50 p-2 rounded-md">{messages.sms}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Push Notification
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`${messages.pushTitle}\n${messages.pushBody}`, "Push")}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs bg-background/50 p-2 rounded-md space-y-1">
                  <p className="font-semibold">{messages.pushTitle}</p>
                  <p>{messages.pushBody}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp Message
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(messages.whatsapp, "WhatsApp")}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs bg-background/50 p-2 rounded-md">{messages.whatsapp}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/30">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  Free Send Options 💕
                </span>
                <div className="space-y-1">
                  {messages.freeSendOptions.map((option, index) => (
                    <p key={index} className="text-xs text-muted-foreground pl-3">
                      {index + 1}) {option}
                    </p>
                  ))}
                </div>
              </div>
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
