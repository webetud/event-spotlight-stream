import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NewsTicker } from "./NewsTicker";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsTicker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
