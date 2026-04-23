import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SpeakerCard } from "@/components/SpeakerCard";
import { Button } from "@/components/ui/button";
import { Download, Coffee } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Speaker = Tables<"speakers">;

const Timeline = () => {
  const { t } = useI18n();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [programUrl, setProgramUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [sp, set] = await Promise.all([
        supabase.from("speakers").select("*"),
        supabase.from("event_settings").select("program_pdf_url").limit(1).maybeSingle(),
      ]);
      setSpeakers(sortSpeakers(sp.data || []));
      setProgramUrl(set.data?.program_pdf_url || null);
    };
    load();

    const ch = supabase
      .channel("timeline-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "speakers" }, async () => {
        const { data } = await supabase.from("speakers").select("*");
        setSpeakers(sortSpeakers(data || []));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "event_settings" }, async () => {
        const { data } = await supabase.from("event_settings").select("program_pdf_url").limit(1).maybeSingle();
        setProgramUrl(data?.program_pdf_url || null);
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <PublicLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            {t("tl.title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">{t("tl.subtitle")}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {programUrl && (
            <a href={programUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                {t("tl.download_program")}
              </Button>
            </a>
          )}
          <Link to="/post-cafe">
            <Button className="bg-gradient-accent gap-2 text-white border-0">
              <Coffee className="w-4 h-4" />
              {t("tl.go_postcafe")}
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {speakers.map((s) => (
            <div key={s.id} className="animate-fade-in-up">
              <SpeakerCard speaker={s} />
            </div>
          ))}
        </div>

        {speakers.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">Aucun conférencier pour l'instant.</p>
        )}
      </section>
    </PublicLayout>
  );
};

function sortSpeakers(list: Speaker[]): Speaker[] {
  return [...list].sort((a, b) => {
    if (a.is_live && !b.is_live) return -1;
    if (!a.is_live && b.is_live) return 1;
    return a.display_order - b.display_order;
  });
}

export default Timeline;
