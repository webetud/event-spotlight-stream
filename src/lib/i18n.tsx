import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "jncm-lang";

type Dict = Record<string, { fr: string; en: string }>;

export const dict: Dict = {
  // Nav
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.timeline": { fr: "Programme Live", en: "Live Program" },
  "nav.partners": { fr: "Partenaires & Médias", en: "Partners & Media" },
  "nav.postcafe": { fr: "Post-Café", en: "Post-Café" },
  "nav.organizers": { fr: "Organisateurs", en: "Organizers" },
  "nav.admin": { fr: "Admin", en: "Admin" },

  // Home
  "home.live_attendance": { fr: "Présence en direct", en: "Live attendance" },
  "home.attendees": { fr: "participants présents", en: "attendees present" },
  "home.register": { fr: "S'inscrire à l'événement", en: "Register for the event" },
  "home.live_stream": { fr: "Diffusion en direct", en: "Live broadcast" },
  "home.past_events": { fr: "Éditions précédentes", en: "Previous editions" },
  "home.see_program": { fr: "Voir le programme", en: "See program" },

  // Timeline
  "tl.title": { fr: "Programme & conférences", en: "Program & lectures" },
  "tl.subtitle": { fr: "Le conférencier en direct apparaît automatiquement en haut.", en: "The live speaker is automatically pinned at the top." },
  "tl.live_now": { fr: "EN DIRECT", en: "LIVE NOW" },
  "tl.supervisor": { fr: "Superviseur", en: "Supervisor" },
  "tl.speaker": { fr: "Conférencier", en: "Speaker" },
  "tl.gallery": { fr: "Galerie", en: "Gallery" },
  "tl.download_program": { fr: "Télécharger le programme (PDF)", en: "Download program (PDF)" },
  "tl.go_postcafe": { fr: "Accéder au Post-Café", en: "Go to Post-Café" },
  "tl.remaining": { fr: "Temps restant", en: "Remaining time" },
  "tl.scheduled": { fr: "Prévu à", en: "Scheduled at" },
  "tl.read_more": { fr: "En savoir plus", en: "Learn more" },

  // Partners
  "pt.sponsors": { fr: "Sponsors officiels", en: "Official sponsors" },
  "pt.media": { fr: "Couverture médiatique", en: "Media coverage" },
  "pt.subtitle": { fr: "Ils soutiennent l'événement.", en: "They support the event." },

  // Post-Café
  "pc.title": { fr: "Post-Café & Expositions", en: "Post-Café & Exhibitions" },
  "pc.subtitle": { fr: "Découvrez les clubs et leurs activités.", en: "Discover the clubs and their activities." },
  "pc.open_gallery": { fr: "Ouvrir la galerie", en: "Open gallery" },

  // Organizers
  "or.team": { fr: "Équipe organisatrice", en: "Organizing team" },
  "or.portfolio": { fr: "Portfolio créatif", en: "Creative portfolio" },
  "or.portfolio_sub": { fr: "Designs et identité visuelle de l'événement.", en: "Designs and visual identity of the event." },

  // Admin
  "ad.login": { fr: "Connexion administrateur", en: "Admin login" },
  "ad.email": { fr: "E-mail", en: "Email" },
  "ad.password": { fr: "Mot de passe", en: "Password" },
  "ad.signin": { fr: "Se connecter", en: "Sign in" },
  "ad.signup": { fr: "Créer le compte admin", en: "Create admin account" },
  "ad.signout": { fr: "Déconnexion", en: "Sign out" },
  "ad.dashboard": { fr: "Tableau de bord", en: "Dashboard" },
  "ad.no_account": { fr: "Première connexion ? Créer le compte.", en: "First time? Create the account." },
  "ad.has_account": { fr: "Déjà inscrit ? Se connecter.", en: "Already registered? Sign in." },

  // Common
  "c.loading": { fr: "Chargement…", en: "Loading…" },
  "c.save": { fr: "Enregistrer", en: "Save" },
  "c.cancel": { fr: "Annuler", en: "Cancel" },
  "c.add": { fr: "Ajouter", en: "Add" },
  "c.edit": { fr: "Modifier", en: "Edit" },
  "c.delete": { fr: "Supprimer", en: "Delete" },
  "c.close": { fr: "Fermer", en: "Close" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
  pick: (fr: string | null | undefined, en: string | null | undefined) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";
    return (localStorage.getItem(STORAGE_KEY) as Lang) || "fr";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);
  const pick = (fr: string | null | undefined, en: string | null | undefined) => {
    if (lang === "en") return en || fr || "";
    return fr || en || "";
  };

  return <I18nCtx.Provider value={{ lang, setLang, t, pick }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
