import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Clock,
  Wind,
  Brain,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { getCurrentSensorData } from "@/data/sensorData";

const Predictions = () => {
  const [selectedHours, setSelectedHours] = useState([6]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const sensorData = useMemo(() => getCurrentSensorData(), []);
  
  const hoursToPredict = selectedHours[0];
  
  // Generate prediction data
  const predictionData = useMemo(() => {
    const hours = [];
    const currentTime = new Date();
    
    for (let i = 0; i <= hoursToPredict; i++) {
      const time = new Date(currentTime.getTime() + i * 60 * 60 * 1000);
      
      // Simulate prediction with some trends
      const baseMultiplier = 1 + (i * 0.1) + (Math.sin(i * 0.5) * 0.2);
      const avgPM25 = sensorData.reduce((sum, s) => sum + s.PM2_5, 0) / sensorData.length;
      const avgNO2 = sensorData.reduce((sum, s) => sum + s.NO2, 0) / sensorData.length;
      
      hours.push({
        hour: i,
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        fullTime: time.toLocaleString(),
        PM25_predicted: Math.round((avgPM25 * baseMultiplier) * 10) / 10,
        NO2_predicted: Math.round((avgNO2 * baseMultiplier) * 10) / 10,
        confidence: Math.max(0.6, 0.95 - (i * 0.05)),
        risk_trend: i < 3 ? 'increasing' : i < 6 ? 'stable' : 'decreasing'
      });
    }
    
    return hours;
  }, [sensorData, hoursToPredict]);

  // ML Model insights
  const modelInsights = useMemo(() => {
    const trends = predictionData.slice(-3);
    const avgIncrease = trends.reduce((sum, h, i) => {
      if (i === 0) return 0;
      return sum + (h.PM25_predicted - trends[i-1].PM25_predicted);
    }, 0) / (trends.length - 1);
    
    return {
      trend: avgIncrease > 1 ? 'increasing' : avgIncrease < -1 ? 'decreasing' : 'stable',
      confidence: Math.round(predictionData[predictionData.length - 1]?.confidence * 100) || 85,
      peakHour: predictionData.reduce((max, curr) => 
        curr.PM25_predicted > max.PM25_predicted ? curr : max
      ),
      riskZones: Math.ceil(predictionData[predictionData.length - 1]?.PM25_predicted / 25) || 2
    };
  }, [predictionData]);

  const locations = [
    { value: "all", label: "City-wide Average" },
    ...sensorData.map(sensor => ({
      value: sensor.device_id,
      label: sensor.location.name
    }))
  ];

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentFrame(0);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setCurrentFrame(0);
    setIsAnimating(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pollution Predictions</h1>
          <p className="text-muted-foreground">AI-powered forecasting of air quality and health risks</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Brain className="w-3 h-3" />
            <span>ML Model v2.1</span>
          </Badge>
        </div>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="w-4 h-4 mr-2 text-primary" />
              Model Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelInsights.confidence}%</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              {modelInsights.trend === 'increasing' ? (
                <TrendingUp className="w-4 h-4 mr-2 text-air-quality-unhealthy" />
              ) : modelInsights.trend === 'decreasing' ? (
                <TrendingDown className="w-4 h-4 mr-2 text-air-quality-good" />
              ) : (
                <Wind className="w-4 h-4 mr-2 text-air-quality-moderate" />
              )}
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{modelInsights.trend}</div>
            <p className="text-xs text-muted-foreground">Next {hoursToPredict}h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Peak Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelInsights.peakHour?.time}</div>
            <p className="text-xs text-muted-foreground">{modelInsights.peakHour?.PM25_predicted} μg/m³</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-air-quality-unhealthy" />
              Risk Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelInsights.riskZones}</div>
            <p className="text-xs text-muted-foreground">Predicted high-risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prediction Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Forecast Duration: {hoursToPredict} hours</label>
              <Slider
                value={selectedHours}
                onValueChange={setSelectedHours}
                max={24}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 hour</span>
                <span>12 hours</span>
                <span>24 hours</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Animation Controls */}
          <div className="flex items-center space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={isAnimating ? stopAnimation : startAnimation}
            >
              {isAnimating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play Animation
                </>
              )}
            </Button>
            
            <Button variant="outline" size="sm" onClick={resetAnimation}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Frame: {currentFrame}/{hoursToPredict}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PM2.5 Concentration Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${data.fullTime}` : value;
                  }}
                  formatter={(value, name) => [
                    `${value} μg/m³`,
                    name === 'PM25_predicted' ? 'PM2.5 Predicted' : name
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="PM25_predicted"
                  stroke="hsl(var(--air-quality-unhealthy))"
                  fill="hsl(var(--air-quality-unhealthy) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">NO₂ Levels & Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="NO2_predicted"
                  stroke="hsl(var(--air-quality-moderate))"
                  strokeWidth={2}
                  name="NO₂ (ppb)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="confidence"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Confidence"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hourly Prediction Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictionData.slice(0, 8).map((hour, index) => (
              <Card key={index} className="bg-muted/20">
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="font-semibold">{hour.time}</div>
                    <div className="text-2xl font-bold">{hour.PM25_predicted}</div>
                    <div className="text-xs text-muted-foreground">μg/m³ PM2.5</div>
                    
                    <div className="flex items-center justify-center space-x-1">
                      {hour.risk_trend === 'increasing' ? (
                        <TrendingUp className="w-3 h-3 text-air-quality-unhealthy" />
                      ) : hour.risk_trend === 'decreasing' ? (
                        <TrendingDown className="w-3 h-3 text-air-quality-good" />
                      ) : (
                        <Wind className="w-3 h-3 text-air-quality-moderate" />
                      )}
                      <span className="text-xs capitalize">{hour.risk_trend}</span>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-medium">{Math.round(hour.confidence * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Input Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Current pollutant levels (PM2.5, PM10, NO₂, CO)</li>
                <li>• Meteorological data (temperature, humidity, wind)</li>
                <li>• Traffic patterns and density</li>
                <li>• Historical pollution trends</li>
                <li>• Seasonal and time-of-day factors</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Model Architecture</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• XGBoost ensemble model</li>
                <li>• LSTM for temporal patterns</li>
                <li>• Attention mechanism for feature importance</li>
                <li>• Bayesian optimization for hyperparameters</li>
                <li>• Real-time model updating</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Performance Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mean Absolute Error: 3.2 μg/m³</li>
                <li>• R² Score: 0.89</li>
                <li>• Prediction Accuracy: 87%</li>
                <li>• Alert Precision: 94%</li>
                <li>• Last Updated: 2 hours ago</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Predictions;