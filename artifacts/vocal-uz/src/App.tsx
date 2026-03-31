import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { LangProvider } from "@/lib/langContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import ExtremeVocals from "@/pages/ExtremeVocals";
import PopVocals from "@/pages/PopVocals";
import KaraokeCourse from "@/pages/KaraokeCourse";
import KidsVocals from "@/pages/KidsVocals";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/extreme" component={ExtremeVocals} />
        <Route path="/pop" component={PopVocals} />
        <Route path="/karaoke" component={KaraokeCourse} />
        <Route path="/kids" component={KidsVocals} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <LangProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <div className="min-h-screen bg-[#080808] text-[#f0eeea]">
          <Nav />
          <main>
            <Router />
          </main>
          <Footer />
        </div>
      </WouterRouter>
      <Toaster />
    </LangProvider>
  );
}

export default App;
