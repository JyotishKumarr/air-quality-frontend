import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Wind, 
  Shield, 
  MapPin, 
  TrendingUp, 
  Activity,
  Leaf,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { getCurrentSensorData } from "@/data/sensorData";
import { useMemo } from "react";

const Home = () => {
  const sensorData = useMemo(() => getCurrentSensorData(), []);
  
  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalSensors = sensorData.length;
    const activeSensors = sensorData.filter(s => s.timestamp).length;
    const highRiskZones = sensorData.filter(s => s.risk_level === 'high' || s.risk_level === 'hazardous').length;
    const avgPM25 = Math.round(sensorData.reduce((sum, s) => sum + s.PM2_5, 0) / totalSensors);
    
    return { totalSensors, activeSensors, highRiskZones, avgPM25 };
  }, [sensorData]);

  const features = [
    {
      icon: Wind,
      title: "Biochar Air Purification",
      description: "Advanced biochar filters actively clean the air while monitoring pollutant levels in real-time."
    },
    {
      icon: MapPin,
      title: "Distributed Sensing Network",
      description: "Strategic placement of sensors across the city provides comprehensive pollution mapping."
    },
    {
      icon: Shield,
      title: "Health Risk Assessment",
      description: "AI-powered analysis translates pollution data into actionable health risk insights."
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Machine learning models forecast pollution patterns and potential health hazards."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            CharSense
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionary biochar-based air purification and pollution sensing system 
            for real-time environmental health monitoring
          </p>
        </div>
        
        {/* Live Status Banner */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Activity className="w-5 h-5 text-sensor-active" />
                  <span className="text-2xl font-bold text-foreground">{stats.activeSensors}</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Sensors</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Wind className="w-5 h-5 text-data-stream" />
                  <span className="text-2xl font-bold text-foreground">{stats.avgPM25} μg/m³</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg PM2.5</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  {stats.highRiskZones > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-air-quality-unhealthy" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-air-quality-good" />
                  )}
                  <span className="text-2xl font-bold text-foreground">{stats.highRiskZones}</span>
                </div>
                <p className="text-sm text-muted-foreground">Risk Zones</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Leaf className="w-5 h-5 text-air-quality-good" />
                  <span className="text-2xl font-bold text-foreground">{stats.totalSensors - stats.highRiskZones}</span>
                </div>
                <p className="text-sm text-muted-foreground">Safe Areas</p>
              </div>
            </div>
            
            {stats.highRiskZones > 0 && (
              <div className="mt-6 p-4 bg-air-quality-unhealthy/10 rounded-lg border border-air-quality-unhealthy/20">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-air-quality-unhealthy" />
                  <span className="text-sm font-medium text-air-quality-unhealthy">
                    Health Advisory: High pollution levels detected in {stats.highRiskZones} zones. 
                    Consider indoor activities and use air purifiers.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Activity className="w-4 h-4 mr-2" />
              View Live Dashboard
            </Button>
          </Link>
          <Link to="/map">
            <Button size="lg" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Explore Risk Map
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">How CharSense Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Combining advanced biochar technology with intelligent sensing for comprehensive air quality management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Current Status Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Current Air Quality Status</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorData.slice(0, 6).map((sensor) => (
            <Card key={sensor.device_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{sensor.location.name}</CardTitle>
                  <Badge 
                    variant={
                      sensor.risk_level === 'low' ? 'default' : 
                      sensor.risk_level === 'moderate' ? 'secondary' : 
                      'destructive'
                    }
                    className={
                      sensor.risk_level === 'low' ? 'bg-air-quality-good text-white' :
                      sensor.risk_level === 'moderate' ? 'bg-air-quality-moderate text-white' :
                      'bg-air-quality-unhealthy text-white'
                    }
                  >
                    {sensor.risk_level.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>PM2.5: <span className="font-medium">{sensor.PM2_5} μg/m³</span></div>
                  <div>NO₂: <span className="font-medium">{sensor.NO2} ppb</span></div>
                  <div>Temp: <span className="font-medium">{sensor.temperature}°C</span></div>
                  <div>Humidity: <span className="font-medium">{sensor.humidity}%</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/dashboard">
            <Button variant="outline">
              View All Sensors
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;