import { jsx, jsxs } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { Switch, Route, Router as Router$1 } from "wouter";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { QueryClient, useMutation, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, ChevronRight, Check, Circle, Globe, Sun, Moon, Menu, Eye, ArrowRight, Rocket, Star, Code, ShoppingCart, RefreshCw, Send, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { initReactI18next, useTranslation, Trans } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Slot } from "@radix-ui/react-slot";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useFormContext, FormProvider, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as LabelPrimitive from "@radix-ui/react-label";
import { sql } from "drizzle-orm";
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text2 = await res.text() || res.statusText;
    throw new Error(`${res.status}: ${text2}`);
  }
}
async function apiRequest(method, url, data) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : void 0,
    credentials: "include"
  });
  await throwIfResNotOk(res);
  return res;
}
const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
  const res = await fetch(queryKey.join("/"), {
    credentials: "include"
  });
  if (unauthorizedBehavior === "returnNull" && res.status === 401) {
    return null;
  }
  await throwIfResNotOk(res);
  return await res.json();
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const initialState = {
  theme: "system",
  setTheme: () => null
};
const ThemeProviderContext = createContext(initialState);
function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme"
}) {
  const [theme, setTheme] = useState(
    () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem(storageKey) || defaultTheme;
      }
      return defaultTheme;
    }
  );
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
  const value = {
    theme,
    setTheme: (theme2) => {
      localStorage.setItem(storageKey, theme2);
      setTheme(theme2);
    }
  };
  return /* @__PURE__ */ jsx(ThemeProviderContext.Provider, { value, children });
}
const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === void 0)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
const common$2 = {
  novyxDev: "NovyxDev"
};
const nav$2 = {
  home: "Főoldal",
  references: "Referenciák",
  services: "Szolgáltatásaink",
  about: "Rólunk",
  contact: "Kapcsolat"
};
const hero$2 = {
  title: "Professzionális weboldalak a <1>NovyxDev-től</1>",
  subtitle: "Modern, egyedi weboldalak fejlesztése a legújabb technológiákkal. Legyen szó vállalati weboldalról, webshopról vagy landing page-ről, mi megvalósítjuk álmaid digitális projektjét.",
  cta: "Referenciáink megtekintése",
  quote: "Ajánlatkérés",
  stats: {
    projects: "Elkészült projekt",
    clients: "Elégedett ügyfél",
    experience: "Év tapasztalat"
  },
  floatingCard: {
    title: "Gyors fejlesztés",
    subtitle: "2-4 hét átfutás"
  }
};
const references$2 = {
  title: "Referencia munkáink",
  subtitle: "Büszkék vagyunk arra, amit eddig elértünk. Nézd meg legfrissebb projektjeinket és győződj meg szakértelmünkről!",
  filters: {
    category: "Kategória",
    tech: "Technológia",
    all: "Mind"
  },
  noResults: "Nincs találat a megadott szűrési feltételekkel.",
  categories: {
    Mind: "Mind",
    "Vállalati": "Vállalati",
    Webshop: "Webshop",
    "Landing page": "Landing page",
    "Egyéb": "Egyéb"
  },
  modal: {
    description: "Leírás",
    features: "Főbb funkciók",
    techStack: "Technológiai stack"
  },
  items: [
    {
      id: "1",
      name: "TechVision Consulting",
      category: "Vállalati",
      shortDescription: "Modern vállalati weboldal komplex szolgáltatás bemutatással és ügyfélportállal.",
      fullDescription: "A TechVision Consulting számára készített komplex vállalati weboldal, amely modern dizájnnal és felhasználóbarát felülettel mutatja be a cég széles szolgáltatási portfólióját. Az oldal tartalmaz egy bejelentkezést igénylő ügyfélportált, dinamikus tartalomkezelést és többnyelvű támogatást.",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS"
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Magyar Zsolt, TechVision ügyvezető",
      clientQuote: "Kiváló munkát végeztek! A weboldal pontosan azt nyújtja, amire szükségünk volt. Professzionális, gyors és hatékony együttműködés.",
      features: [
        "Reszponzív dizájn minden eszközön",
        "Bejelentkezést igénylő ügyfélportál",
        "Dinamikus tartalomkezelő rendszer",
        "SEO optimalizálás",
        "Többnyelvű támogatás (HU/EN)"
      ]
    },
    {
      id: "2",
      name: "FreshMarket Webshop",
      category: "Webshop",
      shortDescription: "Teljes körű e-commerce platform friss élelmiszerek online értékesítésére.",
      fullDescription: "Komplett webáruház megoldás a FreshMarket számára, amely lehetővé teszi a friss élelmiszerek online értékesítését. Az oldal tartalmaz kosárfunkciót, fizetési gateway integrációt, raktárkészlet kezelést és automatikus rendeléskezelést.",
      techStack: [
        "React",
        "Node.js",
        "Stripe",
        "MongoDB",
        "Redis"
      ],
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Kovács Anna, FreshMarket tulajdonos",
      clientQuote: "Fantasztikus eredmény! Az értékesítésünk 40%-kal nőtt az új webshop bevezetése óta. Köszönjük a precíz munkát!",
      features: [
        "Kosár és fizetési rendszer",
        "Stripe fizetési integráció",
        "Raktárkészlet kezelés",
        "Adminisztrációs felület",
        "Automatikus email értesítések"
      ]
    },
    {
      id: "3",
      name: "EventHub Landing",
      category: "Landing page",
      shortDescription: "Letisztult landing page eseményszervező platform bemutatására.",
      fullDescription: "Professzionális landing page az EventHub eseményszervező platform számára. A cél egy konverziót maximalizáló, modern megjelenésű egyoldalas weboldal volt, amely hatékonyan mutatja be a platform előnyeit és ösztönzi a regisztrációt.",
      techStack: [
        "React",
        "Tailwind CSS",
        "Framer Motion"
      ],
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Nagy Péter, EventHub marketing vezető",
      clientQuote: "A landing page konverziós rátája kiemelkedő! Modern, figyelemfelkeltő design, gyors betöltés. Minden elvárásunkat felülmúlták.",
      features: [
        "Animált hero szekció",
        "Konverziót optimalizált CTA-k",
        "Gyors betöltési idő",
        "A/B tesztelésre optimalizált",
        "Google Analytics integráció"
      ]
    },
    {
      id: "4",
      name: "HealthPlus Klinika",
      category: "Vállalati",
      shortDescription: "Egészségügyi klinika komplex webes jelenléte időpontfoglalóval.",
      fullDescription: "A HealthPlus magánklinika részére készített komplex weboldal, amely tartalmaz egy online időpontfoglaló rendszert, orvos profil oldalakat, szolgáltatás bemutatókat és blog funkciót. Az oldal modern, tiszta megjelenése bizalmat kelt a látogatókban.",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Next.js"
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Dr. Szabó Katalin, HealthPlus igazgató",
      clientQuote: "Kiváló munka! Az online időpontfoglaló jelentősen csökkentette az adminisztrációs terheinket, a páciensek pedig imádják a rendszert.",
      features: [
        "Online időpontfoglaló",
        "Orvos profil oldalak",
        "Blog és hírek",
        "Email értesítő rendszer",
        "Páciensportál"
      ]
    },
    {
      id: "5",
      name: "StyleBoutique Shop",
      category: "Webshop",
      shortDescription: "Prémium divat webshop egyedi termékekkel és stílusválasztóval.",
      fullDescription: "Elegáns webáruház a StyleBoutique számára, amely prémium női és férfi ruházatot kínál. Az oldal tartalmaz egy interaktív stílusválasztót, részletes termékbemutatókat, wishlist funkciót és integrált közösségi média funkciókat.",
      techStack: [
        "React",
        "Next.js",
        "Shopify API",
        "Tailwind CSS",
        "Vercel"
      ],
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
      ],
      rating: 4,
      clientName: "Tóth Eszter, StyleBoutique brand menedzser",
      clientQuote: "Csodálatos munkát végeztek! Az interaktív stílusválasztó egyedi élményt nyújt vásárlóinknak.",
      features: [
        "Interaktív stílusválasztó",
        "Wishlist funkció",
        "Shopify integráció",
        "Social media integráció",
        "Termék gyorsmegtekintés"
      ]
    },
    {
      id: "6",
      name: "FitLife Gym",
      category: "Vállalati",
      shortDescription: "Edzőterem weboldal órarend megosztással és tagság kezeléssel.",
      fullDescription: "Modern fitness terem weboldal interaktív órarend nézettel, edzők bemutatásával és online tagság vásárlási lehetőséggel. Az oldal responsive dizájnja tökéletesen működik mobilon is, így a tagok útközben is ellenőrizhetik az órarendet.",
      techStack: [
        "React",
        "Firebase",
        "Tailwind CSS"
      ],
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
      ],
      rating: 4,
      clientName: "Kiss Gábor, FitLife tulajdonos",
      clientQuote: "Nagyon elégedettek vagyunk! A tagjaink gyakran használják az online órarend funkciót.",
      features: [
        "Interaktív órarend",
        "Edzők bemutató oldala",
        "Online tagság vásárlás",
        "Mobil alkalmazás kompatibilitás",
        "Push értesítések"
      ]
    }
  ]
};
const services$2 = {
  title: "Szolgáltatásaink",
  subtitle: "Teljes körű webfejlesztési szolgáltatásokat kínálunk, az ötlettől a kész weboldalig. Bármilyen projekted van, mi segítünk megvalósítani!",
  items: [
    {
      id: "1",
      title: "Egyedi weboldal fejlesztés",
      description: "Teljesen személyre szabott weboldalak készítése a legmodernebb technológiákkal. Responsive dizájn, gyors betöltés, SEO optimalizálás.",
      icon: "Code"
    },
    {
      id: "2",
      title: "Landing page készítés",
      description: "Konverziót maximalizáló egyoldalas weboldalak, amelyek hatékonyan mutatják be termékedet vagy szolgáltatásod és ösztönzik a látogatókat a cselekvésre.",
      icon: "Rocket"
    },
    {
      id: "3",
      title: "Webáruház fejlesztés",
      description: "Teljes körű e-commerce megoldások kosárfunkcióval, fizetési rendszer integrációval, raktárkészlet kezeléssel és adminisztrációs felülettel.",
      icon: "ShoppingCart"
    },
    {
      id: "4",
      title: "Weboldal újratervezés",
      description: "Elavult weboldalad felfrissítése modern, felhasználóbarát dizájnnal. Megtartjuk a meglévő tartalmakat, de új életet lehelünk beléjük.",
      icon: "RefreshCw"
    }
  ],
  examples: {
    title: "Példa weboldalak",
    subtitle: "Néhány példa arra, milyen típusú weboldalakat készítünk",
    corporate: {
      title: "Vállalati weboldal",
      desc: "Professzionális megjelenés, szolgáltatások bemutatása, kapcsolatfelvételi lehetőségek"
    },
    landing: {
      title: "Landing page",
      desc: "Konverziót maximalizáló egyoldalas weboldal termék vagy szolgáltatás bemutatására"
    },
    ecommerce: {
      title: "E-commerce webshop",
      desc: "Teljes értékű online áruház kosárfunkcióval, fizetési rendszerrel"
    }
  }
};
const reviews$2 = {
  title: "Ügyfeleink mondták rólunk",
  subtitle: "Büszkék vagyunk arra, hogy ügyfeleink elégedettek a munkánkkal. Nézd meg, mit mondanak rólunk!",
  hint: "Húzd el az egeret a vélemények felett a megállításhoz",
  items: [
    {
      id: "1",
      clientName: "Molnár Rita",
      rating: 5,
      text: "Fantasztikus csapat! Pontosan értették a víziómat és egy gyönyörű weboldalt készítettek. A kommunikáció végig kiváló volt, minden kérdésemre azonnal választ kaptam."
    },
    {
      id: "2",
      clientName: "Horváth Tamás",
      rating: 5,
      text: "Professzionális, gyors és megbízható munkát végeztek. A weboldalunk forgalma jelentősen nőtt az új dizájn bevezetése óta. Mindenkinek ajánlom őket!"
    },
    {
      id: "3",
      clientName: "Varga Judit",
      rating: 5,
      text: "Kiváló ár-érték arány! A webshopunk minden elvárásunkat teljesítette. Az ügyféltámogatásuk is kiemelkedő, bármikor segítenek, ha szükség van rá."
    },
    {
      id: "4",
      clientName: "Farkas Zsolt",
      rating: 4,
      text: "Nagyon elégedett vagyok az eredménnyel. Modern, letisztult design, gyors betöltés. Két apró módosítást kértem, amit azonnal megoldottak."
    },
    {
      id: "5",
      clientName: "Lakatos Éva",
      rating: 5,
      text: "A legjobb döntés volt velük dolgozni! Kreatívak, szakszerűek és figyelnek minden részletre. A landing page-ünk konverziós rátája kétszeresére nőtt!"
    },
    {
      id: "6",
      clientName: "Németh András",
      rating: 5,
      text: "Profi hozzáállás kezdetektől a végső átadásig. Az oldal gyors, modern és pontosan azt nyújtja, amire a cégünknek szüksége volt."
    },
    {
      id: "7",
      clientName: "Balogh Márta",
      rating: 5,
      text: "Nem csak egy weboldalt kaptunk, hanem egy teljes digitális jelenlétet. SEO, design, funkcionalitás - minden tökéletes lett!"
    },
    {
      id: "8",
      clientName: "Papp Gergő",
      rating: 4,
      text: "Kiváló munka, pontos határidők. Az egyetlen dolog, amit még jobbnak láttam volna, az egy részletesebb kezdeti útmutató, de ez csak apróság."
    }
  ]
};
const about$2 = {
  title: "Kik vagyunk mi?",
  subtitle: "A NovyxDev csapata szenvedélyes webfejlesztőkből áll, akik hisznek abban, hogy minden vállalkozás megérdemel egy professzionális online jelenlétet.",
  mission: {
    title: "A küldetésünk",
    text: "Célunk, hogy minden ügyfél számára egyedi, kiváló minőségű weboldalakat készítsünk, amelyek nemcsak szépek, hanem funkcionalitásban is kiemelkedőek. Hiszünk abban, hogy a jó weboldal a sikeres vállalkozás alapja."
  },
  story: {
    title: "A történetünk",
    text: "2018-ban indultunk azzal a céllal, hogy a magyar kisvállalkozások is hozzáférjenek világszínvonalú webfejlesztési szolgáltatásokhoz. Azóta több mint 50 sikeres projektet valósítottunk meg, és folyamatosan bővítjük szakértelmünket az új technológiák terén."
  },
  whyUs: {
    title: "Miért válassz minket?",
    items: [
      "Gyors és hatékony munka - átlagosan 2-4 hét átfutási idő",
      "Modern technológiák - React, TypeScript, Node.js",
      "Reszponzív dizájn minden eszközön",
      "SEO optimalizált weboldalak",
      "Folyamatos támogatás és karbantartás",
      "Átlátható árazás - nincs rejtett költség"
    ]
  },
  team: {
    title: "Csapatunk",
    subtitle: "Ismerd meg a NovyxDev csapatát",
    items: [
      {
        id: "1",
        name: "Kovács Márk",
        role: "Vezető fejlesztő",
        description: "10+ éves tapasztalat full-stack fejlesztésben. Szakértő React, Node.js és felhő technológiákban.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
      },
      {
        id: "2",
        name: "Nagy Viktória",
        role: "UI/UX Designer",
        description: "Szenvedélyes designer, aki a felhasználói élményt helyezi középpontba. Több nemzetközi design díj nyertese.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
      },
      {
        id: "3",
        name: "Szabó Dávid",
        role: "Backend szakértő",
        description: "Adatbázis architektúra és API fejlesztés specialista. Mindig a legoptimálisabb megoldásokat keresi.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
      },
      {
        id: "4",
        name: "Tóth Lilla",
        role: "Project Manager",
        description: "Gondoskodik róla, hogy minden projekt időben és költségvetésen belül készüljön el. Kiváló kommunikációs készségekkel.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
      }
    ]
  }
};
const contact$2 = {
  title: "Lépj velünk kapcsolatba!",
  subtitle: "Van egy ötleted, amit szeretnél profi weboldallá formálni? Írj nekünk bátran! Meséld el, mivel foglalkozol, milyen weboldalt képzeltél el, és mi segítünk megtalálni a legjobb megoldást.",
  form: {
    name: "Név",
    namePlaceholder: "Teljes neved",
    email: "Email cím",
    emailPlaceholder: "email@pelda.hu",
    subject: "Tárgy",
    subjectPlaceholder: "Miben segíthetünk?",
    message: "Üzenet",
    messagePlaceholder: "Írd le részletesen a projektedet, elképzeléseidet...",
    submit: "Üzenet küldése",
    sending: "Küldés...",
    successTitle: "Üzenet elküldve!",
    successDesc: "Köszönjük a megkeresést! Hamarosan felvesszük veled a kapcsolatot.",
    errorTitle: "Hiba történt",
    errorDesc: "Nem sikerült elküldeni az üzenetet. Kérjük, próbáld újra később."
  },
  info: {
    title: "Elérhetőségeink",
    subtitle: "Bátran keress minket bármelyik elérhetőségünkön! Válaszolunk minden megkeresésre 24 órán belül.",
    email: "Email",
    phone: "Telefon",
    address: "Cím",
    addressText: "1111 Budapest<br />Példa utca 42."
  },
  card: {
    title: "Gyors válaszidő",
    text: "Általában 2-4 órán belül válaszolunk minden megkeresésre munkaidőben (H-P 9:00-17:00). Hétvégén is igyekszünk mielőbb reagálni."
  }
};
const footer$2 = {
  rights: "© {{year}} NovyxDev. Minden jog fenntartva.",
  impressum: "Impressum",
  privacy: "Adatkezelési tájékoztató"
};
const hu = {
  common: common$2,
  nav: nav$2,
  hero: hero$2,
  references: references$2,
  services: services$2,
  reviews: reviews$2,
  about: about$2,
  contact: contact$2,
  footer: footer$2
};
const common$1 = {
  novyxDev: "NovyxDev"
};
const nav$1 = {
  home: "Home",
  references: "References",
  services: "Services",
  about: "About Us",
  contact: "Contact"
};
const hero$1 = {
  title: "Professional websites from <1>NovyxDev</1>",
  subtitle: "Modern, unique website development using the latest technologies. Whether it's a corporate website, a webshop, or a landing page, we realize your digital project dreams.",
  cta: "View Our References",
  quote: "Request a Quote",
  stats: {
    projects: "Projects Completed",
    clients: "Satisfied Clients",
    experience: "Years Experience"
  },
  floatingCard: {
    title: "Fast Development",
    subtitle: "2-4 weeks turnaround"
  }
};
const references$1 = {
  title: "Our References",
  subtitle: "We are proud of what we have achieved so far. Check out our latest projects and convince yourself of our expertise!",
  filters: {
    category: "Category",
    tech: "Technology",
    all: "All"
  },
  noResults: "No results found for the selected filters.",
  categories: {
    Mind: "All",
    "Vállalati": "Corporate",
    Webshop: "Webshop",
    "Landing page": "Landing page",
    "Egyéb": "Other"
  },
  modal: {
    description: "Description",
    features: "Key Features",
    techStack: "Tech Stack"
  },
  items: [
    {
      id: "1",
      name: "TechVision Consulting",
      category: "Corporate",
      shortDescription: "Modern corporate website with complex service presentation and client portal.",
      fullDescription: "A complex corporate website created for TechVision Consulting, presenting the company's wide service portfolio with modern design and user-friendly interface. The site includes a login-required client portal, dynamic content management, and multilingual support.",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS"
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Magyar Zsolt, TechVision CEO",
      clientQuote: "Excellent work! The website provides exactly what we needed. Professional, fast, and efficient cooperation.",
      features: [
        "Responsive design on all devices",
        "Login-required client portal",
        "Dynamic content management system",
        "SEO optimization",
        "Multilingual support (HU/EN)"
      ]
    },
    {
      id: "2",
      name: "FreshMarket Webshop",
      category: "Webshop",
      shortDescription: "Full-scale e-commerce platform for online sales of fresh food.",
      fullDescription: "Complete webshop solution for FreshMarket, enabling online sales of fresh food. The site includes cart functionality, payment gateway integration, inventory management, and automatic order processing.",
      techStack: [
        "React",
        "Node.js",
        "Stripe",
        "MongoDB",
        "Redis"
      ],
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Kovács Anna, FreshMarket Owner",
      clientQuote: "Fantastic result! Our sales increased by 40% since the introduction of the new webshop. Thank you for the precise work!",
      features: [
        "Cart and payment system",
        "Stripe payment integration",
        "Inventory management",
        "Administration interface",
        "Automatic email notifications"
      ]
    },
    {
      id: "3",
      name: "EventHub Landing",
      category: "Landing page",
      shortDescription: "Clean landing page for presenting an event organization platform.",
      fullDescription: "Professional landing page for the EventHub event organization platform. The goal was a conversion-maximizing, modern one-page website that effectively presents the platform's benefits and encourages registration.",
      techStack: [
        "React",
        "Tailwind CSS",
        "Framer Motion"
      ],
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Nagy Péter, EventHub Marketing Lead",
      clientQuote: "The landing page conversion rate is outstanding! Modern, eye-catching design, fast loading. Surpassed all our expectations.",
      features: [
        "Animated hero section",
        "Conversion-optimized CTAs",
        "Fast loading time",
        "Optimized for A/B testing",
        "Google Analytics integration"
      ]
    },
    {
      id: "4",
      name: "HealthPlus Clinic",
      category: "Corporate",
      shortDescription: "Complex web presence for a health clinic with appointment booking.",
      fullDescription: "Complex website created for HealthPlus private clinic, including an online appointment booking system, doctor profile pages, service presentations, and blog function. The site's modern, clean appearance inspires trust in visitors.",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Next.js"
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Dr. Szabó Katalin, HealthPlus Director",
      clientQuote: "Excellent work! The online appointment booking significantly reduced our administrative burdens, and patients love the system.",
      features: [
        "Online appointment booking",
        "Doctor profile pages",
        "Blog and news",
        "Email notification system",
        "Patient portal"
      ]
    },
    {
      id: "5",
      name: "StyleBoutique Shop",
      category: "Webshop",
      shortDescription: "Premium fashion webshop with unique products and style selector.",
      fullDescription: "Elegant webshop for StyleBoutique offering premium women's and men's clothing. The site includes an interactive style selector, detailed product presentations, wishlist function, and integrated social media functions.",
      techStack: [
        "React",
        "Next.js",
        "Shopify API",
        "Tailwind CSS",
        "Vercel"
      ],
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
      ],
      rating: 4,
      clientName: "Tóth Eszter, StyleBoutique Brand Manager",
      clientQuote: "Wonderful work! The interactive style selector provides a unique experience for our customers.",
      features: [
        "Interactive style selector",
        "Wishlist function",
        "Shopify integration",
        "Social media integration",
        "Product quick view"
      ]
    },
    {
      id: "6",
      name: "FitLife Gym",
      category: "Corporate",
      shortDescription: "Gym website with schedule sharing and membership management.",
      fullDescription: "Modern fitness gym website with interactive schedule view, trainer presentations, and online membership purchase options. The site's responsive design works perfectly on mobile, so members can check the schedule on the go.",
      techStack: [
        "React",
        "Firebase",
        "Tailwind CSS"
      ],
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
      ],
      rating: 4,
      clientName: "Kiss Gábor, FitLife Owner",
      clientQuote: "We are very satisfied! Our members often use the online schedule function.",
      features: [
        "Interactive schedule",
        "Trainer presentation page",
        "Online membership purchase",
        "Mobile app compatibility",
        "Push notifications"
      ]
    }
  ]
};
const services$1 = {
  title: "Our Services",
  subtitle: "We offer full-scale web development services, from idea to finished website. Whatever your project, we help you realize it!",
  items: [
    {
      id: "1",
      title: "Custom Website Development",
      description: "Creation of completely personalized websites using the most modern technologies. Responsive design, fast loading, SEO optimization.",
      icon: "Code"
    },
    {
      id: "2",
      title: "Landing Page Creation",
      description: "Conversion-maximizing one-page websites that effectively present your product or service and encourage visitors to act.",
      icon: "Rocket"
    },
    {
      id: "3",
      title: "Webshop Development",
      description: "Full-scale e-commerce solutions with cart function, payment system integration, inventory management, and administration interface.",
      icon: "ShoppingCart"
    },
    {
      id: "4",
      title: "Website Redesign",
      description: "Refreshing your outdated website with a modern, user-friendly design. We keep existing content but breathe new life into it.",
      icon: "RefreshCw"
    }
  ],
  examples: {
    title: "Example Websites",
    subtitle: "Some examples of the types of websites we create",
    corporate: {
      title: "Corporate Website",
      desc: "Professional appearance, service presentation, contact options"
    },
    landing: {
      title: "Landing Page",
      desc: "Conversion-maximizing one-page website for product or service presentation"
    },
    ecommerce: {
      title: "E-commerce Webshop",
      desc: "Full-value online store with cart function, payment system"
    }
  }
};
const reviews$1 = {
  title: "What Our Clients Said",
  subtitle: "We are proud that our clients are satisfied with our work. Check out what they say about us!",
  hint: "Hover over the reviews to pause",
  items: [
    {
      id: "1",
      clientName: "Molnár Rita",
      rating: 5,
      text: "Fantastic team! They understood my vision exactly and created a beautiful website. Communication was excellent throughout, I received immediate answers to all my questions."
    },
    {
      id: "2",
      clientName: "Horváth Tamás",
      rating: 5,
      text: "Professional, fast, and reliable work. Our website traffic increased significantly since the introduction of the new design. I recommend them to everyone!"
    },
    {
      id: "3",
      clientName: "Varga Judit",
      rating: 5,
      text: "Excellent value for money! Our webshop met all our expectations. Their customer support is also outstanding, they help anytime if needed."
    },
    {
      id: "4",
      clientName: "Farkas Zsolt",
      rating: 4,
      text: "I am very satisfied with the result. Modern, clean design, fast loading. I asked for two small modifications which they solved immediately."
    },
    {
      id: "5",
      clientName: "Lakatos Éva",
      rating: 5,
      text: "The best decision was to work with them! Creative, professional, and attentive to every detail. Our landing page conversion rate doubled!"
    },
    {
      id: "6",
      clientName: "Németh András",
      rating: 5,
      text: "Professional attitude from the beginning to the final handover. The site is fast, modern, and provides exactly what our company needed."
    },
    {
      id: "7",
      clientName: "Balogh Márta",
      rating: 5,
      text: "We didn't just get a website, but a complete digital presence. SEO, design, functionality - everything turned out perfect!"
    },
    {
      id: "8",
      clientName: "Papp Gergő",
      rating: 4,
      text: "Excellent work, precise deadlines. The only thing I would have seen better is a more detailed initial guide, but this is just a minor detail."
    }
  ]
};
const about$1 = {
  title: "Who Are We?",
  subtitle: "The NovyxDev team consists of passionate web developers who believe that every business deserves a professional online presence.",
  mission: {
    title: "Our Mission",
    text: "Our goal is to create unique, high-quality websites for every client that are not only beautiful but also outstanding in functionality. We believe that a good website is the foundation of a successful business."
  },
  story: {
    title: "Our Story",
    text: "We started in 2018 with the goal of making world-class web development services accessible to Hungarian small businesses. Since then, we have realized over 50 successful projects and continuously expand our expertise in new technologies."
  },
  whyUs: {
    title: "Why Choose Us?",
    items: [
      "Fast and efficient work - average 2-4 weeks turnaround time",
      "Modern technologies - React, TypeScript, Node.js",
      "Responsive design on all devices",
      "SEO optimized websites",
      "Continuous support and maintenance",
      "Transparent pricing - no hidden costs"
    ]
  },
  team: {
    title: "Our Team",
    subtitle: "Meet the NovyxDev team",
    items: [
      {
        id: "1",
        name: "Kovács Márk",
        role: "Lead Developer",
        description: "10+ years of experience in full-stack development. Expert in React, Node.js, and cloud technologies.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
      },
      {
        id: "2",
        name: "Nagy Viktória",
        role: "UI/UX Designer",
        description: "Passionate designer who puts user experience at the center. Winner of several international design awards.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
      },
      {
        id: "3",
        name: "Szabó Dávid",
        role: "Backend Expert",
        description: "Database architecture and API development specialist. Always looking for the most optimal solutions.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
      },
      {
        id: "4",
        name: "Tóth Lilla",
        role: "Project Manager",
        description: "Ensures that every project is completed on time and within budget. Excellent communication skills.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
      }
    ]
  }
};
const contact$1 = {
  title: "Contact Us!",
  subtitle: "Have an idea you want to turn into a professional website? Write to us boldly! Tell us what you do, what kind of website you imagined, and we will help find the best solution.",
  form: {
    name: "Name",
    namePlaceholder: "Your full name",
    email: "Email Address",
    emailPlaceholder: "email@example.com",
    subject: "Subject",
    subjectPlaceholder: "How can we help?",
    message: "Message",
    messagePlaceholder: "Describe your project and ideas in detail...",
    submit: "Send Message",
    sending: "Sending...",
    successTitle: "Message Sent!",
    successDesc: "Thank you for your inquiry! We will contact you shortly.",
    errorTitle: "An Error Occurred",
    errorDesc: "Failed to send the message. Please try again later."
  },
  info: {
    title: "Our Contacts",
    subtitle: "Feel free to contact us on any of our availabilities! We respond to every inquiry within 24 hours.",
    email: "Email",
    phone: "Phone",
    address: "Address",
    addressText: "1111 Budapest<br />Example Street 42."
  },
  card: {
    title: "Fast Response Time",
    text: "We usually respond to every inquiry within 2-4 hours during working hours (M-F 9:00-17:00). We try to react as soon as possible on weekends too."
  }
};
const footer$1 = {
  rights: "© {{year}} NovyxDev. All rights reserved.",
  impressum: "Impressum",
  privacy: "Privacy Policy"
};
const en = {
  common: common$1,
  nav: nav$1,
  hero: hero$1,
  references: references$1,
  services: services$1,
  reviews: reviews$1,
  about: about$1,
  contact: contact$1,
  footer: footer$1
};
const common = {
  novyxDev: "NovyxDev"
};
const nav = {
  home: "Startseite",
  references: "Referenzen",
  services: "Dienstleistungen",
  about: "Über uns",
  contact: "Kontakt"
};
const hero = {
  title: "Professionelle Websites von <1>NovyxDev</1>",
  subtitle: "Entwicklung moderner, einzigartiger Websites mit den neuesten Technologien. Ob Unternehmenswebsite, Webshop oder Landingpage, wir verwirklichen Ihr digitales Projekt.",
  cta: "Referenzen ansehen",
  quote: "Angebot anfordern",
  stats: {
    projects: "Abgeschlossene Projekte",
    clients: "Zufriedene Kunden",
    experience: "Jahre Erfahrung"
  },
  floatingCard: {
    title: "Schnelle Entwicklung",
    subtitle: "2-4 Wochen Bearbeitungszeit"
  }
};
const references = {
  title: "Unsere Referenzen",
  subtitle: "Wir sind stolz auf das, was wir bisher erreicht haben. Sehen Sie sich unsere neuesten Projekte an und überzeugen Sie sich von unserer Expertise!",
  filters: {
    category: "Kategorie",
    tech: "Technologie",
    all: "Alle"
  },
  noResults: "Keine Ergebnisse für die ausgewählten Filter.",
  categories: {
    Mind: "Alle",
    "Vállalati": "Unternehmen",
    Webshop: "Webshop",
    "Landing page": "Landingpage",
    "Egyéb": "Andere"
  },
  modal: {
    description: "Beschreibung",
    features: "Hauptfunktionen",
    techStack: "Technologie-Stack"
  },
  items: [
    {
      id: "1",
      name: "TechVision Consulting",
      category: "Unternehmen",
      shortDescription: "Moderne Unternehmenswebsite mit komplexer Leistungspräsentation und Kundenportal.",
      fullDescription: "Eine komplexe Unternehmenswebsite für TechVision Consulting, die das breite Leistungsportfolio des Unternehmens mit modernem Design und benutzerfreundlicher Oberfläche präsentiert. Die Seite beinhaltet ein Login-pflichtiges Kundenportal, dynamisches Content-Management und mehrsprachige Unterstützung.",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS"
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Magyar Zsolt, TechVision CEO",
      clientQuote: "Hervorragende Arbeit! Die Website bietet genau das, was wir brauchten. Professionelle, schnelle und effiziziente Zusammenarbeit.",
      features: [
        "Responsives Design auf allen Geräten",
        "Login-pflichtiges Kundenportal",
        "Dynamisches Content-Management-System",
        "SEO-Optimierung",
        "Mehrsprachige Unterstützung (HU/EN)"
      ]
    },
    {
      id: "2",
      name: "FreshMarket Webshop",
      category: "Webshop",
      shortDescription: "Umfassende E-Commerce-Plattform für den Online-Verkauf von frischen Lebensmitteln.",
      fullDescription: "Komplette Webshop-Lösung für FreshMarket, die den Online-Verkauf von frischen Lebensmitteln ermöglicht. Die Seite beinhaltet Warenkorbfunktion, Zahlungs-Gateway-Integration, Lagerverwaltung und automatische Bestellabwicklung.",
      techStack: [
        "React",
        "Node.js",
        "Stripe",
        "MongoDB",
        "Redis"
      ],
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Kovács Anna, FreshMarket Inhaber",
      clientQuote: "Fantastisches Ergebnis! Unser Umsatz ist seit Einführung des neuen Webshops um 40% gestiegen. Vielen Dank für die präzise Arbeit!",
      features: [
        "Warenkorb- und Zahlungssystem",
        "Stripe-Zahlungsintegration",
        "Lagerverwaltung",
        "Verwaltungsoberfläche",
        "Automatische E-Mail-Benachrichtigungen"
      ]
    },
    {
      id: "3",
      name: "EventHub Landing",
      category: "Landingpage",
      shortDescription: "Klare Landingpage zur Präsentation einer Event-Organisationsplattform.",
      fullDescription: "Professionelle Landingpage für die EventHub Event-Organisationsplattform. Ziel war eine konversionsmaximierende, moderne One-Page-Website, die die Vorteile der Plattform effektiv präsentiert und zur Registrierung anregt.",
      techStack: [
        "React",
        "Tailwind CSS",
        "Framer Motion"
      ],
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Nagy Péter, EventHub Marketing Lead",
      clientQuote: "Die Konversionsrate der Landingpage ist hervorragend! Modernes, auffälliges Design, schnelle Ladezeit. Hat alle unsere Erwartungen übertroffen.",
      features: [
        "Animierter Hero-Bereich",
        "Konversionsoptimierte CTAs",
        "Schnelle Ladezeit",
        "Optimiert für A/B-Tests",
        "Google Analytics Integration"
      ]
    },
    {
      id: "4",
      name: "HealthPlus Klinik",
      category: "Unternehmen",
      shortDescription: "Komplexe Webpräsenz für eine Gesundheitsklinik mit Terminbuchung.",
      fullDescription: "Komplexe Website für die Privatklinik HealthPlus, inklusive Online-Terminbuchungssystem, Arztprofilseiten, Leistungspräsentationen und Blogfunktion. Das moderne, saubere Erscheinungsbild der Seite schafft Vertrauen bei den Besuchern.",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Next.js"
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
      ],
      rating: 5,
      clientName: "Dr. Szabó Katalin, HealthPlus Direktor",
      clientQuote: "Ausgezeichnete Arbeit! Die Online-Terminbuchung hat unseren Verwaltungsaufwand erheblich reduziert, und die Patienten lieben das System.",
      features: [
        "Online-Terminbuchung",
        "Arztprofilseiten",
        "Blog und Neuigkeiten",
        "E-Mail-Benachrichtigungssystem",
        "Patientenportal"
      ]
    },
    {
      id: "5",
      name: "StyleBoutique Shop",
      category: "Webshop",
      shortDescription: "Premium-Mode-Webshop mit einzigartigen Produkten und Stilberater.",
      fullDescription: "Eleganter Webshop für StyleBoutique mit Premium-Damen- und Herrenbekleidung. Die Seite beinhaltet einen interaktiven Stilberater, detaillierte Produktpräsentationen, Wunschlistenfunktion und integrierte Social-Media-Funktionen.",
      techStack: [
        "React",
        "Next.js",
        "Shopify API",
        "Tailwind CSS",
        "Vercel"
      ],
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
      ],
      rating: 4,
      clientName: "Tóth Eszter, StyleBoutique Brand Manager",
      clientQuote: "Wunderbare Arbeit! Der interaktive Stilberater bietet unseren Kunden ein einzigartiges Erlebnis.",
      features: [
        "Interaktiver Stilberater",
        "Wunschlistenfunktion",
        "Shopify-Integration",
        "Social-Media-Integration",
        "Produkt-Schnellansicht"
      ]
    },
    {
      id: "6",
      name: "FitLife Gym",
      category: "Unternehmen",
      shortDescription: "Fitnessstudio-Website mit Kursplanfreigabe und Mitgliederverwaltung.",
      fullDescription: "Moderne Fitnessstudio-Website mit interaktiver Kursplanansicht, Trainervorstellungen und Online-Mitgliedschaftskaufoptionen. Das responsive Design der Seite funktioniert perfekt auf Mobilgeräten, sodass Mitglieder den Kursplan unterwegs überprüfen können.",
      techStack: [
        "React",
        "Firebase",
        "Tailwind CSS"
      ],
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
      ],
      rating: 4,
      clientName: "Kiss Gábor, FitLife Inhaber",
      clientQuote: "Wir sind sehr zufrieden! Unsere Mitglieder nutzen die Online-Kursplanfunktion häufig.",
      features: [
        "Interaktiver Kursplan",
        "Trainervorstellungsseite",
        "Online-Mitgliedschaftskauf",
        "Mobile App-Kompatibilität",
        "Push-Benachrichtigungen"
      ]
    }
  ]
};
const services = {
  title: "Unsere Dienstleistungen",
  subtitle: "Wir bieten umfassende Webentwicklungsdienste, von der Idee bis zur fertigen Website. Was auch immer Ihr Projekt ist, wir helfen Ihnen bei der Umsetzung!",
  items: [
    {
      id: "1",
      title: "Individuelle Webentwicklung",
      description: "Erstellung vollständig personalisierter Websites mit modernsten Technologien. Responsives Design, schnelles Laden, SEO-Optimierung.",
      icon: "Code"
    },
    {
      id: "2",
      title: "Landingpage-Erstellung",
      description: "Konversionsmaximierende One-Page-Websites, die Ihr Produkt oder Ihre Dienstleistung effektiv präsentieren und Besucher zum Handeln anregen.",
      icon: "Rocket"
    },
    {
      id: "3",
      title: "Webshop-Entwicklung",
      description: "Umfassende E-Commerce-Lösungen mit Warenkorbfunktion, Zahlungssystemintegration, Lagerverwaltung und Verwaltungsoberfläche.",
      icon: "ShoppingCart"
    },
    {
      id: "4",
      title: "Website-Redesign",
      description: "Auffrischung Ihrer veralteten Website mit modernem, benutzerfreundlichem Design. Wir behalten bestehende Inhalte bei, hauchen ihnen aber neues Leben ein.",
      icon: "RefreshCw"
    }
  ],
  examples: {
    title: "Beispiel-Websites",
    subtitle: "Einige Beispiele für die Arten von Websites, die wir erstellen",
    corporate: {
      title: "Unternehmenswebsite",
      desc: "Professionelles Erscheinungsbild, Leistungspräsentation, Kontaktmöglichkeiten"
    },
    landing: {
      title: "Landingpage",
      desc: "Konversionsmaximierende One-Page-Website zur Produkt- oder Leistungspräsentation"
    },
    ecommerce: {
      title: "E-Commerce-Webshop",
      desc: "Vollwertiger Online-Shop mit Warenkorbfunktion, Zahlungssystem"
    }
  }
};
const reviews = {
  title: "Was unsere Kunden sagen",
  subtitle: "Wir sind stolz darauf, dass unsere Kunden mit unserer Arbeit zufrieden sind. Sehen Sie, was sie über uns sagen!",
  hint: "Fahren Sie mit der Maus über die Bewertungen, um anzuhalten",
  items: [
    {
      id: "1",
      clientName: "Molnár Rita",
      rating: 5,
      text: "Fantastisches Team! Sie haben meine Vision genau verstanden und eine wunderschöne Website erstellt. Die Kommunikation war durchweg hervorragend, ich erhielt sofort Antworten auf alle meine Fragen."
    },
    {
      id: "2",
      clientName: "Horváth Tamás",
      rating: 5,
      text: "Professionelle, schnelle und zuverlässige Arbeit. Unser Website-Traffic ist seit Einführung des neuen Designs deutlich gestiegen. Ich kann sie jedem empfehlen!"
    },
    {
      id: "3",
      clientName: "Varga Judit",
      rating: 5,
      text: "Hervorragendes Preis-Leistungs-Verhältnis! Unser Webshop hat alle unsere Erwartungen erfüllt. Ihr Kundensupport ist ebenfalls hervorragend, sie helfen jederzeit, wenn nötig."
    },
    {
      id: "4",
      clientName: "Farkas Zsolt",
      rating: 4,
      text: "Ich bin sehr zufrieden mit dem Ergebnis. Modernes, sauberes Design, schnelles Laden. Ich habe um zwei kleine Änderungen gebeten, die sie sofort gelöst haben."
    },
    {
      id: "5",
      clientName: "Lakatos Éva",
      rating: 5,
      text: "Die beste Entscheidung war, mit ihnen zu arbeiten! Kreativ, professionell und detailorientiert. Unsere Landingpage-Konversionsrate hat sich verdoppelt!"
    },
    {
      id: "6",
      clientName: "Németh András",
      rating: 5,
      text: "Professionelle Einstellung von Anfang bis zur endgültigen Übergabe. Die Seite ist schnell, modern und bietet genau das, was unser Unternehmen brauchte."
    },
    {
      id: "7",
      clientName: "Balogh Márta",
      rating: 5,
      text: "Wir haben nicht nur eine Website bekommen, sondern eine komplette digitale Präsenz. SEO, Design, Funktionalität - alles ist perfekt geworden!"
    },
    {
      id: "8",
      clientName: "Papp Gergő",
      rating: 4,
      text: "Ausgezeichnete Arbeit, präzise Fristen. Das Einzige, was ich mir besser gewünscht hätte, wäre eine detailliertere erste Anleitung, aber das ist nur ein kleines Detail."
    }
  ]
};
const about = {
  title: "Wer sind wir?",
  subtitle: "Das NovyxDev-Team besteht aus leidenschaftlichen Webentwicklern, die glauben, dass jedes Unternehmen eine professionelle Online-Präsenz verdient.",
  mission: {
    title: "Unsere Mission",
    text: "Unser Ziel ist es, für jeden Kunden einzigartige, hochwertige Websites zu erstellen, die nicht nur schön, sondern auch funktional herausragend sind. Wir glauben, dass eine gute Website die Grundlage für ein erfolgreiches Unternehmen ist."
  },
  story: {
    title: "Unsere Geschichte",
    text: "Wir begannen 2018 mit dem Ziel, ungarischen Kleinunternehmen Zugang zu erstklassigen Webentwicklungsdiensten zu ermöglichen. Seitdem haben wir über 50 erfolgreiche Projekte realisiert und erweitern unser Fachwissen ständig um neue Technologien."
  },
  whyUs: {
    title: "Warum uns wählen?",
    items: [
      "Schnelle und effiziente Arbeit - durchschnittlich 2-4 Wochen Bearbeitungszeit",
      "Moderne Technologien - React, TypeScript, Node.js",
      "Responsives Design auf allen Geräten",
      "SEO-optimierte Websites",
      "Kontinuierlicher Support und Wartung",
      "Transparente Preisgestaltung - keine versteckten Kosten"
    ]
  },
  team: {
    title: "Unser Team",
    subtitle: "Lernen Sie das NovyxDev-Team kennen",
    items: [
      {
        id: "1",
        name: "Kovács Márk",
        role: "Lead Developer",
        description: "10+ Jahre Erfahrung in Full-Stack-Entwicklung. Experte in React, Node.js und Cloud-Technologien.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
      },
      {
        id: "2",
        name: "Nagy Viktória",
        role: "UI/UX Designer",
        description: "Leidenschaftlicher Designer, der die Benutzererfahrung in den Mittelpunkt stellt. Gewinner mehrerer internationaler Designpreise.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
      },
      {
        id: "3",
        name: "Szabó Dávid",
        role: "Backend-Experte",
        description: "Spezialist für Datenbankarchitektur und API-Entwicklung. Sucht immer nach den optimalsten Lösungen.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
      },
      {
        id: "4",
        name: "Tóth Lilla",
        role: "Projektmanager",
        description: "Sorgt dafür, dass jedes Projekt pünktlich und innerhalb des Budgets abgeschlossen wird. Hervorragende Kommunikationsfähigkeiten.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
      }
    ]
  }
};
const contact = {
  title: "Kontaktieren Sie uns!",
  subtitle: "Haben Sie eine Idee, die Sie in eine professionelle Website verwandeln möchten? Schreiben Sie uns mutig! Erzählen Sie uns, was Sie tun, welche Art von Website Sie sich vorgestellt haben, und wir helfen Ihnen, die beste Lösung zu finden.",
  form: {
    name: "Name",
    namePlaceholder: "Ihr vollständiger Name",
    email: "E-Mail-Adresse",
    emailPlaceholder: "email@beispiel.de",
    subject: "Betreff",
    subjectPlaceholder: "Wie können wir helfen?",
    message: "Nachricht",
    messagePlaceholder: "Beschreiben Sie Ihr Projekt und Ihre Ideen im Detail...",
    submit: "Nachricht senden",
    sending: "Senden...",
    successTitle: "Nachricht gesendet!",
    successDesc: "Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.",
    errorTitle: "Ein Fehler ist aufgetreten",
    errorDesc: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."
  },
  info: {
    title: "Unsere Kontakte",
    subtitle: "Zögern Sie nicht, uns über eine unserer Kontaktmöglichkeiten zu erreichen! Wir beantworten jede Anfrage innerhalb von 24 Stunden.",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    addressText: "1111 Budapest<br />Beispielstraße 42."
  },
  card: {
    title: "Schnelle Reaktionszeit",
    text: "Wir antworten in der Regel auf jede Anfrage innerhalb von 2-4 Stunden während der Arbeitszeit (Mo-Fr 9:00-17:00). Wir versuchen, auch am Wochenende so schnell wie möglich zu reagieren."
  }
};
const footer = {
  rights: "© {{year}} NovyxDev. Alle Rechte vorbehalten.",
  impressum: "Impressum",
  privacy: "Datenschutzerklärung"
};
const de = {
  common,
  nav,
  hero,
  references,
  services,
  reviews,
  about,
  contact,
  footer
};
const resources = {
  hu: { translation: hu },
  en: { translation: en },
  de: { translation: de }
};
const initI18n = () => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      fallbackLng: "hu",
      debug: false,
      interpolation: {
        escapeValue: false
      },
      // Use LanguageDetector only on client side
      ...typeof window !== "undefined" ? {
        detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"]
        }
      } : {}
    });
    if (typeof window !== "undefined") {
      i18n.use(LanguageDetector);
    }
  }
  return i18n;
};
initI18n();
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary-border",
        destructive: "bg-destructive text-destructive-foreground border border-destructive-border",
        outline: (
          // Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color.
          " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none "
        ),
        secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // Add a transparent border so that when someone toggles a border on later, it doesn't shift layout/size.
        ghost: "border border-transparent"
      },
      // Heights are set as "min" heights, because sometimes Ai will place large amount of content
      // inside buttons. With a min-height they will look appropriate with small amounts of content,
      // but will expand to fit large amounts of content.
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const menuItems = [
  { label: "nav.home", href: "#home" },
  { label: "nav.references", href: "#references" },
  { label: "nav.services", href: "#services" },
  { label: "nav.about", href: "#about" },
  { label: "nav.contact", href: "#contact" }
];
const languages = [
  { code: "hu", label: "Magyar" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" }
];
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n: i18n2 } = useTranslation();
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };
  const changeLanguage = (lng) => {
    i18n2.changeLanguage(lng);
  };
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"}`,
      children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollToSection("#home"),
            className: "text-2xl font-bold text-primary hover-elevate px-2 py-1 rounded-md",
            "data-testid": "link-logo",
            children: t("common.novyxDev")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: menuItems.map((item) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => scrollToSection(item.href),
              className: "px-4 py-2 text-foreground hover-elevate rounded-md transition-colors",
              "data-testid": `link-${t(item.label).toLowerCase()}`,
              children: t(item.label)
            },
            item.href
          )) }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "ml-2", children: [
              /* @__PURE__ */ jsx(Globe, { className: "h-[1.2rem] w-[1.2rem]" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Switch language" })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: languages.map((lang) => /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => changeLanguage(lang.code),
                className: "justify-between",
                children: [
                  lang.label,
                  i18n2.language === lang.code && /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 ml-2" })
                ]
              },
              lang.code
            )) })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
              className: "transition-all duration-300",
              children: [
                /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
                /* @__PURE__ */ jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex md:hidden items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
              children: [
                /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
                /* @__PURE__ */ jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", children: [
              /* @__PURE__ */ jsx(Globe, { className: "h-[1.2rem] w-[1.2rem]" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Switch language" })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: languages.map((lang) => /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => changeLanguage(lang.code),
                className: "justify-between",
                children: [
                  lang.label,
                  i18n2.language === lang.code && /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 ml-2" })
                ]
              },
              lang.code
            )) })
          ] }),
          /* @__PURE__ */ jsxs(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: [
            /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                "data-testid": "button-mobile-menu",
                children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
              }
            ) }),
            /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "w-64", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 mt-8", children: menuItems.map((item) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => scrollToSection(item.href),
                className: "text-left px-4 py-3 text-lg hover-elevate rounded-md transition-colors",
                "data-testid": `link-mobile-${t(item.label).toLowerCase()}`,
                children: t(item.label)
              },
              item.href
            )) }) })
          ] })
        ] })
      ] }) })
    }
  );
}
function Hero() {
  const { t } = useTranslation();
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "home",
      className: "min-h-screen flex items-center justify-center bg-background pt-16 px-4",
      children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight", children: /* @__PURE__ */ jsxs(Trans, { i18nKey: "hero.title", children: [
              "Professzionális weboldalak a ",
              /* @__PURE__ */ jsx("span", { className: "text-primary", children: "NovyxDev-től" })
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl text-muted-foreground", children: t("hero.subtitle") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                onClick: () => scrollToSection("#references"),
                className: "text-base gap-2",
                "data-testid": "button-view-references",
                children: [
                  /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" }),
                  t("hero.cta")
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                variant: "outline",
                onClick: () => scrollToSection("#contact"),
                className: "text-base gap-2",
                "data-testid": "button-request-quote",
                children: [
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" }),
                  t("hero.quote")
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-8 pt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary", children: "50+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: t("hero.stats.projects") })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary", children: "100%" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: t("hero.stats.clients") })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary", children: "5+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: t("hero.stats.experience") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-border bg-card p-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-lg p-4 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-primary/30" }),
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-primary/30" }),
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-primary/30" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 h-6 bg-background rounded" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 bg-background rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 bg-primary rounded w-1/3" }),
              /* @__PURE__ */ jsx("div", { className: "h-8 bg-primary/20 rounded w-2/3" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-full" }),
                /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-5/6" }),
                /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-4/6" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 mt-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-20 bg-primary/10 rounded-lg" }),
                /* @__PURE__ */ jsx("div", { className: "h-20 bg-primary/10 rounded-lg" }),
                /* @__PURE__ */ jsx("div", { className: "h-20 bg-primary/10 rounded-lg" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-6 -left-6 bg-card border border-card-border rounded-lg shadow-xl p-6 max-w-xs hidden sm:block", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Rocket, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground", children: t("hero.floatingCard.title") }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: t("hero.floatingCard.subtitle") })
            ] })
          ] }) })
        ] })
      ] }) })
    }
  );
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "shadcn-card rounded-xl border bg-card border-card-border text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate ",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline: " border [border-color:var(--badge-outline)] shadow-xs"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Dialog = SheetPrimitive.Root;
const DialogPortal = SheetPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = SheetPrimitive.Description.displayName;
function ReferenceModal({ reference, onClose }) {
  const { t } = useTranslation();
  const renderStars = (rating) => {
    return /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
      Star,
      {
        className: `w-5 h-5 ${star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"}`
      },
      star
    )) });
  };
  return /* @__PURE__ */ jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", "data-testid": "modal-reference", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-bold", children: reference.name }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 mt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: reference.images.map((image, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "aspect-video rounded-lg overflow-hidden border border-border",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: image,
              alt: `${reference.name} - ${index + 1}`,
              className: "w-full h-full object-cover"
            }
          )
        },
        index
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-base px-4 py-1", children: reference.category }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          renderStars(reference.rating),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "(",
            reference.rating,
            "/5)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-foreground", children: t("references.modal.description") }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: reference.fullDescription })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-foreground", children: t("references.modal.features") }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: reference.features.map((feature, index) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-start gap-3 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-0.5 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: feature })
            ]
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-foreground", children: t("references.modal.techStack") }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: reference.techStack.map((tech) => /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "outline",
            className: "text-sm px-3 py-1",
            children: tech
          },
          tech
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-6 space-y-3 border border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl", children: '"' }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground italic leading-relaxed", children: reference.clientQuote })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("p", { className: "font-medium text-foreground", children: [
          "- ",
          reference.clientName
        ] }) })
      ] })
    ] })
  ] }) });
}
const techStacks = ["React", "TypeScript", "Node.js", "Next.js", "WordPress", "Tailwind CSS"];
function References() {
  const { t, i18n: i18n2 } = useTranslation();
  const categoriesMap = t("references.categories", { returnObjects: true });
  const allCategory = categoriesMap["Mind"];
  const [selectedCategory, setSelectedCategory] = useState(allCategory);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  useEffect(() => {
    setSelectedCategory(allCategory);
  }, [i18n2.language]);
  const references2 = t("references.items", { returnObjects: true });
  const categories = Object.values(categoriesMap);
  const filteredReferences = references2.filter((ref) => {
    const categoryMatch = selectedCategory === allCategory || ref.category === selectedCategory;
    const techMatch = selectedTech.length === 0 || selectedTech.some((tech) => ref.techStack.includes(tech));
    return categoryMatch && techMatch;
  });
  const toggleTech = (tech) => {
    setSelectedTech(
      (prev) => prev.includes(tech) ? prev.filter((t2) => t2 !== tech) : [...prev, tech]
    );
  };
  const renderStars = (rating) => {
    return /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
      Star,
      {
        className: `w-4 h-4 ${star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"}`
      },
      star
    )) });
  };
  return /* @__PURE__ */ jsxs("section", { id: "references", className: "py-20 px-4 bg-secondary/30", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground", children: t("references.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: t("references.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 mb-12", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground mb-3", children: t("references.filters.category") }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((category) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: selectedCategory === category ? "default" : "outline",
              size: "sm",
              onClick: () => setSelectedCategory(category),
              "data-testid": `filter-category-${category.toLowerCase()}`,
              children: category
            },
            category
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground mb-3", children: t("references.filters.tech") }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: techStacks.map((tech) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: selectedTech.includes(tech) ? "default" : "outline",
              size: "sm",
              onClick: () => toggleTech(tech),
              "data-testid": `filter-tech-${tech.toLowerCase()}`,
              children: tech
            },
            tech
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredReferences.map((reference) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "overflow-hidden hover-elevate cursor-pointer transition-all duration-300 hover:shadow-xl",
          onClick: () => setSelectedReference(reference),
          "data-testid": `card-reference-${reference.id}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: reference.imageUrl,
                alt: reference.name,
                className: "w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-foreground", children: reference.name }),
                  renderStars(reference.rating)
                ] }),
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", "data-testid": `badge-category-${reference.id}`, children: reference.category })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: reference.shortDescription }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                reference.techStack.slice(0, 3).map((tech) => /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs",
                    "data-testid": `badge-tech-${reference.id}-${tech.toLowerCase()}`,
                    children: tech
                  },
                  tech
                )),
                reference.techStack.length > 3 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                  "+",
                  reference.techStack.length - 3
                ] })
              ] })
            ] })
          ]
        },
        reference.id
      )) }),
      filteredReferences.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("references.noResults") }) })
    ] }),
    selectedReference && /* @__PURE__ */ jsx(
      ReferenceModal,
      {
        reference: selectedReference,
        onClose: () => setSelectedReference(null)
      }
    )
  ] });
}
const iconMap = {
  Code,
  Rocket,
  ShoppingCart,
  RefreshCw
};
function Services() {
  const { t } = useTranslation();
  const services2 = t("services.items", { returnObjects: true });
  return /* @__PURE__ */ jsx("section", { id: "services", className: "py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground", children: t("services.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: t("services.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16", children: services2.map((service) => {
      const Icon = iconMap[service.icon];
      return /* @__PURE__ */ jsxs(
        Card,
        {
          className: "p-6 space-y-4 hover-elevate transition-all duration-300 hover:shadow-lg",
          "data-testid": `card-service-${service.id}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-xl text-foreground", children: service.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: service.description })
          ]
        },
        service.id
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl sm:text-3xl font-bold text-foreground mb-2", children: t("services.examples.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("services.examples.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden hover-elevate transition-all duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
              alt: "Vállalati weboldal példa",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-2", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg text-foreground", children: t("services.examples.corporate.title") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("services.examples.corporate.desc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden hover-elevate transition-all duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
              alt: "Landing page példa",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-2", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg text-foreground", children: t("services.examples.landing.title") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("services.examples.landing.desc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden hover-elevate transition-all duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop",
              alt: "Webshop példa",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-2", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg text-foreground", children: t("services.examples.ecommerce.title") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("services.examples.ecommerce.desc") })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function Reviews() {
  const { t } = useTranslation();
  const reviews2 = t("reviews.items", { returnObjects: true });
  const renderStars = (rating) => {
    return /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
      Star,
      {
        className: `w-4 h-4 ${star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"}`
      },
      star
    )) });
  };
  const duplicatedReviews = [...reviews2, ...reviews2];
  return /* @__PURE__ */ jsxs("section", { className: "py-20 px-4 bg-secondary/30 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto mb-12", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground", children: t("reviews.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: t("reviews.subtitle") })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6 animate-scroll", children: duplicatedReviews.map((review, index) => /* @__PURE__ */ jsxs(
      Card,
      {
        className: "flex-shrink-0 w-80 sm:w-96 p-6 space-y-4",
        "data-testid": `card-review-${review.id}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground", children: review.clientName }),
            renderStars(review.rating)
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground leading-relaxed", children: [
            '"',
            review.text,
            '"'
          ] })
        ]
      },
      `${review.id}-${index}`
    )) }) }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("reviews.hint") }) })
  ] });
}
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      `
      after:content-[''] after:block after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:border after:border-black/10 dark:after:border-white/10
      relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full`,
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function About() {
  const { t } = useTranslation();
  const teamMembers = t("about.team.items", { returnObjects: true });
  const whyUs = t("about.whyUs.items", { returnObjects: true });
  return /* @__PURE__ */ jsx("section", { id: "about", className: "py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground", children: t("about.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: t("about.subtitle") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 mb-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-foreground mb-4", children: t("about.mission.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: t("about.mission.text") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-foreground mb-4", children: t("about.story.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: t("about.story.text") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-foreground mb-6", children: t("about.whyUs.title") }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: whyUs.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: item })
        ] }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl sm:text-3xl font-bold text-foreground mb-2", children: t("about.team.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("about.team.subtitle") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: teamMembers.map((member) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "p-6 space-y-4 text-center hover-elevate transition-all duration-300",
          "data-testid": `card-team-${member.id}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(Avatar, { className: "w-24 h-24", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: member.imageUrl, alt: member.name }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "text-2xl", children: member.name.split(" ").map((n) => n[0]).join("") })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg text-foreground", children: member.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-primary font-medium", children: member.role })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: member.description })
          ]
        },
        member.id
      )) })
    ] })
  ] }) });
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String((error == null ? void 0 : error.message) ?? "") : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-sm font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true
}).extend({
  name: z.string().min(2, "A név legalább 2 karakter hosszú legyen"),
  email: z.string().email("Érvényes email címet adj meg"),
  subject: z.string().min(3, "A tárgy legalább 3 karakter hosszú legyen"),
  message: z.string().min(10, "Az üzenet legalább 10 karakter hosszú legyen")
});
function Contact() {
  const { toast: toast2 } = useToast();
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  const contactMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response;
    },
    onSuccess: () => {
      form.reset();
      toast2({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successDesc"),
        duration: 5e3
      });
    },
    onError: (error) => {
      toast2({
        title: t("contact.form.errorTitle"),
        description: error.message || t("contact.form.errorDesc"),
        variant: "destructive",
        duration: 5e3
      });
    }
  });
  const onSubmit = async (data) => {
    contactMutation.mutate(data);
  };
  return /* @__PURE__ */ jsx("section", { id: "contact", className: "py-20 px-4 bg-secondary/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground", children: t("contact.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: t("contact.subtitle") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsx(Card, { className: "p-8", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("contact.form.name") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: t("contact.form.namePlaceholder"),
                  ...field,
                  "data-testid": "input-name"
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("contact.form.email") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "email",
                  placeholder: t("contact.form.emailPlaceholder"),
                  ...field,
                  "data-testid": "input-email"
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "subject",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("contact.form.subject") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: t("contact.form.subjectPlaceholder"),
                  ...field,
                  "data-testid": "input-subject"
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "message",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("contact.form.message") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: t("contact.form.messagePlaceholder"),
                  rows: 6,
                  ...field,
                  "data-testid": "input-message"
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "submit",
            size: "lg",
            className: "w-full gap-2",
            disabled: contactMutation.isPending,
            "data-testid": "button-submit",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" }),
              contactMutation.isPending ? t("contact.form.sending") : t("contact.form.submit")
            ]
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-foreground mb-6", children: t("contact.info.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-8", children: t("contact.info.subtitle") }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground mb-1", children: t("contact.info.email") }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "mailto:info@novyxdev.hu",
                    className: "text-primary hover:underline",
                    "data-testid": "link-email",
                    children: "info@novyxdev.hu"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Phone, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground mb-1", children: t("contact.info.phone") }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "tel:+36301234567",
                    className: "text-primary hover:underline",
                    "data-testid": "link-phone",
                    children: "+36 30 123 4567"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground mb-1", children: t("contact.info.address") }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(Trans, { i18nKey: "contact.info.addressText" }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-6 bg-primary/5 border-primary/20", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-3", children: t("contact.card.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("contact.card.text") })
        ] })
      ] })
    ] })
  ] }) });
}
function Footer() {
  const { t } = useTranslation();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "bg-card border-t border-border py-12 px-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left", children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary mb-2", children: t("common.novyxDev") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("footer.rights", { year: currentYear }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#",
          className: "text-sm text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md transition-colors",
          "data-testid": "link-impresszum",
          children: t("footer.impressum")
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#",
          className: "text-sm text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md transition-colors",
          "data-testid": "link-privacy",
          children: t("footer.privacy")
        }
      )
    ] })
  ] }) }) });
}
function Home() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(References, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(Reviews, {}),
    /* @__PURE__ */ jsx(About, {}),
    /* @__PURE__ */ jsx(Contact, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsx(Card, { className: "w-full max-w-md mx-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex mb-4 gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "404 Page Not Found" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600", children: "Did you forget to add the page to the router?" })
  ] }) }) });
}
function Router() {
  return /* @__PURE__ */ jsxs(Switch, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", component: Home }),
    /* @__PURE__ */ jsx(Route, { component: NotFound })
  ] });
}
function App({ queryClient: qc = queryClient }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: qc, children: /* @__PURE__ */ jsxs(ThemeProvider, { defaultTheme: "dark", storageKey: "novyxdev-ui-theme", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        "NovyxDev - ",
        t("hero.title", { defaultValue: "Professzionális Weboldal Fejlesztés" }).replace(/<[^>]*>/g, "")
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: t("hero.subtitle", { defaultValue: "Modern, egyedi weboldalak fejlesztése a legújabb technológiákkal." }) }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: `NovyxDev - ${t("hero.title", { defaultValue: "Professzionális Weboldal Fejlesztés" }).replace(/<[^>]*>/g, "")}` }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: t("hero.subtitle", { defaultValue: "Modern, egyedi weboldalak fejlesztése a legújabb technológiákkal." }) })
    ] }),
    /* @__PURE__ */ jsxs(TooltipProvider, { children: [
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(Router, {})
    ] })
  ] }) });
}
function render(url) {
  const helmetContext = {};
  const queryClient2 = new QueryClient();
  const staticLocationHook = (path = url) => {
    return () => [path, (to) => {
    }];
  };
  const appHtml = renderToString(
    /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(Router$1, { hook: staticLocationHook(url), children: /* @__PURE__ */ jsx(App, { queryClient: queryClient2 }) }) })
  );
  return { appHtml, helmetContext };
}
export {
  render
};
