import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Layers, 
  Wind,
  AlertTriangle,
  Navigation,
  Zap,
  TreePine
} from "lucide-react";
import { getCurrentSensorData } from "@/data/sensorData";

const RiskMap = () => {
  const [selectedLayer, setSelectedLayer] = useState("risk");
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  
  const sensorData = useMemo(() => getCurrentSensorData(), []);
  
  const selectedSensorData = selectedSensor 
    ? sensorData.find(s => s.device_id === selectedSensor)
    : null;

  const mapLayers = [
    { value: "risk", label: "Health Risk Zones", icon: AlertTriangle },
    { value: "pollution", label: "Pollution Concentration", icon: Wind },
    { value: "traffic", label: "Traffic Density", icon: Navigation },
    { value: "vegetation", label: "Vegetation Cover", icon: TreePine },
    { value: "elevation", label: "Elevation", icon: Layers },
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'hazardous': return '#991b1b';
      default: return '#6b7280';
    }
  };

  // Calculate zone statistics
  const zoneStats = useMemo(() => {
    const zones = sensorData.reduce((acc, sensor) => {
      acc[sensor.risk_level] = (acc[sensor.risk_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return zones;
  }, [sensorData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geospatial Risk Map</h1>
          <p className="text-muted-foreground">AI-powered health risk mapping with real-time environmental data</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedLayer} onValueChange={setSelectedLayer}>
            <SelectTrigger className="w-48">
              <Layers className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mapLayers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <SelectItem key={layer.value} value={layer.value}>
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {layer.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zone Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-air-quality-good rounded-full"></div>
              <div>
                <div className="text-2xl font-bold">{zoneStats.low || 0}</div>
                <p className="text-xs text-muted-foreground">Low Risk Zones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-air-quality-moderate rounded-full"></div>
              <div>
                <div className="text-2xl font-bold">{zoneStats.moderate || 0}</div>
                <p className="text-xs text-muted-foreground">Moderate Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-air-quality-unhealthy rounded-full"></div>
              <div>
                <div className="text-2xl font-bold">{zoneStats.high || 0}</div>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-air-quality-hazardous rounded-full"></div>
              <div>
                <div className="text-2xl font-bold">{zoneStats.hazardous || 0}</div>
                <p className="text-xs text-muted-foreground">Hazardous</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Interactive Risk Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {/* Placeholder for ArcGIS Map */}
              <div className="relative w-full h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">ArcGIS Integration</h3>
                    <p className="text-muted-foreground max-w-md">
                      Interactive map showing real-time pollution data, health risk zones, 
                      and environmental layers powered by ArcGIS
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <Zap className="w-4 h-4 mr-2" />
                    Initialize Map Integration
                  </Button>
                </div>
                
                {/* Mock sensor points overlay */}
                <div className="absolute inset-4">
                  {sensorData.map((sensor, index) => (
                    <div 
                      key={sensor.device_id}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-150`}
                      style={{
                        backgroundColor: getRiskColor(sensor.risk_level),
                        left: `${20 + (index % 4) * 20}%`,
                        top: `${20 + Math.floor(index / 4) * 20}%`,
                      }}
                      onClick={() => setSelectedSensor(sensor.device_id)}
                      title={`${sensor.location.name} - ${sensor.risk_level} risk`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Details Panel */}
        <div className="space-y-6">
          {/* Map Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Active Layer:</label>
                <Badge variant="outline" className="w-full justify-center py-2">
                  {mapLayers.find(l => l.value === selectedLayer)?.label}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Zone Legend:</label>
                <div className="space-y-2">
                  {[
                    { level: 'Low Risk', color: '#22c55e', description: 'Safe for outdoor activities' },
                    { level: 'Moderate', color: '#f59e0b', description: 'Sensitive groups may be affected' },
                    { level: 'High Risk', color: '#ef4444', description: 'Health warnings recommended' },
                    { level: 'Hazardous', color: '#991b1b', description: 'Emergency conditions' }
                  ].map((item) => (
                    <div key={item.level} className="flex items-center space-x-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium">{item.level}</div>
                        <div className="text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Sensor Details */}
          {selectedSensorData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sensor Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{selectedSensorData.location.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedSensorData.device_id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">PM2.5:</span>
                      <span className="font-medium ml-2">{selectedSensorData.PM2_5} μg/m³</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">PM10:</span>
                      <span className="font-medium ml-2">{selectedSensorData.PM10} μg/m³</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">NO₂:</span>
                      <span className="font-medium ml-2">{selectedSensorData.NO2} ppb</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">CO:</span>
                      <span className="font-medium ml-2">{selectedSensorData.CO} ppm</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temp:</span>
                      <span className="font-medium ml-2">{selectedSensorData.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Humidity:</span>
                      <span className="font-medium ml-2">{selectedSensorData.humidity}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Assessment:</span>
                    <Badge 
                      className={`bg-${getRiskColor(selectedSensorData.risk_level).slice(1)} text-white`}
                      style={{ backgroundColor: getRiskColor(selectedSensorData.risk_level) }}
                    >
                      {selectedSensorData.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Score</span>
                      <span>{selectedSensorData.risk_score}/4</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(selectedSensorData.risk_score / 4) * 100}%`,
                          backgroundColor: getRiskColor(selectedSensorData.risk_level)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-air-quality-good/10 rounded-lg border border-air-quality-good/20">
                  <div className="font-medium text-air-quality-good">Safe Zones</div>
                  <div className="text-muted-foreground">Parks and residential areas with low pollution levels</div>
                </div>
                
                <div className="p-3 bg-air-quality-unhealthy/10 rounded-lg border border-air-quality-unhealthy/20">
                  <div className="font-medium text-air-quality-unhealthy">High Risk Areas</div>
                  <div className="text-muted-foreground">Avoid prolonged outdoor activities. Use air purifiers indoors.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;