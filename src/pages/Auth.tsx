import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/garage");
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!accessCode) {
        toast.error("Please enter your access code");
        setLoading(false);
        return;
      }

      toast.loading("Receiving data from server...");

      // Check if player exists with this access code
      const { data: existingPlayer, error: queryError } = await supabase
        .from("players")
        .select("*")
        .eq("access_code", accessCode)
        .maybeSingle();

      if (queryError) throw queryError;

      if (existingPlayer) {
        // Player exists - sign in with existing account
        const email = `${accessCode}@wangan.local`;
        const password = accessCode;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast.dismiss();
        toast.success(`Data received! Welcome back, ${existingPlayer.player_name}!`);
        navigate("/garage");
      } else {
        // New player - create account
        const email = `${accessCode}@wangan.local`;
        const password = accessCode;
        const playerName = `RACER_${accessCode.slice(0, 4)}`;

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("players")
            .insert({
              user_id: authData.user.id,
              access_code: accessCode,
              player_name: playerName,
            });

          if (profileError) throw profileError;

          toast.dismiss();
          toast.success(`Data received! New profile created for ${playerName}!`);
          navigate("/garage");
        }
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to receive data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 speed-lines opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
      
      <Card className="w-full max-w-md relative z-10 neon-border bg-card/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold neon-text text-primary">
            BANAPASSPORT SYSTEM
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Insert your card to receive data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-primary">Access Code</Label>
              <Input
                id="accessCode"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="bg-muted/50 border-primary/30 focus:border-primary text-center text-xl tracking-wider font-mono"
                maxLength={19}
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter your Banapassport access code
              </p>
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
                  Receiving data...
                </>
              ) : (
                <>INSERT CARD</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
