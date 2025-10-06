import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as THREE from "three";

interface CarData {
  manufacturer: string;
  model: string;
  color: string;
  hp: number;
}

const Car3D = ({ carData }: { carData: CarData | null }) => {
  const carRef = useRef<THREE.Group>(null);
  const color = carData?.color || "#00ffff";

  useEffect(() => {
    if (carRef.current) {
      carRef.current.position.z = 2;
    }
  }, []);

  return (
    <group ref={carRef}>
      {/* Car Body - Main chassis */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.5, 4.2]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Car Hood/Roof */}
      <mesh position={[0, 0.75, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.3, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.9, 1.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.8]} />
        <meshStandardMaterial color="#000033" transparent opacity={0.3} metalness={1} roughness={0} />
      </mesh>

      {/* Spoiler */}
      <mesh position={[0, 1, -2]} castShadow>
        <boxGeometry args={[1.8, 0.1, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
      </mesh>

      {/* Front Bumper */}
      <mesh position={[0, 0.2, 2.3]}>
        <boxGeometry args={[1.9, 0.3, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Wheels */}
      {[
        [-0.85, 0, 1.5],
        [0.85, 0, 1.5],
        [-0.85, 0, -1.5],
        [0.85, 0, -1.5],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.27, 5]} />
            <meshStandardMaterial color="#808080" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={`headlight-${i}`} position={[x, 0.5, 2.1]}>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshStandardMaterial color="#ffff99" emissive="#ffff99" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Taillights */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={`taillight-${i}`} position={[x, 0.5, -2.1]}>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
        </mesh>
      ))}

      {/* Neon Underglow */}
      <pointLight position={[0, -0.2, 0]} color="#ff00ff" intensity={3} distance={4} />
      <pointLight position={[0, -0.2, 1.5]} color="#00ffff" intensity={2} distance={3} />
      <pointLight position={[0, -0.2, -1.5]} color="#ff00ff" intensity={2} distance={3} />
    </group>
  );
};

const CityBuilding = ({ position, height, color }: { position: [number, number, number], height: number, color: string }) => {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, height, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Building lights */}
      {Array.from({ length: Math.floor(height / 3) }).map((_, i) => (
        <pointLight
          key={i}
          position={[0, i * 3 - height / 2, 0]}
          color="#ffaa00"
          intensity={0.5}
          distance={10}
        />
      ))}
    </group>
  );
};

const Road3D = () => {
  return (
    <>
      {/* Main Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Road Center Line */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={`center-${i}`} position={[0, -0.49, -5 + i * 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 2]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Road Edge Lines */}
      {[-9, 9].map((x, idx) => (
        Array.from({ length: 40 }).map((_, i) => (
          <mesh key={`edge-${idx}-${i}`} position={[x, -0.49, -5 + i * 5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 2]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        ))
      ))}

      {/* Barriers */}
      {[-10, 10].map((x, i) => (
        <mesh key={`barrier-${i}`} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 1, 200]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* City Buildings - Left side */}
      {Array.from({ length: 10 }).map((_, i) => (
        <CityBuilding
          key={`left-${i}`}
          position={[-20 - Math.random() * 10, 0, i * 20 - 50]}
          height={15 + Math.random() * 25}
          color={`#${Math.floor(Math.random() * 3) === 0 ? '1a1a2e' : '16213e'}`}
        />
      ))}

      {/* City Buildings - Right side */}
      {Array.from({ length: 10 }).map((_, i) => (
        <CityBuilding
          key={`right-${i}`}
          position={[20 + Math.random() * 10, 0, i * 20 - 50]}
          height={15 + Math.random() * 25}
          color={`#${Math.floor(Math.random() * 3) === 0 ? '1a1a2e' : '16213e'}`}
        />
      ))}

      {/* Street Lights */}
      {Array.from({ length: 20 }).map((_, i) => (
        <>
          <mesh key={`pole-left-${i}`} position={[-11, 2, i * 10 - 50]}>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <pointLight
            key={`light-left-${i}`}
            position={[-11, 4, i * 10 - 50]}
            color="#ffeeaa"
            intensity={2}
            distance={15}
          />
          <mesh key={`pole-right-${i}`} position={[11, 2, i * 10 - 50]}>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <pointLight
            key={`light-right-${i}`}
            position={[11, 4, i * 10 - 50]}
            color="#ffeeaa"
            intensity={2}
            distance={15}
          />
        </>
      ))}

      {/* Neon Signs on buildings */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`sign-${i}`} position={[i % 2 === 0 ? -15 : 15, 8 + Math.random() * 10, i * 25 - 50]}>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#ff00ff" : i % 3 === 1 ? "#00ffff" : "#ffff00"}
            emissive={i % 3 === 0 ? "#ff00ff" : i % 3 === 1 ? "#00ffff" : "#ffff00"}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </>
  );
};

const StoryMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

    // Play background music
    if (!audioRef.current) {
      audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const course = searchParams.get("course") || "wangan";

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 20, 5]} intensity={0.5} castShadow />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />
          
          <Road3D />
          <Car3D carData={carData} />
          
          <Environment preset="night" />
          <fog attach="fog" args={['#0a0520', 20, 100]} />
        </Canvas>
      </div>

      <div className="relative z-10 p-6">
        <Button variant="outline" onClick={() => navigate("/race-select")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Race Select
        </Button>

        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold neon-text text-primary mb-2">STORY MODE</h1>
          <p className="text-xl text-secondary mb-2">
            {course.toUpperCase().replace("-", " ")}
          </p>
          {carData && (
            <p className="text-muted-foreground mb-4">
              {carData.manufacturer} {carData.model} • {carData.hp} HP
            </p>
          )}
          <p className="text-muted-foreground mb-8">Chapter 1: The Beginning</p>
          
          <div className="max-w-md mx-auto space-y-4">
            <Button variant="neon" className="w-full" size="lg">
              START RACE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryMode;
