import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, Moon, Sun, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/timeline", label: t("nav.timeline") },
    { to: "/partners", label: t("nav.partners") },
    { to: "/post-cafe", label: t("nav.postcafe") },
    { to: "/organizers", label: t("nav.organizers") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-accent rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-smooth" />
            <div className="relative bg-gradient-accent w-9 h-9 rounded-lg flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-base tracking-tight">JNCM 2026</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Cardiologie</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-smooth hover:text-accent",
                loc.pathname === l.to ? "text-accent bg-accent/10" : "text-foreground/70"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="gap-1.5 font-semibold uppercase text-xs"
          >
            <Globe className="w-4 h-4" />
            {lang}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm font-medium rounded-md transition-smooth",
                  loc.pathname === l.to
                    ? "text-accent bg-accent/10"
                    : "text-foreground/80 hover:bg-secondary"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
