import { useEffect, useState } from "react";
import { Tables } from "@/integrations/supabase/types";

type Speaker = Tables<"speakers">;

interface Props {
  speaker: Speaker;
}

export function Countdown({ speaker }: Props) {
  const [remaining, setRemaining] = useState<string>("");

  useEffect(() => {
    if (!speaker.is_live || !speaker.live_started_at) {
      setRemaining("");
      return;
    }
    const start = new Date(speaker.live_started_at).getTime();
    const totalMs = (speaker.duration_minutes || 30) * 60 * 1000;

    const tick = () => {
      const elapsed = Date.now() - start;
      const left = totalMs - elapsed;
      if (left <= 0) {
        setRemaining("00:00");
        return;
      }
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setRemaining(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [speaker.is_live, speaker.live_started_at, speaker.duration_minutes]);

  if (!speaker.is_live) return null;
  return (
    <div className="font-mono text-2xl font-bold tabular-nums tracking-wider">
      {remaining}
    </div>
  );
}
