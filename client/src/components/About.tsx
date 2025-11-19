import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { teamMembers } from "@/data/content";

const whyUs = [
  "Gyors és hatékony munka - átlagosan 2-4 hét átfutási idő",
  "Modern technológiák - React, TypeScript, Node.js",
  "Reszponzív dizájn minden eszközön",
  "SEO optimalizált weboldalak",
  "Folyamatos támogatás és karbantartás",
  "Átlátható árazás - nincs rejtett költség",
];

export function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Kik vagyunk mi?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A NovyxDev csapata szenvedélyes webfejlesztőkből áll, akik hisznek
            abban, hogy minden vállalkozás megérdemel egy professzionális online
            jelenlétet.
          </p>
        </div>

        {/* Mission and Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                A küldetésünk
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Célunk, hogy minden ügyfél számára egyedi, kiváló minőségű
                weboldalakat készítsünk, amelyek nemcsak szépek, hanem
                funkcionalitásban is kiemelkedőek. Hiszünk abban, hogy a jó
                weboldal a sikeres vállalkozás alapja.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                A történetünk
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                2018-ban indultunk azzal a céllal, hogy a magyar kisvállalkozások
                is hozzáférjenek világszínvonalú webfejlesztési szolgáltatásokhoz.
                Azóta több mint 50 sikeres projektet valósítottunk meg, és
                folyamatosan bővítjük szakértelmünket az új technológiák terén.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Miért válassz minket?
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
              Csapatunk
            </h3>
            <p className="text-muted-foreground">
              Ismerd meg a NovyxDev csapatát
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
