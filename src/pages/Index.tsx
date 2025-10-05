import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import wanganHero from "@/assets/wangan-hero.jpg";
import { Car, Zap, Trophy } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/garage");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${wanganHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="absolute inset-0 speed-lines opacity-30" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8 space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold neon-text text-primary animate-fade-in">
            WANGAN MIDNIGHT
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-secondary neon-text">
            MAXIMUM TUNE 6
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Race through Tokyo's highways. Build your legend. Challenge the fastest.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button 
            variant="neon" 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            INSERT CARD
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            GUEST PLAY
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur neon-border">
            <Car className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-lg mb-2">TUNE YOUR MACHINE</h3>
            <p className="text-sm text-muted-foreground">
              Customize and upgrade your dream car
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur neon-border">
            <Zap className="h-12 w-12 mx-auto mb-4 text-secondary" />
            <h3 className="font-bold text-lg mb-2">CONQUER THE WANGAN</h3>
            <p className="text-sm text-muted-foreground">
              Race on real Tokyo expressways
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur neon-border">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h3 className="font-bold text-lg mb-2">BATTLE GHOSTS</h3>
            <p className="text-sm text-muted-foreground">
              Challenge rivals from around the world
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
