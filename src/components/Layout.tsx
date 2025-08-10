import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Settings,
  Wind,
  AlertTriangle
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [alertCount] = useState(3); // Mock alert count

  const navItems = [
    { path: "/", label: "Home", icon: MapPin },
    { path: "/dashboard", label: "Live Dashboard", icon: Activity },
    { path: "/map", label: "Risk Map", icon: BarChart3 },
    { path: "/predictions", label: "Predictions", icon: TrendingUp },
    { path: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Wind className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CharSense</h1>
                <p className="text-sm text-muted-foreground">Air Quality Monitoring</p>
              </div>
            </div>

            {/* Alert Banner */}
            {alertCount > 0 && (
              <Card className="px-4 py-2 bg-air-quality-unhealthy/10 border-air-quality-unhealthy/20">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-air-quality-unhealthy" />
                  <span className="text-sm font-medium text-air-quality-unhealthy">
                    {alertCount} High Risk Zones Detected
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-secondary/30 border-b border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`px-6 py-6 rounded-none border-b-2 transition-all ${
                      isActive 
                        ? "border-primary bg-primary/10" 
                        : "border-transparent hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;