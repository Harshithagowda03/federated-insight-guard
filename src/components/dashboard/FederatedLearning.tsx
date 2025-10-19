import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Server } from "lucide-react";
import { toast } from "sonner";

const FederatedLearning = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const nodes = [
    { id: 1, name: "Node Alpha", status: "active", accuracy: 92.5, samples: 15000 },
    { id: 2, name: "Node Beta", status: "active", accuracy: 94.1, samples: 18500 },
    { id: 3, name: "Node Gamma", status: "syncing", accuracy: 91.8, samples: 12000 },
    { id: 4, name: "Node Delta", status: "idle", accuracy: 93.2, samples: 16200 },
  ];

  const handleStartTraining = () => {
    setIsTraining(true);
    toast.success("Federated training started");
    
    // Simulate training progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success("Training round completed");
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const handlePauseTraining = () => {
    setIsTraining(false);
    toast.info("Training paused");
  };

  const handleResetTraining = () => {
    setProgress(0);
    setIsTraining(false);
    toast.info("Training reset");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Federated Learning</h2>
        <p className="text-muted-foreground">Distributed model training across nodes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Control</CardTitle>
          <CardDescription>Manage federated learning rounds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleStartTraining} 
              disabled={isTraining}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start Training
            </Button>
            <Button 
              onClick={handlePauseTraining} 
              disabled={!isTraining}
              variant="secondary"
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button 
              onClick={handleResetTraining}
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
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Round</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Samples</p>
              <p className="text-2xl font-bold">61.7K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Global Accuracy</p>
              <p className="text-2xl font-bold">94.2%</p>
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
                    <p className="font-semibold">{node.accuracy}%</p>
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
