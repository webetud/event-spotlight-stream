import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Minus, Save, Megaphone } from "lucide-react";
import { toast } from "sonner";

type Settings = Tables<"event_settings">;

export function RealtimeControls() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("event_settings").select("*").limit(1).maybeSingle().then(({ data }) => setS(data));
    const ch = supabase
      .channel("admin-settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "event_settings" }, ({ new: n }: any) => {
        if (n) setS(n);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (!s) return <div className="h-40 rounded-2xl bg-secondary animate-pulse" />;

  const update = async (patch: Partial<Settings>, silent = false) => {
    setSaving(true);
    const { error } = await supabase.from("event_settings").update(patch).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else if (!silent) toast.success("Mis à jour");
  };

  const adjust = (delta: number) => {
    const next = Math.max(0, (s.attendance_count || 0) + delta);
    setS({ ...s, attendance_count: next });
    update({ attendance_count: next }, true);
  };

  return (
    <div className="rounded-2xl bg-gradient-card border border-border p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold flex items-center gap-2">
        <span className="live-dot" /> Contrôles temps réel
      </h2>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Attendance */}
        <div>
          <Label className="text-xs uppercase tracking-wider">Compteur de présence</Label>
          <div className="mt-2 flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => adjust(-10)}><Minus className="w-4 h-4" />10</Button>
            <Button variant="outline" size="icon" onClick={() => adjust(-1)}><Minus className="w-4 h-4" /></Button>
            <Input
              type="number"
              value={s.attendance_count}
              onChange={(e) => setS({ ...s, attendance_count: Math.max(0, parseInt(e.target.value) || 0) })}
              onBlur={() => update({ attendance_count: s.attendance_count }, true)}
              className="text-center text-2xl font-bold font-display tabular-nums h-14"
            />
            <Button variant="outline" size="icon" onClick={() => adjust(1)}><Plus className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => adjust(10)}><Plus className="w-4 h-4" />10</Button>
          </div>
        </div>

        {/* News ticker */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-3.5 h-3.5" /> Bandeau d'annonce
            </Label>
            <Switch
              checked={s.news_ticker_active}
              onCheckedChange={(v) => { setS({ ...s, news_ticker_active: v }); update({ news_ticker_active: v }, true); }}
            />
          </div>
          <Textarea
            value={s.news_ticker || ""}
            onChange={(e) => setS({ ...s, news_ticker: e.target.value })}
            onBlur={() => update({ news_ticker: s.news_ticker })}
            placeholder="Annonce FR…"
            className="mt-2 min-h-[60px]"
          />
          <Textarea
            value={s.news_ticker_en || ""}
            onChange={(e) => setS({ ...s, news_ticker_en: e.target.value })}
            onBlur={() => update({ news_ticker_en: s.news_ticker_en })}
            placeholder="Announcement EN…"
            className="mt-2 min-h-[60px]"
          />
        </div>
      </div>

      {/* General settings */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Field label="Lien YouTube Live (embed URL)" value={s.youtube_url} onChange={(v) => setS({ ...s, youtube_url: v })} onBlur={() => update({ youtube_url: s.youtube_url })} />
        <Field label="Lien d'inscription" value={s.registration_url} onChange={(v) => setS({ ...s, registration_url: v })} onBlur={() => update({ registration_url: s.registration_url })} />
        <Field label="URL du programme PDF" value={s.program_pdf_url} onChange={(v) => setS({ ...s, program_pdf_url: v })} onBlur={() => update({ program_pdf_url: s.program_pdf_url })} />
        <Field label="Date" value={s.event_date} onChange={(v) => setS({ ...s, event_date: v })} onBlur={() => update({ event_date: s.event_date })} />
        <Field label="Lieu" value={s.event_location} onChange={(v) => setS({ ...s, event_location: v })} onBlur={() => update({ event_location: s.event_location })} />
        <Field label="Logo URL" value={s.logo_url} onChange={(v) => setS({ ...s, logo_url: v })} onBlur={() => update({ logo_url: s.logo_url })} />
        <Field label="Nom de l'événement (FR)" value={s.event_name} onChange={(v) => setS({ ...s, event_name: v })} onBlur={() => update({ event_name: s.event_name })} />
        <Field label="Event name (EN)" value={s.event_name_en} onChange={(v) => setS({ ...s, event_name_en: v })} onBlur={() => update({ event_name_en: s.event_name_en })} />
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs uppercase tracking-wider">Description (FR)</Label>
          <Textarea value={s.description || ""} onChange={(e) => setS({ ...s, description: e.target.value })} onBlur={() => update({ description: s.description })} className="mt-2" />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider">Description (EN)</Label>
          <Textarea value={s.description_en || ""} onChange={(e) => setS({ ...s, description_en: e.target.value })} onBlur={() => update({ description_en: s.description_en })} className="mt-2" />
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
        {saving && <><Save className="w-3 h-3 animate-pulse" /> Enregistrement…</>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, onBlur }: { label: string; value: string | null; onChange: (v: string) => void; onBlur: () => void }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider">{label}</Label>
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="mt-2" />
    </div>
  );
}
