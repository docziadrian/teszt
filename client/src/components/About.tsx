import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TeamMember } from "@shared/schema";

export function About() {
  const { t } = useTranslation();
  const teamMembers = t('about.team.items', { returnObjects: true }) as TeamMember[];
  const whyUs = t('about.whyUs.items', { returnObjects: true }) as string[];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t('about.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission and Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t('about.mission.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.mission.text')}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t('about.story.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.story.text')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              {t('about.whyUs.title')}
            </h3>
            <ul className="space-y-3">
              {whyUs.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team members */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t('about.team.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="p-6 space-y-4 text-center hover-elevate transition-all duration-300"
                data-testid={`card-team-${member.id}`}
              >
                <div className="flex justify-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback className="text-2xl">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-foreground">
                    {member.name}
                  </h4>
                  <p className="text-sm text-primary font-medium">
                    {member.role}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
