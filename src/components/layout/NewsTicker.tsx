import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Megaphone } from "lucide-react";

export function NewsTicker() {
  const { lang } = useI18n();
  const [text, setText] = useState<string>("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("event_settings")
        .select("news_ticker, news_ticker_en, news_ticker_active")
        .limit(1)
        .maybeSingle();
      if (data) {
        setText((lang === "en" ? data.news_ticker_en : data.news_ticker) || data.news_ticker || "");
        setActive(data.news_ticker_active);
      }
    };
    load();

    const ch = supabase
      .channel("ticker-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "event_settings" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [lang]);

  if (!active || !text) return null;

  const repeated = `${text}  •  ${text}  •  ${text}  •  ${text}`;

  return (
    <div className="bg-gradient-live text-live-foreground overflow-hidden">
      <div className="container flex items-center gap-3 py-2">
        <Megaphone className="w-4 h-4 shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track whitespace-nowrap text-sm font-medium">
            {repeated}&nbsp;&nbsp;&nbsp;{repeated}
          </div>
        </div>
      </div>
    </div>
  );
}
