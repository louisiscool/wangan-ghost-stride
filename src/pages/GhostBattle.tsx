import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ghost } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CarData {
  manufacturer: string;
  model: string;
  color: string;
  hp: number;
}

const Car3D = ({ carData, position, isGhost }: { carData: CarData | null; position: [number, number, number]; isGhost?: boolean }) => {
  const color = carData?.color || "#00ffff";

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.5, 4.2]} />
        <meshStandardMaterial 
          color={isGhost ? "#ffffff" : color} 
          metalness={0.9} 
          roughness={0.1}
          transparent={isGhost}
          opacity={isGhost ? 0.3 : 1}
        />
      </mesh>
      <mesh position={[0, 0.75, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.3, 2.5]} />
        <meshStandardMaterial 
          color={isGhost ? "#ffffff" : color}
          metalness={0.9}
          roughness={0.1}
          transparent={isGhost}
          opacity={isGhost ? 0.3 : 1}
        />
      </mesh>
      <pointLight position={[0, -0.2, 0]} color={isGhost ? "#ffffff" : "#ff00ff"} intensity={3} distance={4} />
    </group>
  );
};

const GhostBattle = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState<CarData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadCarData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: playerData } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!playerData) return;

      const { data: car } = await supabase
        .from("cars")
        .select("manufacturer, model, color, hp")
        .eq("player_id", playerData.id)
        .eq("is_active", true)
        .maybeSingle();

      if (car) setCarData(car);
    };

    loadCarData();

    if (!audioRef.current) {
      audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[20, 100]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>

          <Car3D carData={carData} position={[-2, 0, 2]} />
          <Car3D carData={carData} position={[2, 0, 0]} isGhost />
          
          <Environment preset="night" />
          <fog attach="fog" args={['#0a0520', 10, 50]} />
        </Canvas>
      </div>

      <div className="relative z-10 p-6">
        <Button variant="outline" onClick={() => navigate("/race-select")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Race Select
        </Button>

        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold neon-text text-accent mb-4 flex items-center justify-center gap-2">
            <Ghost className="h-10 w-10" />
            GHOST BATTLE
          </h1>
          {carData && (
            <p className="text-muted-foreground mb-4">
              {carData.manufacturer} {carData.model} • {carData.hp} HP
            </p>
          )}
          <p className="text-muted-foreground mb-8">Challenge the fastest ghosts</p>
          <Button variant="neon" size="lg">SELECT GHOST</Button>
        </div>
      </div>
    </div>
  );
};

export default GhostBattle;
