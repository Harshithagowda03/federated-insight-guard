import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ATTACK_TYPES, getAttackById } from "@/config/attackTypes";

const AttackSimulator = () => {
  const [attackType, setAttackType] = useState("");
  const [intensity, setIntensity] = useState([50]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = () => {
    if (!attackType) {
      toast.error("Please select an attack type");
      return;
    }

    setIsSimulating(true);
    toast.info("Starting attack simulation...");

    // Simulate API call
    setTimeout(() => {
      const detected = Math.random() > 0.3;
      const detectionTime = (Math.random() * 500 + 100).toFixed(0);
      const confidence = (Math.random() * 30 + 70).toFixed(1);

      const attack = getAttackById(attackType);
      setResults({
        detected,
        detectionTime,
        confidence,
        attackType: attack.label,
        attackId: attackType,
        timestamp: new Date().toISOString(),
      });

      setIsSimulating(false);
      
      if (detected) {
        toast.success("Threat detected and blocked!");
      } else {
        toast.warning("Attack bypassed detection");
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Attack Simulator</h2>
        <p className="text-muted-foreground">Test AI model with simulated attack scenarios</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Configuration</CardTitle>
            <CardDescription>Configure and run attack simulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="attack-type">Attack Type</Label>
              <Select value={attackType} onValueChange={setAttackType}>
                <SelectTrigger id="attack-type">
                  <SelectValue placeholder="Select attack type" />
                </SelectTrigger>
                <SelectContent>
                  {ATTACK_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" style={{ color: type.color }} />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Attack Intensity: {intensity[0]}%</Label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={100}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Higher intensity increases complexity and stealth
              </p>
            </div>

            <Button 
              onClick={handleSimulate} 
              disabled={isSimulating || !attackType}
              className="w-full gap-2"
            >
              <Zap className="h-4 w-4" />
              {isSimulating ? "Simulating..." : "Run Simulation"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>Latest simulation outcome</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <span className="text-sm font-medium">Detection Status</span>
                  <Badge
                    variant={results.detected ? "default" : "destructive"}
                    className="gap-1"
                  >
                    {results.detected ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Detected
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Bypassed
                      </>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Attack Type</span>
                    <span className="font-medium">{results.attackType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Detection Time</span>
                    <span className="font-medium">{results.detectionTime}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{results.confidence}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="font-medium text-xs">
                      {new Date(results.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No simulation results yet.<br />
                  Configure and run a simulation to see results.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttackSimulator;
