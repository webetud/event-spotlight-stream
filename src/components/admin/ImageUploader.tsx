import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  compact?: boolean;
}

export function ImageUploader({ value, onChange, folder, compact }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("event-media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("event-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image téléchargée");
    } catch (err: any) {
      toast.error(err.message || "Erreur de téléchargement");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {value && !compact && (
        <div className="relative inline-block">
          <img src={value} alt="" className="max-h-32 rounded-lg border border-border bg-secondary p-1" />
          <button onClick={() => onChange(null)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-soft">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()} className="gap-2">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {compact ? "Ajouter une image" : "Téléverser"}
        </Button>
        <span className="text-xs text-muted-foreground">ou collez une URL :</span>
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://…"
          className="flex-1 min-w-[200px] h-9 text-sm"
        />
      </div>
    </div>
  );
}
