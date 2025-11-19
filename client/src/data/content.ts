import type { Reference, Service, Review, TeamMember } from "@shared/schema";

export const references: Reference[] = [
  {
    id: "1",
    name: "TechVision Consulting",
    category: "Vállalati",
    shortDescription: "Modern vállalati weboldal komplex szolgáltatás bemutatással és ügyfélportállal.",
    fullDescription: "A TechVision Consulting számára készített komplex vállalati weboldal, amely modern dizájnnal és felhasználóbarát felülettel mutatja be a cég széles szolgáltatási portfólióját. Az oldal tartalmaz egy bejelentkezést igénylő ügyfélportált, dinamikus tartalomkezelést és többnyelvű támogatást.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
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
    techStack: ["React", "Node.js", "Stripe", "MongoDB", "Redis"],
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
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
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
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js"],
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
    techStack: ["React", "Next.js", "Shopify API", "Tailwind CSS", "Vercel"],
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
    techStack: ["React", "Firebase", "Tailwind CSS"],
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
];

export const services: Service[] = [
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
];

export const reviews: Review[] = [
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
];

export const teamMembers: TeamMember[] = [
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
];
