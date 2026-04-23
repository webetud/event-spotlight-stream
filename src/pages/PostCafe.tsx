import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Tables } from "@/integrations/supabase/types";
import { ChevronDown, Coffee, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Club = Tables<"clubs">;

const PostCafe = () => {
  const { t, pick } = useI18n();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("clubs").select("*").order("display_order").then(({ data }) => {
      setClubs(data || []);
    });
  }, []);

  return (
    <PublicLayout>
      <section className="container py-12 md:py-16">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-accent w-12 h-12 rounded-xl flex items-center justify-center shadow-glow">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
              {t("pc.title")}
            </h1>
          </div>
        </div>
        <p className="mt-3 text-muted-foreground">{t("pc.subtitle")}</p>

        <div className="mt-10 space-y-3">
          {clubs.map((c) => {
            const expanded = openId === c.id;
            return (
              <div key={c.id} className="rounded-2xl bg-gradient-card border border-border shadow-soft overflow-hidden transition-spring">
                <button
                  onClick={() => setOpenId(expanded ? null : c.id)}
                  className="w-full p-5 md:p-6 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-smooth"
                >
                  <div className="flex items-center gap-4 text-left">
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.name} className="w-12 h-12 rounded-lg object-contain bg-secondary" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center text-white font-bold">
                        {c.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-lg">{pick(c.name, c.name_en)}</h3>
                      {c.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {pick(c.description, c.description_en)}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 shrink-0 transition-smooth", expanded && "rotate-180 text-accent")} />
                </button>

                {expanded && (
                  <div className="px-5 md:px-6 pb-6 animate-fade-in">
                    {c.gallery_urls && c.gallery_urls.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {c.gallery_urls.map((url, i) => (
                          <button key={i} onClick={() => setZoomed(url)} className="aspect-square rounded-lg overflow-hidden bg-secondary hover:opacity-90 transition-smooth">
                            <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Galerie à venir.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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

export default PostCafe;
