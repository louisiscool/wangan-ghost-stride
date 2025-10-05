import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ArrowLeft, Zap, Weight, Wind, CircleDot } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface CarData {
  id: string;
  car_name: string;
  manufacturer: string;
  model: string;
  hp: number;
  weight: number;
  aero: number;
  tire: number;
  mileage: number;
}

const Customize = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [car, setCar] = useState<CarData | null>(null);
  const [hp, setHp] = useState(300);
  const [weight, setWeight] = useState(1200);
  const [aero, setAero] = useState(0);
  const [tire, setTire] = useState(0);

  useEffect(() => {
    const setupAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (!currentSession) {
        navigate("/auth");
        return;
      }

      loadCarData(currentSession);
    };

    setupAuth();
  }, [navigate]);

  const loadCarData = async (session: Session) => {
    try {
      const { data: playerData } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!playerData) return;

      const { data: carData, error } = await supabase
        .from("cars")
        .select("*")
        .eq("player_id", playerData.id)
        .eq("is_active", true)
        .single();

      if (error) throw error;

      if (carData) {
        setCar(carData);
        setHp(carData.hp);
        setWeight(carData.weight);
        setAero(carData.aero);
        setTire(carData.tire);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!car) return;

    try {
      const { error } = await supabase
        .from("cars")
        .update({
          hp,
          weight,
          aero,
          tire,
        })
        .eq("id", car.id);

      if (error) throw error;

      toast.success("Tuning saved successfully!");
      navigate("/garage");
    } catch (error: any) {
      toast.error("Failed to save tuning");
      console.error(error);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-2xl neon-text">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 speed-lines opacity-20" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate("/garage")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Garage
          </Button>
        </div>

        <h1 className="text-4xl font-bold neon-text text-primary mb-8 text-center">
          TUNING SHOP
        </h1>

        <Card className="neon-border bg-card/80 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-primary">{car.car_name}</CardTitle>
            <CardDescription>
              {car.manufacturer} {car.model} • {car.mileage.toLocaleString()} km
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                Engine Power
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-center">{hp} HP</div>
              <Slider
                value={[hp]}
                onValueChange={(value) => setHp(value[0])}
                min={200}
                max={800}
                step={10}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">
                Increase top speed and acceleration
              </p>
            </CardContent>
          </Card>

          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Weight className="h-5 w-5" />
                Weight Reduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-center">{weight} kg</div>
              <Slider
                value={[weight]}
                onValueChange={(value) => setWeight(value[0])}
                min={800}
                max={1600}
                step={50}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">
                Improve handling and cornering
              </p>
            </CardContent>
          </Card>

          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Wind className="h-5 w-5" />
                Aerodynamics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-center">Level {aero}</div>
              <Slider
                value={[aero]}
                onValueChange={(value) => setAero(value[0])}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">
                Enhance high-speed stability
              </p>
            </CardContent>
          </Card>

          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CircleDot className="h-5 w-5" />
                Tire Grip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-center">Level {tire}</div>
              <Slider
                value={[tire]}
                onValueChange={(value) => setTire(value[0])}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">
                Better traction and control
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="neon" size="lg" onClick={handleSave}>
            SAVE TUNING
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Customize;
