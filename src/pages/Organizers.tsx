import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Tables } from "@/integrations/supabase/types";
import { Linkedin, Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Organizer = Tables<"organizers">;
type Item = Tables<"portfolio_items">;

const Organizers = () => {
  const { t, pick } = useI18n();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [zoomed, setZoomed] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("organizers").select("*").order("display_order"),
      supabase.from("portfolio_items").select("*").order("display_order"),
    ]).then(([o, p]) => {
      setOrganizers(o.data || []);
      setItems(p.data || []);
    });
  }, []);

  return (
    <PublicLayout>
      <section className="container py-12 md:py-16">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">{t("or.team")}</h1>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {organizers.map((o) => (
            <div key={o.id} className="rounded-2xl bg-gradient-card border border-border p-6 text-center shadow-soft hover:shadow-elegant transition-spring hover:-translate-y-1">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-accent flex items-center justify-center text-white font-display text-2xl font-bold overflow-hidden">
                {o.photo_url ? (
                  <img src={o.photo_url} alt={o.name} className="w-full h-full object-cover" />
                ) : (
                  o.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                )}
              </div>
              <h3 className="mt-4 font-display font-bold">{o.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pick(o.role, o.role_en)}</p>
              <div className="mt-4 flex justify-center gap-2">
                {o.linkedin_url && (
                  <a href={o.linkedin_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-smooth">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {o.facebook_url && (
                  <a href={o.facebook_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-smooth">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{t("or.portfolio")}</h2>
        <p className="mt-2 text-muted-foreground">{t("or.portfolio_sub")}</p>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <button
              key={p.id}
              onClick={() => p.image_url && setZoomed(p.image_url)}
              className="group rounded-2xl overflow-hidden bg-gradient-card border border-border shadow-soft hover:shadow-elegant transition-spring hover:-translate-y-1 text-left"
            >
              <div className="aspect-square bg-gradient-hero relative overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-spring" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/40 font-display text-2xl font-bold uppercase">
                    {p.category}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm">{pick(p.title, p.title_en)}</h3>
                {p.category && <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{p.category}</p>}
              </div>
            </button>
          ))}
        </div>
      </section>

      <Dialog open={!!zoomed} onOpenChange={(o) => !o && setZoomed(null)}>
        <DialogContent className="max-w-5xl p-2">
          <DialogTitle className="sr-only">Image</DialogTitle>
          {zoomed && <img src={zoomed} alt="Zoom" className="w-full h-auto rounded-md" />}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default Organizers;
