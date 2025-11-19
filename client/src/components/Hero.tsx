import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Rocket } from "lucide-react";

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-background pt-16 px-4"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Professzionális weboldalak a{" "}
                <span className="text-primary">NovyxDev-től</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Modern, egyedi weboldalak fejlesztése a legújabb technológiákkal.
                Legyen szó vállalati weboldalról, webshopról vagy landing page-ről,
                mi megvalósítjuk álmaid digitális projektjét.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("#references")}
                className="text-base gap-2"
                data-testid="button-view-references"
              >
                <Eye className="w-5 h-5" />
                Referenciáink megtekintése
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#contact")}
                className="text-base gap-2"
                data-testid="button-request-quote"
              >
                <ArrowRight className="w-5 h-5" />
                Ajánlatkérés
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Elkészült projekt</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Elégedett ügyfél</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">Év tapasztalat</div>
              </div>
            </div>
          </div>

          {/* Right content - Abstract Mockup using solid colors */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-border bg-card p-8">
              {/* Browser chrome */}
              <div className="bg-secondary rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                  </div>
                  <div className="flex-1 h-6 bg-background rounded"></div>
                </div>
                
                {/* Website content mockup */}
                <div className="space-y-3 bg-background rounded-lg p-6">
                  <div className="h-4 bg-primary rounded w-1/3"></div>
                  <div className="h-8 bg-primary/20 rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/6"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="h-20 bg-primary/10 rounded-lg"></div>
                    <div className="h-20 bg-primary/10 rounded-lg"></div>
                    <div className="h-20 bg-primary/10 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-card-border rounded-lg shadow-xl p-6 max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Gyors fejlesztés</div>
                  <div className="text-sm text-muted-foreground">2-4 hét átfutás</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
