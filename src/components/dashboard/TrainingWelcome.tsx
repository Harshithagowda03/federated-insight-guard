import { Heart, Brain, Server, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FederatedNode {
  id: string;
  name: string;
  samples: number;
  accuracy: number;
  status: string;
}

interface TrainingWelcomeProps {
  isAuthenticated: boolean;
  nodes: FederatedNode[];
  onStartTraining: () => void;
  onLogin: () => void;
  isLoading?: boolean;
}

const TrainingWelcome = ({ 
  isAuthenticated, 
  nodes, 
  onStartTraining, 
  onLogin,
  isLoading 
}: TrainingWelcomeProps) => {
  const totalSamples = nodes.reduce((sum, n) => sum + n.samples, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <CardContent className="pt-8 pb-8 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Hello! I&apos;m Lovable AI 
                <Sparkles className="h-5 w-5 text-primary" />
              </h2>
              <p className="text-muted-foreground mt-1">
                Your personal federated learning companion! 💕
              </p>
              <p className="text-sm text-muted-foreground mt-3 max-w-lg">
                It looks like model training hasn&apos;t started yet — but don&apos;t worry, 
                I&apos;m right here to help you begin whenever you&apos;re ready.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Training Status</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Training</p>
              <p className="text-lg font-semibold text-foreground mt-1">Not running</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Round</p>
              <p className="text-lg font-semibold text-foreground mt-1">0/10</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Progress</p>
              <p className="text-lg font-semibold text-foreground mt-1">0%</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Global Accuracy</p>
              <p className="text-lg font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                Waiting… <span className="animate-pulse">⏳</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Federated Nodes */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Federated Nodes</h3>
            <Badge variant="secondary" className="ml-auto">
              {(totalSamples / 1000).toFixed(1)}K total samples
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            All nodes are currently in <span className="text-primary font-medium">idle mode</span>, 
            patiently waiting for instructions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodes.map((node) => (
              <div 
                key={node.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                  <span className="font-medium text-foreground">{node.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {(node.samples / 1000).toFixed(1)}K samples
                  </span>
                  <span className="text-primary font-medium">
                    {(node.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            They&apos;re ready to go whenever you are! 🚀
          </p>
        </CardContent>
      </Card>

      {/* Authentication & Action */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Authentication</h3>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You&apos;re logged in and ready to begin! 🎉
              </p>
              <Button 
                onClick={onStartTraining} 
                disabled={isLoading}
                className="gap-2 hover-scale"
              >
                Start Training
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-medium">Tip:</span> Click Start Training and I&apos;ll take care of the rest!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You&apos;re currently <span className="text-destructive font-medium">not logged in</span>.
                Please log in so I can begin your training journey.
              </p>
              <Button onClick={onLogin} className="gap-2 hover-scale">
                Log In to Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-medium">Tip:</span> After login, just click Start Training, and I&apos;ll take care of the rest!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingWelcome;
