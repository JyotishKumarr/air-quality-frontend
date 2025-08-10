import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Activity, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wind,
  Thermometer,
  Droplets
} from "lucide-react";
import { getCurrentSensorData, getHistoricalData } from "@/data/sensorData";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  
  const sensorData = useMemo(() => getCurrentSensorData(), []);
  const historicalData = useMemo(() => 
    selectedSensor ? getHistoricalData(selectedSensor, 24) : []
  , [selectedSensor]);

  // Filter sensors based on search and risk level
  const filteredSensors = useMemo(() => {
    return sensorData.filter(sensor => {
      const matchesSearch = sensor.location.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === "all" || sensor.risk_level === filterRisk;
      return matchesSearch && matchesRisk;
    });
  }, [sensorData, searchTerm, filterRisk]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalSensors = sensorData.length;
    const activeSensors = sensorData.filter(s => s.timestamp).length;
    const avgPM25 = sensorData.reduce((sum, s) => sum + s.PM2_5, 0) / totalSensors;
    const avgNO2 = sensorData.reduce((sum, s) => sum + s.NO2, 0) / totalSensors;
    const highRiskCount = sensorData.filter(s => s.risk_level === 'high' || s.risk_level === 'hazardous').length;
    
    return {
      totalSensors,
      activeSensors,
      avgPM25: Math.round(avgPM25 * 10) / 10,
      avgNO2: Math.round(avgNO2 * 10) / 10,
      highRiskCount
    };
  }, [sensorData]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-air-quality-good';
      case 'moderate': return 'bg-air-quality-moderate';
      case 'high': return 'bg-air-quality-unhealthy';
      case 'hazardous': return 'bg-air-quality-hazardous';
      default: return 'bg-muted';
    }
  };

  const formatChartData = (data: any[]) => {
    return data.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      PM25: item.PM2_5,
      NO2: item.NO2,
      temp: item.temperature,
      humidity: item.humidity
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Dashboard</h1>
          <p className="text-muted-foreground">Real-time air quality monitoring across all sensor locations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-sensor-active rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live Data Stream</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2 text-sensor-active" />
              Active Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeSensors}/{summaryStats.totalSensors}</div>
            <p className="text-xs text-muted-foreground">Online devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wind className="w-4 h-4 mr-2" />
              Avg PM2.5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgPM25}</div>
            <p className="text-xs text-muted-foreground">μg/m³</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg NO₂</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgNO2}</div>
            <p className="text-xs text-muted-foreground">ppb</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-air-quality-unhealthy" />
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-air-quality-unhealthy">{summaryStats.highRiskCount}</div>
            <p className="text-xs text-muted-foreground">zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-air-quality-good">98.5%</div>
            <p className="text-xs text-muted-foreground">uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sensor Data Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="moderate">Moderate Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="hazardous">Hazardous</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      {selectedSensor && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PM2.5 & NO₂ Trends (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(historicalData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="PM25" 
                    stroke="hsl(var(--air-quality-unhealthy))" 
                    strokeWidth={2}
                    name="PM2.5 (μg/m³)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="NO2" 
                    stroke="hsl(var(--air-quality-moderate))" 
                    strokeWidth={2}
                    name="NO₂ (ppb)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Temperature & Humidity (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(historicalData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Humidity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sensor Grid */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sensor Locations ({filteredSensors.length})</h2>
          <p className="text-sm text-muted-foreground">Click a sensor to view detailed charts</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSensors.map((sensor) => (
            <Card 
              key={sensor.device_id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSensor === sensor.device_id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedSensor(sensor.device_id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{sensor.location.name}</CardTitle>
                  <Badge className={`${getRiskColor(sensor.risk_level)} text-white`}>
                    {sensor.risk_level.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{sensor.device_id}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Main Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{sensor.PM2_5}</div>
                    <div className="text-xs text-muted-foreground">PM2.5 μg/m³</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{sensor.NO2}</div>
                    <div className="text-xs text-muted-foreground">NO₂ ppb</div>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium">{sensor.PM10}</div>
                    <div className="text-muted-foreground">PM10</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{sensor.CO}</div>
                    <div className="text-muted-foreground">CO</div>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <Thermometer className="w-3 h-3 mb-1" />
                    <div className="font-medium">{sensor.temperature}°C</div>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <Droplets className="w-3 h-3 mb-1" />
                    <div className="font-medium">{sensor.humidity}%</div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getRiskColor(sensor.risk_level)}`}></div>
                    <span className="font-medium">{sensor.risk_score}/4</span>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground text-center">
                  Updated: {new Date(sensor.timestamp).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;