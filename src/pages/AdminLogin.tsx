import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/theme";
import { Heart, Loader2, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const { t } = useI18n();
  const { user, isAdmin, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }
  if (user && isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center container">
        <div className="max-w-md text-center bg-gradient-card p-8 rounded-2xl border border-border shadow-elegant">
          <h2 className="font-display text-xl font-bold">Accès refusé</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ce compte n'est pas administrateur.</p>
          <Button className="mt-4" onClick={() => supabase.auth.signOut()}>Déconnexion</Button>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
        });
        if (error) throw error;
        toast.success("Compte créé. Si la confirmation par e-mail est désactivée, vous êtes connecté.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" onClick={toggle} className="text-white hover:bg-white/10">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="bg-white/10 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center border border-white/20">
            <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-2xl text-white">JNCM 2026</span>
        </Link>

        <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-7 shadow-elegant space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold">{t("ad.login")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin" ? t("ad.no_account") : t("ad.has_account")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("ad.email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("ad.password")}</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button type="submit" disabled={busy} className="w-full bg-gradient-accent border-0 h-11 text-base font-semibold">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "signin" ? t("ad.signin") : t("ad.signup"))}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs text-muted-foreground hover:text-accent transition-smooth w-full text-center"
          >
            {mode === "signin" ? t("ad.no_account") : t("ad.has_account")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
