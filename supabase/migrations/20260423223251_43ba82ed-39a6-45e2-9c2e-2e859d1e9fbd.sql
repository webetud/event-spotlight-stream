
-- ============ ENUM ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ EVENT SETTINGS (singleton) ============
CREATE TABLE public.event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL DEFAULT 'JNCM 2026',
  event_name_en TEXT,
  description TEXT,
  description_en TEXT,
  event_date TEXT,
  event_location TEXT,
  logo_url TEXT,
  attendance_count INTEGER NOT NULL DEFAULT 0,
  youtube_url TEXT,
  registration_url TEXT,
  program_pdf_url TEXT,
  news_ticker TEXT,
  news_ticker_en TEXT,
  news_ticker_active BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read event settings"
  ON public.event_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update event settings"
  ON public.event_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert event settings"
  ON public.event_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SPEAKERS ============
CREATE TABLE public.speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT,
  specialty_en TEXT,
  talk_title TEXT,
  talk_title_en TEXT,
  description TEXT,
  description_en TEXT,
  external_link TEXT,
  photo_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  scheduled_time TEXT,
  duration_minutes INTEGER DEFAULT 30,
  card_color TEXT DEFAULT '#002366',
  is_supervisor BOOLEAN NOT NULL DEFAULT false,
  is_live BOOLEAN NOT NULL DEFAULT false,
  live_started_at TIMESTAMPTZ,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read speakers"
  ON public.speakers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage speakers"
  ON public.speakers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PAST EVENTS ============
CREATE TABLE public.past_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  event_date TEXT,
  location TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.past_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read past events" ON public.past_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage past events" ON public.past_events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SPONSORS / MEDIA ============
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  category TEXT NOT NULL DEFAULT 'sponsor', -- sponsor | media
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read partners" ON public.partners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage partners" ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ CLUBS (Post-Café) ============
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  logo_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read clubs" ON public.clubs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage clubs" ON public.clubs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ ORGANIZERS ============
CREATE TABLE public.organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  role_en TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read organizers" ON public.organizers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage organizers" ON public.organizers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PORTFOLIO (organizer designs) ============
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  category TEXT, -- badge | poster | interface
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read portfolio" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage portfolio" ON public.portfolio_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ REALTIME ============
ALTER TABLE public.event_settings REPLICA IDENTITY FULL;
ALTER TABLE public.speakers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.speakers;

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('event-media', 'event-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read event-media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'event-media');

CREATE POLICY "Admins upload event-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update event-media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'event-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete event-media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'event-media' AND public.has_role(auth.uid(), 'admin'));

-- ============ AUTO-PROMOTE FIRST USER TO ADMIN ============
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First user becomes admin
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Seed singleton settings
INSERT INTO public.event_settings (event_name, event_name_en, description, description_en, event_date, event_location, attendance_count, youtube_url, registration_url, news_ticker, news_ticker_en, news_ticker_active)
VALUES (
  'JNCM 2026 — Journées Nationales de Cardiologie Moderne',
  'JNCM 2026 — National Days of Modern Cardiology',
  'Trois jours de conférences, ateliers et expositions réunissant les sommités de la cardiologie.',
  'Three days of lectures, workshops and exhibitions gathering leaders in cardiology.',
  '15 — 17 Mai 2026',
  'Palais des Congrès, Alger',
  0,
  'https://www.youtube.com/embed/jfKfPfyJRdk',
  'https://forms.google.com/jncm2026',
  'Bienvenue aux JNCM 2026 — La conférence du Pr. Benali commence dans 10 minutes en Salle A.',
  'Welcome to JNCM 2026 — Pr. Benali''s lecture starts in 10 minutes in Room A.',
  true
);
