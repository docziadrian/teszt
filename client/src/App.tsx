import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet } from "react-helmet-async";
import { ThemeProvider } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import "./lib/i18n";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App({ queryClient: qc = queryClient }: { queryClient?: any }) {
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="dark" storageKey="novyxdev-ui-theme">
        <Helmet>
          <title>NovyxDev - {t('hero.title', { defaultValue: 'Professzionális Weboldal Fejlesztés' }).replace(/<[^>]*>/g, '')}</title>
          <meta name="description" content={t('hero.subtitle', { defaultValue: 'Modern, egyedi weboldalak fejlesztése a legújabb technológiákkal.' })} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={`NovyxDev - ${t('hero.title', { defaultValue: 'Professzionális Weboldal Fejlesztés' }).replace(/<[^>]*>/g, '')}`} />
          <meta property="og:description" content={t('hero.subtitle', { defaultValue: 'Modern, egyedi weboldalak fejlesztése a legújabb technológiákkal.' })} />
        </Helmet>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
