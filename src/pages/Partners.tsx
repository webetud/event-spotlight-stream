import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Tables } from "@/integrations/supabase/types";
import { ExternalLink } from "lucide-react";

type Partner = Tables<"partners">;

const Partners = () => {
  const { t } = useI18n();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase.from("partners").select("*").order("display_order").then(({ data }) => {
      setPartners(data || []);
    });
  }, []);

  const sponsors = partners.filter((p) => p.category === "sponsor");
  const media = partners.filter((p) => p.category === "media");

  return (
    <PublicLayout>
      <section className="container py-12 md:py-16">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          {t("nav.partners")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("pt.subtitle")}</p>

        {sponsors.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-7 bg-gradient-accent rounded-full" />
              {t("pt.sponsors")}
            </h2>
            <PartnerGrid items={sponsors} />
          </div>
        )}

        {media.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-7 bg-gradient-accent rounded-full" />
              {t("pt.media")}
            </h2>
            <PartnerGrid items={media} />
          </div>
        )}
      </section>
    </PublicLayout>
  );
};

function PartnerGrid({ items }: { items: Partner[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((p) => {
        const Inner = (
          <div className="group aspect-[4/3] rounded-xl bg-gradient-card border border-border p-5 flex flex-col items-center justify-center gap-3 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-spring text-center">
            {p.logo_url ? (
              <img src={p.logo_url} alt={p.name} className="max-h-16 object-contain" loading="lazy" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center text-white font-bold">
                {p.name[0]}
              </div>
            )}
            <div className="text-sm font-semibold leading-tight">{p.name}</div>
            {p.website_url && (
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-smooth" />
            )}
          </div>
        );
        return p.website_url ? (
          <a key={p.id} href={p.website_url} target="_blank" rel="noreferrer">{Inner}</a>
        ) : (
          <div key={p.id}>{Inner}</div>
        );
      })}
    </div>
  );
}

export default Partners;
