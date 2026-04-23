import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUploader";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "gallery" | "number" | "select";
  options?: { value: string; label: string }[];
};

interface Props {
  table: string;
  title: string;
  fields: FieldDef[];
  uploadFolder: string;
  primaryField?: string;
}

export function GenericManager({ table, title, fields, uploadFolder, primaryField = "name" }: Props) {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from(table).select("*").order("display_order", { ascending: true });
    setList(data || []);
  };
  useEffect(() => { load(); }, [table]);

  const remove = async (row: any) => {
    if (!confirm("Supprimer ?")) return;
    const { error } = await (supabase as any).from(table).delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else { toast.success("Supprimé"); load(); }
  };

  return (
    <div className="rounded-2xl bg-gradient-card border border-border p-6 shadow-soft">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-lg font-bold">{title} ({list.length})</h2>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-accent border-0"><Plus className="w-4 h-4" /> Ajouter</Button>
          </DialogTrigger>
          {creating && <ItemForm table={table} fields={fields} uploadFolder={uploadFolder} onClose={() => setCreating(false)} onSaved={load} />}
        </Dialog>
      </div>

      <div className="mt-4 space-y-2">
        {list.map((row) => {
          const img = row.logo_url || row.image_url || row.photo_url || (row.gallery_urls?.[0]);
          return (
            <div key={row.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
              <div className="w-10 h-10 rounded-lg shrink-0 bg-gradient-accent flex items-center justify-center text-white font-semibold overflow-hidden">
                {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : (row[primaryField] || "?")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{row[primaryField] || row.title || "Sans titre"}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {row.category || row.role || row.event_date || row.location || ""}
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setEditing(row)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(row)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-muted-foreground italic">Aucun élément.</p>}
      </div>

      {editing && (
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <ItemForm table={table} fields={fields} uploadFolder={uploadFolder} initial={editing} onClose={() => setEditing(null)} onSaved={load} />
        </Dialog>
      )}
    </div>
  );
}

function ItemForm({ table, fields, uploadFolder, initial, onClose, onSaved }: { table: string; fields: FieldDef[]; uploadFolder: string; initial?: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(initial || { display_order: 99 });

  const submit = async () => {
    if (initial) {
      const { error } = await (supabase as any).from(table).update(form).eq("id", initial.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await (supabase as any).from(table).insert(form);
      if (error) return toast.error(error.message);
    }
    toast.success("Enregistré");
    onSaved();
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogTitle>{initial ? "Modifier" : "Ajouter"}</DialogTitle>
      <div className="space-y-3 mt-4">
        {fields.map((f) => (
          <div key={f.key}>
            <Label className="text-xs uppercase tracking-wider">{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-2" />
            ) : f.type === "image" ? (
              <ImageUploader value={form[f.key] || null} onChange={(url) => setForm({ ...form, [f.key]: url })} folder={uploadFolder} />
            ) : f.type === "gallery" ? (
              <GalleryEditor value={form[f.key] || []} onChange={(urls) => setForm({ ...form, [f.key]: urls })} folder={uploadFolder} />
            ) : f.type === "number" ? (
              <Input type="number" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: parseInt(e.target.value) || 0 })} className="mt-2" />
            ) : f.type === "select" ? (
              <select value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <Input value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-2" />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit} className="bg-gradient-accent border-0">Enregistrer</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function GalleryEditor({ value, onChange, folder }: { value: string[]; onChange: (urls: string[]) => void; folder: string }) {
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
