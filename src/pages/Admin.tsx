import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Settings, 
  Database,
  Play,
  Pause,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for processing`,
      });
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    toast({
      title: "Data simulation started",
      description: "Generating mock sensor readings for testing",
    });
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    toast({
      title: "Data simulation stopped",
      description: "Real-time data stream paused",
    });
  };

  const systemStats = {
    uptime: "15 days, 7 hours",
    dataPoints: "2,847,392",
    lastBackup: "2 hours ago",
    apiCalls: "45,238",
    errors: "0.02%"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System management and data administration</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={isSimulating ? "default" : "secondary"} className="flex items-center space-x-1">
            {isSimulating ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isSimulating ? "Simulation Active" : "Simulation Paused"}</span>
          </Badge>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemStats.uptime}</div>
            <p className="text-xs text-muted-foreground">Last restart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemStats.dataPoints}</div>
            <p className="text-xs text-muted-foreground">Total collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemStats.apiCalls}</div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-air-quality-good" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-air-quality-good">{systemStats.errors}</div>
            <p className="text-xs text-muted-foreground">System health</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemStats.lastBackup}</div>
            <p className="text-xs text-muted-foreground">Database sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Interface */}
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Data Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataFile">Upload Sensor Data (CSV/JSON)</Label>
                  <Input
                    id="dataFile"
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                  />
                  {uploadedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deviceId">Device ID</Label>
                  <Input id="deviceId" placeholder="charsense_001" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Input id="location" placeholder="Downtown Area" />
                </div>
                
                <Button className="w-full" disabled={!uploadedFile}>
                  <Upload className="w-4 h-4 mr-2" />
                  Process Upload
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Data Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" defaultValue="2024-01-01" />
                    <Input type="date" defaultValue="2024-01-31" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">CSV</Button>
                    <Button variant="outline" size="sm">JSON</Button>
                    <Button variant="outline" size="sm">Excel</Button>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  <p>• Last export: 3 days ago</p>
                  <p>• Average file size: 2.3 MB</p>
                  <p>• Export limit: 100,000 records</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Real-time Data Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Simulation Parameters</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Update Interval (s)</Label>
                        <Input type="number" defaultValue="5" min="1" max="60" />
                      </div>
                      <div>
                        <Label className="text-xs">Variance Level</Label>
                        <Input type="number" defaultValue="20" min="0" max="100" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pollution Scenario</Label>
                    <div className="space-y-1">
                      <Button variant="outline" size="sm" className="w-full justify-start">Normal Conditions</Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">High Traffic Event</Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">Industrial Spike</Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">Weather Inversion</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Active Sensors</Label>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>charsense_001</span>
                        <Badge variant="default" className="bg-sensor-active">Online</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>charsense_002</span>
                        <Badge variant="default" className="bg-sensor-active">Online</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>charsense_003</span>
                        <Badge variant="secondary">Offline</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex space-x-2">
                      <Button 
                        onClick={isSimulating ? stopSimulation : startSimulation}
                        className={isSimulating ? "bg-air-quality-unhealthy" : "bg-air-quality-good"}
                      >
                        {isSimulating ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Stop Simulation
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Simulation
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Alert Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>PM2.5 Threshold (μg/m³)</Label>
                  <Input type="number" defaultValue="75" />
                </div>
                <div className="space-y-2">
                  <Label>NO₂ Threshold (ppb)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <Label>Alert Email Recipients</Label>
                  <Textarea placeholder="admin@example.com&#10;health@example.com" />
                </div>
                <Button className="w-full">Save Thresholds</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Rate Limit (requests/hour)</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input type="number" defaultValue="365" />
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Hourly</Button>
                    <Button variant="outline" size="sm">Daily</Button>
                    <Button variant="outline" size="sm">Weekly</Button>
                  </div>
                </div>
                <Button className="w-full">Update Configuration</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-air-quality-good/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-air-quality-good mx-auto mb-2" />
                    <div className="font-semibold">Database</div>
                    <div className="text-sm text-muted-foreground">Healthy</div>
                  </div>
                  <div className="text-center p-4 bg-air-quality-good/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-air-quality-good mx-auto mb-2" />
                    <div className="font-semibold">API Server</div>
                    <div className="text-sm text-muted-foreground">Online</div>
                  </div>
                  <div className="text-center p-4 bg-air-quality-moderate/10 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-air-quality-moderate mx-auto mb-2" />
                    <div className="font-semibold">ML Pipeline</div>
                    <div className="text-sm text-muted-foreground">Warning</div>
                  </div>
                  <div className="text-center p-4 bg-air-quality-good/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-air-quality-good mx-auto mb-2" />
                    <div className="font-semibold">Data Stream</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent Activity Log</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/20 rounded">
                      <span>Data upload completed - 1,250 records</span>
                      <span className="text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded">
                      <span>ML model retrained with new data</span>
                      <span className="text-muted-foreground">15 min ago</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded">
                      <span>High pollution alert triggered - Industrial Area</span>
                      <span className="text-muted-foreground">1 hour ago</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded">
                      <span>System backup completed successfully</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;