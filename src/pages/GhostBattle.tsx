import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";

const GhostBattle = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 3, 8]} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} />
          
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[20, 100]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
          
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
          <h1 className="text-4xl font-bold neon-text text-accent mb-4">GHOST BATTLE</h1>
          <p className="text-muted-foreground mb-8">Select a ghost to challenge</p>
        </div>
      </div>
    </div>
  );
};

export default GhostBattle;
