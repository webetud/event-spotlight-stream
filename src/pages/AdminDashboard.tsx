import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, LogOut, Moon, Sun, Loader2, Eye } from "lucide-react";
import { RealtimeControls } from "@/components/admin/RealtimeControls";
import { SpeakersManager } from "@/components/admin/SpeakersManager";
import { GenericManager } from "@/components/admin/GenericManager";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/admin" replace />;
  if (!isAdmin) return <Navigate to="/admin" replace />;

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-accent w-9 h-9 rounded-lg flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base">JNCM 2026</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">{t("ad.dashboard")}</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-2"><Eye className="w-4 h-4" /> Voir le site</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" /> {t("ad.signout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{t("ad.dashboard")}</h1>
        <p className="text-sm text-muted-foreground mt-1">Connecté en tant que {user.email}</p>

        <Tabs defaultValue="live" className="mt-8">
          <TabsList className="flex-wrap h-auto bg-secondary">
            <TabsTrigger value="live">Temps réel</TabsTrigger>
            <TabsTrigger value="speakers">Conférenciers</TabsTrigger>
            <TabsTrigger value="past">Éditions</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
            <TabsTrigger value="clubs">Clubs Post-Café</TabsTrigger>
            <TabsTrigger value="organizers">Organisateurs</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6"><RealtimeControls /></TabsContent>

          <TabsContent value="speakers" className="mt-6"><SpeakersManager /></TabsContent>

          <TabsContent value="past" className="mt-6">
            <GenericManager
              table="past_events"
              title="Éditions précédentes"
              uploadFolder="past"
              primaryField="title"
              fields={[
                { key: "title", label: "Titre (FR) *" },
                { key: "title_en", label: "Title (EN)" },
                { key: "event_date", label: "Date" },
                { key: "location", label: "Lieu" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "display_order", label: "Ordre", type: "number" },
              ]}
            />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <GenericManager
              table="partners"
              title="Partenaires & médias"
              uploadFolder="partners"
              fields={[
                { key: "name", label: "Nom *" },
                { key: "category", label: "Catégorie", type: "select", options: [{ value: "sponsor", label: "Sponsor" }, { value: "media", label: "Média" }] },
                { key: "logo_url", label: "Logo", type: "image" },
                { key: "website_url", label: "Site web" },
                { key: "display_order", label: "Ordre", type: "number" },
              ]}
            />
          </TabsContent>

          <TabsContent value="clubs" className="mt-6">
            <GenericManager
              table="clubs"
              title="Clubs Post-Café"
              uploadFolder="clubs"
              fields={[
                { key: "name", label: "Nom (FR) *" },
                { key: "name_en", label: "Name (EN)" },
                { key: "description", label: "Description (FR)", type: "textarea" },
                { key: "description_en", label: "Description (EN)", type: "textarea" },
                { key: "logo_url", label: "Logo", type: "image" },
                { key: "gallery_urls", label: "Galerie", type: "gallery" },
                { key: "display_order", label: "Ordre", type: "number" },
              ]}
            />
          </TabsContent>

          <TabsContent value="organizers" className="mt-6">
            <GenericManager
              table="organizers"
              title="Organisateurs"
              uploadFolder="organizers"
              fields={[
                { key: "name", label: "Nom *" },
                { key: "role", label: "Rôle (FR)" },
                { key: "role_en", label: "Role (EN)" },
                { key: "photo_url", label: "Photo", type: "image" },
                { key: "linkedin_url", label: "LinkedIn" },
                { key: "facebook_url", label: "Facebook" },
                { key: "display_order", label: "Ordre", type: "number" },
              ]}
            />
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <GenericManager
              table="portfolio_items"
              title="Portfolio"
              uploadFolder="portfolio"
              primaryField="title"
              fields={[
                { key: "title", label: "Titre (FR) *" },
                { key: "title_en", label: "Title (EN)" },
                { key: "category", label: "Catégorie", type: "select", options: [{ value: "badge", label: "Badge" }, { value: "poster", label: "Poster" }, { value: "interface", label: "Interface" }] },
                { key: "image_url", label: "Image", type: "image" },
                { key: "display_order", label: "Ordre", type: "number" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
