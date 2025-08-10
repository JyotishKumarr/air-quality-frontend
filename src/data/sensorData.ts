// Mock sensor data for CharSense platform
export interface SensorReading {
  device_id: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  PM2_5: number;
  PM10: number;
  NO2: number;
  CO: number;
  CO2: number;
  temperature: number;
  humidity: number;
  risk_level: 'low' | 'moderate' | 'high' | 'hazardous';
  risk_score: number;
}

// Generate realistic sensor readings
export const generateMockReading = (deviceId: string, location: any): SensorReading => {
  const baseTime = new Date();
  const variation = () => (Math.random() - 0.5) * 0.2;
  
  // Different pollution levels based on location type
  const locationMultipliers = {
    highway: { PM2_5: 1.8, PM10: 2.1, NO2: 2.5, CO: 1.9 },
    residential: { PM2_5: 1.0, PM10: 1.1, NO2: 1.2, CO: 1.0 },
    industrial: { PM2_5: 2.2, PM10: 2.8, NO2: 3.1, CO: 2.4 },
    park: { PM2_5: 0.6, PM10: 0.7, NO2: 0.5, CO: 0.4 },
  };
  
  const multiplier = locationMultipliers[location.type as keyof typeof locationMultipliers] || locationMultipliers.residential;
  
  const PM2_5 = Math.max(5, (35 + variation() * 20) * multiplier.PM2_5);
  const PM10 = Math.max(8, PM2_5 * 1.5 * multiplier.PM10);
  const NO2 = Math.max(5, (25 + variation() * 15) * multiplier.NO2);
  const CO = Math.max(1, (8 + variation() * 5) * multiplier.CO);
  const CO2 = 380 + Math.random() * 120;
  
  // Calculate risk score based on WHO guidelines
  const pm25Risk = PM2_5 > 75 ? 4 : PM2_5 > 35 ? 3 : PM2_5 > 15 ? 2 : 1;
  const no2Risk = NO2 > 100 ? 4 : NO2 > 50 ? 3 : NO2 > 25 ? 2 : 1;
  const coRisk = CO > 30 ? 4 : CO > 15 ? 3 : CO > 8 ? 2 : 1;
  
  const riskScore = Math.max(pm25Risk, no2Risk, coRisk);
  const riskLevel = riskScore >= 4 ? 'hazardous' : riskScore >= 3 ? 'high' : riskScore >= 2 ? 'moderate' : 'low';
  
  return {
    device_id: deviceId,
    timestamp: baseTime.toISOString(),
    location,
    PM2_5: Math.round(PM2_5 * 10) / 10,
    PM10: Math.round(PM10 * 10) / 10,
    NO2: Math.round(NO2 * 10) / 10,
    CO: Math.round(CO * 10) / 10,
    CO2: Math.round(CO2),
    temperature: Math.round((28 + variation() * 8) * 10) / 10,
    humidity: Math.round((55 + variation() * 20) * 10) / 10,
    risk_level: riskLevel,
    risk_score: riskScore,
  };
};

// Mock sensor locations across a city
export const sensorLocations = [
  { id: "charsense_001", lat: 17.385044, lng: 78.486671, name: "Hyderabad Central", type: "highway" },
  { id: "charsense_002", lat: 17.402760, lng: 78.474578, name: "Banjara Hills", type: "residential" },
  { id: "charsense_003", lat: 17.360589, lng: 78.478890, name: "Industrial Area", type: "industrial" },
  { id: "charsense_004", lat: 17.425288, lng: 78.450549, name: "Jubilee Hills", type: "residential" },
  { id: "charsense_005", lat: 17.373819, lng: 78.500671, name: "KBR Park", type: "park" },
  { id: "charsense_006", lat: 17.453285, lng: 78.384997, name: "Airport Road", type: "highway" },
  { id: "charsense_007", lat: 17.396454, lng: 78.520654, name: "Secunderabad", type: "residential" },
  { id: "charsense_008", lat: 17.342534, lng: 78.455213, name: "Gachibowli", type: "residential" },
];

// Generate current readings for all sensors
export const getCurrentSensorData = (): SensorReading[] => {
  return sensorLocations.map(location => 
    generateMockReading(location.id, location)
  );
};

// Generate historical data for charts
export const getHistoricalData = (deviceId: string, hours: number = 24) => {
  const data = [];
  const location = sensorLocations.find(loc => loc.id === deviceId);
  if (!location) return [];
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(Date.now() - i * 60 * 60 * 1000);
    const reading = generateMockReading(deviceId, location);
    reading.timestamp = timestamp.toISOString();
    data.push(reading);
  }
  
  return data;
};