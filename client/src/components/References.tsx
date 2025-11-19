import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { references } from "@/data/content";
import type { Reference } from "@shared/schema";
import { ReferenceModal } from "./ReferenceModal";

const categories = ["Mind", "Vállalati", "Webshop", "Landing page", "Egyéb"];
const techStacks = ["React", "TypeScript", "Node.js", "Next.js", "WordPress", "Tailwind CSS"];

export function References() {
  const [selectedCategory, setSelectedCategory] = useState("Mind");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);

  const filteredReferences = references.filter((ref) => {
    const categoryMatch =
      selectedCategory === "Mind" || ref.category === selectedCategory;
    const techMatch =
      selectedTech.length === 0 ||
      selectedTech.some((tech) => ref.techStack.includes(tech));
    return categoryMatch && techMatch;
  });

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="references" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Referencia munkáink
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Büszkék vagyunk arra, amit eddig elértünk. Nézd meg legfrissebb projektjeinket
            és győződj meg szakértelmünkről!
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-12">
          {/* Category filter */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Kategória
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`filter-category-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tech filter */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Technológia
            </div>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((tech) => (
                <Button
                  key={tech}
                  variant={selectedTech.includes(tech) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTech(tech)}
                  data-testid={`filter-tech-${tech.toLowerCase()}`}
                >
                  {tech}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Reference grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReferences.map((reference) => (
            <Card
              key={reference.id}
              className="overflow-hidden hover-elevate cursor-pointer transition-all duration-300 hover:shadow-xl"
              onClick={() => setSelectedReference(reference)}
              data-testid={`card-reference-${reference.id}`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={reference.imageUrl}
                  alt={reference.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg text-foreground">
                      {reference.name}
                    </h3>
                    {renderStars(reference.rating)}
                  </div>
                  <Badge variant="secondary" data-testid={`badge-category-${reference.id}`}>
                    {reference.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {reference.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {reference.techStack.slice(0, 3).map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="text-xs"
                      data-testid={`badge-tech-${reference.id}-${tech.toLowerCase()}`}
                    >
                      {tech}
                    </Badge>
                  ))}
                  {reference.techStack.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{reference.techStack.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredReferences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nincs találat a megadott szűrési feltételekkel.
            </p>
          </div>
        )}
      </div>

      {selectedReference && (
        <ReferenceModal
          reference={selectedReference}
          onClose={() => setSelectedReference(null)}
        />
      )}
    </section>
  );
}
