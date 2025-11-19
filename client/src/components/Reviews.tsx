import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Review } from "@shared/schema";

export function Reviews() {
  const { t } = useTranslation();
  const reviews = t('reviews.items', { returnObjects: true }) as Review[];

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

  // Duplicate reviews to create seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-20 px-4 bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>
      </div>

      {/* Infinite scrolling carousel */}
      <div className="relative">
        <div className="flex gap-6 animate-scroll">
          {duplicatedReviews.map((review, index) => (
            <Card
              key={`${review.id}-${index}`}
              className="flex-shrink-0 w-80 sm:w-96 p-6 space-y-4"
              data-testid={`card-review-${review.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-foreground">
                  {review.clientName}
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "{review.text}"
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          {t('reviews.hint')}
        </p>
      </div>
    </section>
  );
}
