import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Garage from "./pages/Garage";
import RaceSelect from "./pages/RaceSelect";
import Customize from "./pages/Customize";
import StoryMode from "./pages/StoryMode";
import VSBattle from "./pages/VSBattle";
import GhostBattle from "./pages/GhostBattle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/race-select" element={<RaceSelect />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/race/story" element={<StoryMode />} />
          <Route path="/race/vs" element={<VSBattle />} />
          <Route path="/race/ghost" element={<GhostBattle />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
