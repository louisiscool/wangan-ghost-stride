import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const popularCars = [
  { manufacturer: "Nissan", model: "GT-R R35", hp: 485 },
  { manufacturer: "Nissan", model: "Skyline GT-R R34", hp: 280 },
  { manufacturer: "Mazda", model: "RX-7 FD3S", hp: 280 },
  { manufacturer: "Toyota", model: "Supra A80", hp: 280 },
  { manufacturer: "Honda", model: "NSX NA1", hp: 270 },
  { manufacturer: "Mitsubishi", model: "Lancer Evolution IX", hp: 280 },
  { manufacturer: "Subaru", model: "Impreza WRX STI", hp: 300 },
  { manufacturer: "Nissan", model: "Fairlady Z Z33", hp: 280 },
];

const AddCar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [carName, setCarName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("#00FFFF");

  useEffect(() => {
    const setupAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (!currentSession) {
        navigate("/auth");
      }
    };

    setupAuth();
  }, [navigate]);

  const handleQuickSelect = (car: typeof popularCars[0]) => {
    setManufacturer(car.manufacturer);
    setModel(car.model);
    setCarName(`${car.manufacturer} ${car.model}`);
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!session) {
        toast.error("Please login first");
        navigate("/auth");
        return;
      }

      const { data: playerData } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!playerData) {
        toast.error("Player profile not found");
        return;
      }

      // Deactivate all current cars
      await supabase
        .from("cars")
        .update({ is_active: false })
        .eq("player_id", playerData.id);

      // Add new car
      const { error } = await supabase
        .from("cars")
        .insert({
          player_id: playerData.id,
          car_name: carName,
          manufacturer: manufacturer,
          model: model,
          color: color,
          hp: 300,
          weight: 1200,
          aero: 0,
          tire: 0,
          mileage: 0,
          is_active: true,
        });

      if (error) throw error;

      toast.success("Car added to garage!");
      navigate("/garage");
    } catch (error: any) {
      toast.error(error.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

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
          ADD NEW CAR
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-primary">Quick Select</CardTitle>
              <CardDescription>Choose from popular JDM models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {popularCars.map((car, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickSelect(car)}
                >
                  <span className="font-bold mr-2">{car.manufacturer}</span>
                  {car.model}
                  <span className="ml-auto text-muted-foreground">{car.hp} HP</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-primary">Car Details</CardTitle>
              <CardDescription>Customize your new machine</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carName">Car Name</Label>
                  <Input
                    id="carName"
                    placeholder="My GT-R"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                    required
                    className="bg-muted/50 border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    placeholder="Nissan"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    required
                    className="bg-muted/50 border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="GT-R R35"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    className="bg-muted/50 border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Neon Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-20 h-10 p-1 bg-muted/50 border-primary/30"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 bg-muted/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="neon"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding to Garage...
                    </>
                  ) : (
                    <>ADD TO GARAGE</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
