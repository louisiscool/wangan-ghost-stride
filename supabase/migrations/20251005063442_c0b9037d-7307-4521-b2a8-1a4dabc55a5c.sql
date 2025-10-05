-- Create players table for Banapassport user data
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  access_code TEXT NOT NULL UNIQUE,
  player_name TEXT NOT NULL,
  title TEXT DEFAULT 'Rookie Racer',
  total_mileage INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cars table
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  car_name TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT DEFAULT '#FFFFFF',
  hp INTEGER DEFAULT 300,
  weight INTEGER DEFAULT 1200,
  aero INTEGER DEFAULT 0,
  tire INTEGER DEFAULT 0,
  mileage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ghost_records table for saving race replays
CREATE TABLE public.ghost_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  course TEXT NOT NULL,
  time_ms INTEGER NOT NULL,
  max_speed INTEGER NOT NULL,
  replay_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghost_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for players
CREATE POLICY "Users can view their own player profile"
  ON public.players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own player profile"
  ON public.players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player profile"
  ON public.players FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for cars
CREATE POLICY "Users can view their own cars"
  ON public.cars FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.players
    WHERE players.id = cars.player_id AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own cars"
  ON public.cars FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.players
    WHERE players.id = player_id AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own cars"
  ON public.cars FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.players
    WHERE players.id = cars.player_id AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own cars"
  ON public.cars FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.players
    WHERE players.id = cars.player_id AND players.user_id = auth.uid()
  ));

-- RLS Policies for ghost_records (readable by all, writable by owner)
CREATE POLICY "Ghost records are viewable by everyone"
  ON public.ghost_records FOR SELECT
  USING (true);

CREATE POLICY "Users can insert ghost records for their own cars"
  ON public.ghost_records FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cars
    JOIN public.players ON cars.player_id = players.id
    WHERE cars.id = car_id AND players.user_id = auth.uid()
  ));

-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();