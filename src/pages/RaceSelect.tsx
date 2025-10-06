import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Users, Ghost } from "lucide-react";

const RaceSelect = () => {
  const navigate = useNavigate();

  const raceMode = [
    {
      title: "STORY MODE",
      description: "Battle through chapters and defeat rivals",
      icon: User,
      color: "primary",
      route: "/race/story"
    },
    {
      title: "VS BATTLE",
      description: "Race against other players",
      icon: Users,
      color: "secondary",
      route: "/race/vs"
    },
    {
      title: "GHOST BATTLE",
      description: "Challenge recorded ghost data",
      icon: Ghost,
      color: "accent",
      route: "/race/ghost"
    }
  ];

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 speed-lines opacity-20" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate("/garage")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Garage
          </Button>
        </div>

        <h1 className="text-4xl font-bold neon-text text-primary mb-8 text-center">
          SELECT RACE MODE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {raceMode.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.title}
                className="neon-border bg-card/80 backdrop-blur cursor-pointer hover:scale-105 transition-all"
                onClick={() => navigate(mode.route)}
              >
                <CardHeader>
                  <div className="mb-4">
                    <Icon className={`h-16 w-16 mx-auto text-${mode.color}`} />
                  </div>
                  <CardTitle className={`text-${mode.color} text-center`}>
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="neon" className="w-full">
                    START
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <Card className="neon-border bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-primary">COURSE SELECT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "C1 Inner Loop", length: "8.0 km", route: "/race/story?course=c1-inner" },
                  { name: "C1 Outer Loop", length: "8.0 km", route: "/race/story?course=c1-outer" },
                  { name: "Wangan Line", length: "12.9 km", route: "/race/story?course=wangan" },
                  { name: "Yokohane Up", length: "15.2 km", route: "/race/story?course=yokohane-up" },
                  { name: "Yokohane Down", length: "15.2 km", route: "/race/story?course=yokohane-down" },
                  { name: "Osaka Loop", length: "9.8 km", route: "/race/story?course=osaka" }
                ].map((course) => (
                  <Button
                    key={course.name}
                    variant="outline"
                    className="justify-between h-auto py-4"
                    onClick={() => navigate(course.route)}
                  >
                    <span className="font-bold">{course.name}</span>
                    <span className="text-muted-foreground">{course.length}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RaceSelect;
