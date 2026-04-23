import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AttendanceCounter } from "@/components/AttendanceCounter";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Play, ArrowRight, Sparkles } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import heroBg from "@/assets/hero-bg.jpg";

type Settings = Tables<"event_settings">;
type PastEvent = Tables<"past_events">;

const Home = () => {
  const { t, pick } = useI18n();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      const [s, p] = await Promise.all([
        supabase.from("event_settings").select("*").limit(1).maybeSingle(),
        supabase.from("past_events").select("*").order("display_order"),
      ]);
      setSettings(s.data);
      setPastEvents(p.data || []);
    };
    load();

    const ch = supabase
      .channel("home-settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "event_settings" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" width={1920} height={1080} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-background" />
        </div>

        <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent-glow" />
              {settings?.event_date || "Mai 2026"}
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight animate-fade-in-up">
              {settings ? pick(settings.event_name, settings.event_name_en) : "JNCM 2026"}
            </h1>

            <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              {settings ? pick(settings.description, settings.description_en) : ""}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
              {settings?.event_date && (
                <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> {settings.event_date}</span>
              )}
              {settings?.event_location && (
                <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {settings.event_location}</span>
              )}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              {settings?.registration_url && (
                <a href={settings.registration_url} target="_blank" rel="noreferrer">
                  <Button size="lg" className="bg-accent hover:bg-accent-glow text-accent-foreground font-semibold text-base px-8 h-12 shadow-glow">
                    {t("home.register")} <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </a>
              )}
              <Link to="/timeline">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-semibold text-base px-8 h-12">
                  {t("home.see_program")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Attendance counter floating */}
          <div className="mt-16 flex justify-center animate-scale-in">
            <AttendanceCounter />
          </div>
        </div>
      </section>

      {/* LIVE STREAM */}
      <section className="container py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-accent rounded-full" />
            <h2 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Play className="w-6 h-6 text-accent" />
              {t("home.live_stream")}
            </h2>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant border border-border bg-black">
            {settings?.youtube_url ? (
              <iframe
                src={settings.youtube_url}
                title="Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                Pas de diffusion en cours
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PAST EVENTS */}
      {pastEvents.length > 0 && (
        <section className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-accent rounded-full" />
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t("home.past_events")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pastEvents.map((e) => (
              <article key={e.id} className="group rounded-2xl overflow-hidden bg-gradient-card border border-border shadow-soft hover:shadow-elegant transition-spring hover:-translate-y-1">
                <div className="aspect-[16/10] bg-gradient-hero relative overflow-hidden">
                  {e.image_url ? (
                    <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-spring" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40 font-display text-3xl font-bold">
                      {e.title.split(" ").pop()}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg">{pick(e.title, e.title_en)}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {e.event_date && <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{e.event_date}</span>}
                    {e.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{e.location}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
};

export default Home;
