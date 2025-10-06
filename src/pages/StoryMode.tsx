import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { useRef } from "react";

const Car3D = () => {
  const carRef = useRef<any>();

  return (
    <group ref={carRef}>
      {/* Car Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 4]} />
        <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car Hood */}
      <mesh position={[0, 0.6, 1]}>
        <boxGeometry args={[1.8, 0.4, 2]} />
        <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.9, 0, 1.3],
        [0.9, 0, 1.3],
        [-0.9, 0, -1.3],
        [0.9, 0, -1.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Neon Underglow */}
      <pointLight position={[0, -0.2, 0]} color="#ff00ff" intensity={2} distance={3} />
    </group>
  );
};

const Road3D = () => {
  return (
    <>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Road Lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, -0.49, -5 + i * 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 2]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Barriers */}
      {[-8, 8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.5, 1, 100]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      ))}
    </>
  );
};

const StoryMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 3, 8]} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} />
          
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          <Road3D />
          <Car3D />
          
          <Environment preset="night" />
          <fog attach="fog" args={['#000000', 10, 50]} />
        </Canvas>
      </div>

      <div className="relative z-10 p-6">
        <Button variant="outline" onClick={() => navigate("/race-select")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Race Select
        </Button>

        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold neon-text text-primary mb-4">STORY MODE</h1>
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
