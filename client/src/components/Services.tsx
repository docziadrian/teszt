import { Card } from "@/components/ui/card";
import { Code, Rocket, ShoppingCart, RefreshCw } from "lucide-react";
import { services } from "@/data/content";

const iconMap = {
  Code: Code,
  Rocket: Rocket,
  ShoppingCart: ShoppingCart,
  RefreshCw: RefreshCw,
};

export function Services() {
  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Szolgáltatásaink
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Teljes körű webfejlesztési szolgáltatásokat kínálunk, az ötlettől a
            kész weboldalig. Bármilyen projekted van, mi segítünk megvalósítani!
          </p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <Card
                key={service.id}
                className="p-6 space-y-4 hover-elevate transition-all duration-300 hover:shadow-lg"
                data-testid={`card-service-${service.id}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Example websites */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Példa weboldalak
            </h3>
            <p className="text-muted-foreground">
              Néhány példa arra, milyen típusú weboldalakat készítünk
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover-elevate transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
                  alt="Vállalati weboldal példa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="font-semibold text-lg text-foreground">
                  Vállalati weboldal
                </h4>
                <p className="text-sm text-muted-foreground">
                  Professzionális megjelenés, szolgáltatások bemutatása,
                  kapcsolatfelvételi lehetőségek
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden hover-elevate transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                  alt="Landing page példa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="font-semibold text-lg text-foreground">
                  Landing page
                </h4>
                <p className="text-sm text-muted-foreground">
                  Konverziót maximalizáló egyoldalas weboldal termék vagy
                  szolgáltatás bemutatására
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden hover-elevate transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
                  alt="Webshop példa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="font-semibold text-lg text-foreground">
                  E-commerce webshop
                </h4>
                <p className="text-sm text-muted-foreground">
                  Teljes értékű online áruház kosárfunkcióval, fizetési
                  rendszerrel
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
