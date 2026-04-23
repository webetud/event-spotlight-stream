import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/40 bg-secondary/30">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4 text-accent" />
          <span>JNCM 2026 — Journées Nationales de Cardiologie Moderne</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/admin" className="hover:text-accent transition-smooth">Admin</Link>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
