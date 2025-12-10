import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Server, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useFederatedTraining, FederatedNode } from "@/hooks/useFederatedTraining";
import { useAuth } from "@/hooks/useAuth";
import TrainingWelcome from "./TrainingWelcome";

const FederatedLearning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    isConnected,
    isLoading,
    isTraining,
    error,
    session,
    startTraining,
    pauseTraining,
    resumeTraining,
    resetTraining,
    fetchNodes,
    checkHealth,
  } = useFederatedTraining();

  const [nodes, setNodes] = useState<FederatedNode[]>([
    { id: 'node1', name: 'Node Alpha', status: 'idle', accuracy: 0.925, samples: 15000, contribution: 0 },
    { id: 'node2', name: 'Node Beta', status: 'idle', accuracy: 0.941, samples: 18500, contribution: 0 },
    { id: 'node3', name: 'Node Gamma', status: 'idle', accuracy: 0.918, samples: 12000, contribution: 0 },
    { id: 'node4', name: 'Node Delta', status: 'idle', accuracy: 0.932, samples: 16200, contribution: 0 },
  ]);

  // Update nodes from session or fetch them
  useEffect(() => {
    if (session?.nodes) {
      setNodes(session.nodes);
    } else if (isConnected && !isTraining) {
      fetchNodes().then(fetchedNodes => {
        if (fetchedNodes.length > 0) {
          setNodes(fetchedNodes);
        }
      });
    }
  }, [session?.nodes, isConnected, isTraining, fetchNodes]);

  const handleStartTraining = async () => {
    await startTraining(10);
  };

  const handlePauseResume = () => {
    if (session?.status === 'paused') {
      resumeTraining();
    } else {
      pauseTraining();
    }
  };

  const progress = session ? (session.current_round / session.max_rounds) * 100 : 0;
  const currentRound = session?.current_round || 0;
  const maxRounds = session?.max_rounds || 10;
  const totalSamples = session?.total_samples || nodes.reduce((sum, n) => sum + n.samples, 0);
  const globalAccuracy = session?.accuracy || 0;

  // Show friendly welcome screen when not training and not connected
  const showWelcome = !isTraining && !session && !isLoading;

  if (showWelcome) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Federated Learning</h2>
          <p className="text-muted-foreground">Distributed model training across nodes</p>
        </div>
        <TrainingWelcome
          isAuthenticated={!!user && isConnected}
          nodes={nodes}
          onStartTraining={handleStartTraining}
          onLogin={() => navigate('/auth')}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Federated Learning</h2>
        <p className="text-muted-foreground">Distributed model training across nodes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Training Control</CardTitle>
              <CardDescription>Manage federated learning rounds</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Connecting...
                </Badge>
              ) : isConnected ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge 
                  variant="destructive" 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={checkHealth}
                >
                  <WifiOff className="h-3 w-3" />
                  Offline - Click to retry
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && !isConnected && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}. Please make sure you're logged in and try again.
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleStartTraining} 
              disabled={isTraining || !isConnected || isLoading}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start Training
            </Button>
            <Button 
              onClick={handlePauseResume} 
              disabled={!isTraining && session?.status !== 'paused'}
              variant="secondary"
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              {session?.status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
            <Button 
              onClick={resetTraining}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Training Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            {session?.status === 'completed' && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✓ Training completed successfully
              </p>
            )}
            {session?.status === 'paused' && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⏸ Training paused
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Round</p>
              <p className="text-2xl font-bold">{currentRound}/{maxRounds}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Samples</p>
              <p className="text-2xl font-bold">{(totalSamples / 1000).toFixed(1)}K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Global Accuracy</p>
              <p className="text-2xl font-bold">{(globalAccuracy * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Federated Nodes</CardTitle>
          <CardDescription>Status of participating nodes in the network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{node.name}</p>
                    <p className="text-sm text-muted-foreground">{node.samples.toLocaleString()} samples</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="font-semibold">{(node.accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <Badge
                    variant={
                      node.status === "active"
                        ? "default"
                        : node.status === "syncing"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {node.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FederatedLearning;
