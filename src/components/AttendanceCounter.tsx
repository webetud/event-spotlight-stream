import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Users } from "lucide-react";

export function AttendanceCounter() {
  const { t } = useI18n();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("event_settings")
        .select("attendance_count")
        .limit(1)
        .maybeSingle();
      if (data) setCount(data.attendance_count);
    };
    load();

    const ch = supabase
      .channel("attendance-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "event_settings" },
        (payload: any) => {
          if (payload.new?.attendance_count !== undefined) {
            setCount(payload.new.attendance_count);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="relative inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-gradient-card border border-border shadow-elegant">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-live text-live-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-live">
        <span className="live-dot bg-white !w-1.5 !h-1.5" />
        Live
      </div>
      <div className="flex items-center gap-3">
        <Users className="w-7 h-7 text-accent" />
        <div className="text-5xl md:text-6xl font-display font-extrabold tabular-nums bg-gradient-accent bg-clip-text text-transparent">
          {count.toLocaleString()}
        </div>
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        {t("home.attendees")}
      </div>
    </div>
  );
}
