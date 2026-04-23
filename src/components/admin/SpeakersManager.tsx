import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Radio, RadioReceiver, Upload } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUploader";

type Speaker = Tables<"speakers">;

export function SpeakersManager() {
  const [list, setList] = useState<Speaker[]>([]);
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("speakers").select("*").order("display_order");
    setList(data || []);
  };
  useEffect(() => {
    load();
    const ch = supabase.channel("admin-speakers")
      .on("postgres_changes", { event: "*", schema: "public", table: "speakers" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const goLive = async (sp: Speaker) => {
    // Stop all others first
    await supabase.from("speakers").update({ is_live: false, live_started_at: null }).neq("id", sp.id);
    const next = !sp.is_live;
    await supabase.from("speakers").update({
      is_live: next,
      live_started_at: next ? new Date().toISOString() : null,
    }).eq("id", sp.id);
    toast.success(next ? `${sp.name} est en direct` : "Statut Live arrêté");
  };

  const remove = async (sp: Speaker) => {
    if (!confirm(`Supprimer ${sp.name} ?`)) return;
    await supabase.from("speakers").delete().eq("id", sp.id);
    toast.success("Supprimé");
  };

  return (
    <div className="rounded-2xl bg-gradient-card border border-border p-6 shadow-soft">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-lg font-bold">Conférenciers ({list.length})</h2>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-accent border-0"><Plus className="w-4 h-4" /> Ajouter</Button>
          </DialogTrigger>
          <SpeakerForm
            open={creating}
            onClose={() => setCreating(false)}
            onSaved={load}
          />
        </Dialog>
      </div>

      <div className="mt-5 space-y-2">
        {list.map((sp) => (
          <div key={sp.id} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background hover:shadow-soft transition-smooth">
            <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-white font-bold" style={{ background: sp.card_color || "#002366" }}>
              {sp.photo_url ? <img src={sp.photo_url} alt="" className="w-full h-full object-contain rounded-lg" /> : sp.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{sp.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {sp.is_supervisor ? "Superviseur" : "Conférencier"} · {sp.scheduled_time || "—"} · {sp.specialty || ""}
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => goLive(sp)}
              className={sp.is_live ? "bg-live hover:bg-live/90 text-live-foreground gap-2 animate-live-glow" : "gap-2"}
              variant={sp.is_live ? "default" : "outline"}
            >
              {sp.is_live ? <><Radio className="w-3.5 h-3.5" /> Live</> : <><RadioReceiver className="w-3.5 h-3.5" /> Go Live</>}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEditing(sp)}><Pencil className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => remove(sp)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>

      {editing && (
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <SpeakerForm
            open
            speaker={editing}
            onClose={() => setEditing(null)}
            onSaved={load}
          />
        </Dialog>
      )}
    </div>
  );
}

function SpeakerForm({ open, speaker, onClose, onSaved }: { open: boolean; speaker?: Speaker; onClose: () => void; onSaved: () => void; }) {
  const [form, setForm] = useState<Partial<Speaker>>(
    speaker || {
      name: "",
      specialty: "",
      talk_title: "",
      scheduled_time: "",
      duration_minutes: 30,
      card_color: "#002366",
      is_supervisor: false,
      display_order: 99,
      gallery_urls: [],
    }
  );

  const submit = async () => {
    if (!form.name) {
      toast.error("Nom requis");
      return;
    }
    if (speaker) {
      const { error } = await supabase.from("speakers").update(form).eq("id", speaker.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("speakers").insert(form as TablesInsert<"speakers">);
      if (error) return toast.error(error.message);
    }
    toast.success("Enregistré");
    onSaved();
    onClose();
  };

  if (!open) return null;

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogTitle>{speaker ? "Modifier le conférencier" : "Nouveau conférencier"}</DialogTitle>
      <div className="space-y-4 mt-4">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Nom *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Horaire (ex. 09:00)" value={form.scheduled_time} onChange={(v) => setForm({ ...form, scheduled_time: v })} />
          <Field label="Spécialité (FR)" value={form.specialty} onChange={(v) => setForm({ ...form, specialty: v })} />
          <Field label="Specialty (EN)" value={form.specialty_en} onChange={(v) => setForm({ ...form, specialty_en: v })} />
          <Field label="Titre de l'intervention (FR)" value={form.talk_title} onChange={(v) => setForm({ ...form, talk_title: v })} />
          <Field label="Talk title (EN)" value={form.talk_title_en} onChange={(v) => setForm({ ...form, talk_title_en: v })} />
          <div>
            <Label className="text-xs uppercase tracking-wider">Durée (min)</Label>
            <Input type="number" value={form.duration_minutes || 30} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 30 })} className="mt-2" />
          </div>
          <Field label="Lien externe" value={form.external_link} onChange={(v) => setForm({ ...form, external_link: v })} />
          <div>
            <Label className="text-xs uppercase tracking-wider">Couleur de la fiche</Label>
            <div className="flex gap-2 mt-2">
              <input type="color" value={form.card_color || "#002366"} onChange={(e) => setForm({ ...form, card_color: e.target.value })} className="h-10 w-16 rounded cursor-pointer" />
              <Input value={form.card_color || ""} onChange={(e) => setForm({ ...form, card_color: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider">Ordre d'affichage</Label>
            <Input type="number" value={form.display_order ?? 99} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="mt-2" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
          <Switch checked={!!form.is_supervisor} onCheckedChange={(v) => setForm({ ...form, is_supervisor: v })} />
          <Label>Professeur superviseur</Label>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider">Description (FR)</Label>
          <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2" />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider">Description (EN)</Label>
          <Textarea value={form.description_en || ""} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="mt-2" />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Photo (PNG transparent recommandé)</Label>
          <ImageUploader value={form.photo_url || null} onChange={(url) => setForm({ ...form, photo_url: url })} folder="speakers" />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Galerie</Label>
          <MultiImageUploader value={form.gallery_urls || []} onChange={(urls) => setForm({ ...form, gallery_urls: urls })} folder="speakers" />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit} className="bg-gradient-accent border-0">Enregistrer</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function Field({ label, value, onChange }: { label: string; value: string | null | undefined; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider">{label}</Label>
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="mt-2" />
    </div>
  );
}

function MultiImageUploader({ value, onChange, folder }: { value: string[]; onChange: (urls: string[]) => void; folder: string }) {
  return (
    <div className="mt-2 space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded p-1 opacity-0 group-hover:opacity-100 transition-smooth">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <ImageUploader value={null} onChange={(url) => url && onChange([...value, url])} folder={folder} compact />
    </div>
  );
}
