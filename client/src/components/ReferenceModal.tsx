import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Check } from "lucide-react";
import type { Reference } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface ReferenceModalProps {
  reference: Reference;
  onClose: () => void;
}

export function ReferenceModal({ reference, onClose }: ReferenceModalProps) {
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-reference">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {reference.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Images */}
          <div className="grid gap-4">
            {reference.images.map((image, index) => (
              <div
                key={index}
                className="aspect-video rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={image}
                  alt={`${reference.name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Category and Rating */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Badge variant="secondary" className="text-base px-4 py-1">
              {reference.category}
            </Badge>
            <div className="flex items-center gap-2">
              {renderStars(reference.rating)}
              <span className="text-sm text-muted-foreground">
                ({reference.rating}/5)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">{t('references.modal.description')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {reference.fullDescription}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-foreground">
              {t('references.modal.features')}
            </h3>
            <ul className="space-y-2">
              {reference.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-foreground">
              {t('references.modal.techStack')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {reference.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-sm px-3 py-1"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Client testimonial */}
          <div className="bg-secondary/50 rounded-lg p-6 space-y-3 border border-border">
            <div className="flex items-center gap-2">
              <div className="text-4xl">"</div>
              <p className="text-foreground italic leading-relaxed">
                {reference.clientQuote}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">
                - {reference.clientName}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
