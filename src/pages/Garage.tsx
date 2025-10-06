import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Car, LogOut, Plus, Settings, Trophy } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface Player {
  id: string;
  player_name: string;
  title: string;
  total_mileage: number;
  level: number;
}

interface CarData {
  id: string;
  car_name: string;
  manufacturer: string;
  model: string;
  color: string;
  hp: number;
  mileage: number;
  is_active: boolean;
}

const Garage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          if (!session) {
            navigate("/auth");
          }
        }
      );

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (!currentSession) {
        navigate("/auth");
      }

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      loadPlayerData();
    }
  }, [session]);

  const loadPlayerData = async () => {
    try {
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", session!.user.id)
        .single();

      if (playerError) throw playerError;
      setPlayer(playerData);

      const { data: carsData, error: carsError } = await supabase
        .from("cars")
        .select("*")
        .eq("player_id", playerData.id)
        .order("created_at", { ascending: false });

      if (carsError) throw carsError;
      setCars(carsData || []);
    } catch (error: any) {
      toast.error("Failed to load garage data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-2xl neon-text">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 speed-lines opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold neon-text text-primary mb-2">
              {player?.player_name}'s GARAGE
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {player?.title} • Level {player?.level} • {player?.total_mileage.toLocaleString()} km
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card 
            className="cursor-pointer hover:scale-105 transition-transform neon-border bg-card/80 backdrop-blur"
            onClick={() => navigate("/race-select")}
          >
            <CardHeader>
              <CardTitle className="text-primary">START RACE</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Enter the Wangan</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform neon-border bg-card/80 backdrop-blur"
            onClick={() => navigate("/customize")}
          >
            <CardHeader>
              <CardTitle className="text-secondary">CUSTOMIZE</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Tune your machine</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform neon-border bg-card/80 backdrop-blur"
            onClick={() => navigate("/race/ghost")}
          >
            <CardHeader>
              <CardTitle className="text-accent">GHOST BATTLE</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Challenge rivals</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">YOUR FLEET</h2>
            <Button variant="neon" onClick={() => navigate("/add-car")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Car
            </Button>
          </div>

          {cars.length === 0 ? (
            <Card className="neon-border bg-card/80 backdrop-blur">
              <CardContent className="py-12 text-center">
                <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No cars in garage. Add your first machine!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cars.map((car) => (
                <Card 
                  key={car.id}
                  className="neon-border bg-card/80 backdrop-blur hover:scale-105 transition-transform cursor-pointer"
                  style={{ borderColor: car.color }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{car.car_name}</span>
                      {car.is_active && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">ACTIVE</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{car.manufacturer} {car.model}</p>
                      <div className="flex justify-between">
                        <span>HP: {car.hp}</span>
                        <span>Mileage: {car.mileage} km</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="mr-1 h-3 w-3" />
                          Tune
                        </Button>
                        <Button size="sm" variant="default" className="flex-1">
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Garage;
