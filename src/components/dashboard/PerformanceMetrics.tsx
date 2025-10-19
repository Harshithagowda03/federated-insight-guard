import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const PerformanceMetrics = () => {
  const accuracyTrend = [
    { epoch: 1, train: 78, validation: 75, test: 73 },
    { epoch: 2, train: 82, validation: 80, test: 78 },
    { epoch: 3, train: 87, validation: 84, test: 82 },
    { epoch: 4, train: 91, validation: 88, test: 86 },
    { epoch: 5, train: 93, validation: 91, test: 89 },
    { epoch: 6, train: 95, validation: 93, test: 91 },
    { epoch: 7, train: 96, validation: 94, test: 92 },
    { epoch: 8, train: 97, validation: 95, test: 94 },
  ];

  const lossTrend = [
    { epoch: 1, train: 0.85, validation: 0.92 },
    { epoch: 2, train: 0.68, validation: 0.75 },
    { epoch: 3, train: 0.52, validation: 0.61 },
    { epoch: 4, train: 0.38, validation: 0.48 },
    { epoch: 5, train: 0.27, validation: 0.36 },
    { epoch: 6, train: 0.19, validation: 0.28 },
    { epoch: 7, train: 0.14, validation: 0.22 },
    { epoch: 8, train: 0.11, validation: 0.18 },
  ];

  const metricsComparison = [
    { metric: "Precision", score: 93 },
    { metric: "Recall", score: 91 },
    { metric: "F1-Score", score: 92 },
    { metric: "AUC-ROC", score: 95 },
    { metric: "Specificity", score: 94 },
  ];

  const modelComparison = [
    { subject: "Accuracy", baseline: 82, federated: 94 },
    { subject: "Speed", baseline: 75, federated: 88 },
    { subject: "Privacy", baseline: 45, federated: 98 },
    { subject: "Scalability", baseline: 68, federated: 92 },
    { subject: "Robustness", baseline: 71, federated: 89 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Performance Metrics</h2>
        <p className="text-muted-foreground">Detailed model performance analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last round</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Precision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93.1%</div>
            <p className="text-xs text-muted-foreground">+1.8% from last round</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.4%</div>
            <p className="text-xs text-muted-foreground">+1.5% from last round</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">F1-Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.2%</div>
            <p className="text-xs text-muted-foreground">+1.7% from last round</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accuracy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="loss">Loss</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Over Training Epochs</CardTitle>
              <CardDescription>Model accuracy progression during training</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={accuracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[70, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="train" stroke="hsl(var(--primary))" strokeWidth={2} name="Training" />
                  <Line type="monotone" dataKey="validation" stroke="hsl(var(--accent))" strokeWidth={2} name="Validation" />
                  <Line type="monotone" dataKey="test" stroke="hsl(var(--warning))" strokeWidth={2} name="Test" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loss Over Training Epochs</CardTitle>
              <CardDescription>Model loss reduction during training</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lossTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 1]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="train" stroke="hsl(var(--primary))" strokeWidth={2} name="Training Loss" />
                  <Line type="monotone" dataKey="validation" stroke="hsl(var(--accent))" strokeWidth={2} name="Validation Loss" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classification Metrics</CardTitle>
              <CardDescription>Current model performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metricsComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>Federated learning vs baseline model</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={modelComparison}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Radar name="Baseline" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" fillOpacity={0.6} />
                  <Radar name="Federated" dataKey="federated" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetrics;
