import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient } from "@tanstack/react-query";
import App from "./App";

export function render(url: string) {
  const helmetContext = {};
  const queryClient = new QueryClient();
  
  // Simple static location hook for wouter on the server
  const staticLocationHook = (path = url) => {
    return () => [path, (to: string) => {}] as [string, (to: string) => void];
  };

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router hook={staticLocationHook(url)}>
        <App queryClient={queryClient} />
      </Router>
    </HelmetProvider>
  );

  return { appHtml, helmetContext };
}

