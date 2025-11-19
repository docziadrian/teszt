import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function Contact() {
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response;
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Üzenet elküldve!",
        description: "Köszönjük a megkeresést! Hamarosan felvesszük veled a kapcsolatot.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hiba történt",
        description: error.message || "Nem sikerült elküldeni az üzenetet. Kérjük, próbáld újra később.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const onSubmit = async (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Lépj velünk kapcsolatba!
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Van egy ötleted, amit szeretnél profi weboldallá formálni? Írj nekünk
            bátran! Meséld el, mivel foglalkozol, milyen weboldalt képzeltél el, és
            mi segítünk megtalálni a legjobb megoldást.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Név</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Teljes neved"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email cím</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@pelda.hu"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tárgy</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Miben segíthetünk?"
                          {...field}
                          data-testid="input-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Üzenet</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Írd le részletesen a projektedet, elképzeléseidet..."
                          rows={6}
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit"
                >
                  <Send className="w-5 h-5" />
                  {contactMutation.isPending ? "Küldés..." : "Üzenet küldése"}
                </Button>
              </form>
            </Form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Elérhetőségeink
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Bátran keress minket bármelyik elérhetőségünkön! Válaszolunk minden
                megkeresésre 24 órán belül.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Email</div>
                    <a
                      href="mailto:info@novyxdev.hu"
                      className="text-primary hover:underline"
                      data-testid="link-email"
                    >
                      info@novyxdev.hu
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Telefon</div>
                    <a
                      href="tel:+36301234567"
                      className="text-primary hover:underline"
                      data-testid="link-phone"
                    >
                      +36 30 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Cím</div>
                    <p className="text-muted-foreground">
                      1111 Budapest<br />
                      Példa utca 42.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h4 className="font-semibold text-foreground mb-3">
                Gyors válaszidő
              </h4>
              <p className="text-sm text-muted-foreground">
                Általában 2-4 órán belül válaszolunk minden megkeresésre munkaidőben
                (H-P 9:00-17:00). Hétvégén is igyekszünk mielőbb reagálni.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
