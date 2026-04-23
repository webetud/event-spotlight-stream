import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { useI18n } from "@/lib/i18n";
import { Clock, Image as ImageIcon, ExternalLink, ChevronDown } from "lucide-react";
import { Countdown } from "./Countdown";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Speaker = Tables<"speakers">;

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const { t, pick } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [zoomed, setZoomed] = useState<string | null>(null);

  const role = speaker.is_supervisor ? t("tl.supervisor") : t("tl.speaker");
  const accentStyle = { borderTopColor: speaker.card_color || "#002366" };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border-t-4 border border-border bg-gradient-card shadow-soft transition-spring",
        speaker.is_live
          ? "ring-2 ring-live shadow-live scale-[1.02]"
          : "hover:shadow-elegant hover:-translate-y-1"
      )}
      style={accentStyle}
    >
      {speaker.is_live && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-live text-live-foreground px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-live animate-live-glow">
          <span className="live-dot bg-white !w-1.5 !h-1.5" />
          {t("tl.live_now")}
        </div>
      )}

      <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-5">
        {/* Photo (supports transparent PNG) */}
        <div className="shrink-0 mx-auto sm:mx-0">
          <div
            className="w-28 h-28 md:w-32 md:h-32 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${speaker.card_color}22, ${speaker.card_color}08)` }}
          >
            {speaker.photo_url ? (
              <img
                src={speaker.photo_url}
                alt={speaker.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-white"
                style={{ background: speaker.card_color || "#002366" }}
              >
                {speaker.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: speaker.card_color || "#002366" }}
              >
                {role}
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold leading-tight">
                {speaker.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {pick(speaker.specialty, speaker.specialty_en)}
              </p>
            </div>

            {speaker.is_live ? (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-live font-bold">
                  {t("tl.remaining")}
                </div>
                <Countdown speaker={speaker} />
              </div>
            ) : (
              speaker.scheduled_time && (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 bg-secondary px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {speaker.scheduled_time}
                </div>
              )
            )}
          </div>

          {speaker.talk_title && (
            <p className="mt-3 font-medium text-sm md:text-base text-foreground leading-snug">
              « {pick(speaker.talk_title, speaker.talk_title_en)} »
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-secondary hover:bg-accent hover:text-accent-foreground transition-smooth"
            >
              <ChevronDown className={cn("w-3.5 h-3.5 transition-smooth", expanded && "rotate-180")} />
              {t("tl.read_more")}
            </button>

            {speaker.gallery_urls && speaker.gallery_urls.length > 0 && (
              <button
                onClick={() => setGalleryOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {t("tl.gallery")} ({speaker.gallery_urls.length})
              </button>
            )}

            {speaker.external_link && (
              <a
                href={speaker.external_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-secondary hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Link
              </a>
            )}
          </div>

          {expanded && speaker.description && (
            <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
              {pick(speaker.description, speaker.description_en)}
            </div>
          )}
        </div>
      </div>

      {/* Gallery dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>{speaker.name} — {t("tl.gallery")}</DialogTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {speaker.gallery_urls?.map((url, i) => (
              <button
                key={i}
                onClick={() => setZoomed(url)}
                className="aspect-square rounded-lg overflow-hidden bg-secondary hover:opacity-90 transition-smooth"
              >
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomed} onOpenChange={(o) => !o && setZoomed(null)}>
        <DialogContent className="max-w-5xl p-2">
          <DialogTitle className="sr-only">Image</DialogTitle>
          {zoomed && <img src={zoomed} alt="Zoom" className="w-full h-auto rounded-md" />}
        </DialogContent>
      </Dialog>
    </article>
  );
}
