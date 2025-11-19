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
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation, Trans } from "react-i18next";

export function Contact() {
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t('contact.form.successTitle'),
        description: t('contact.form.successDesc'),
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: t('contact.form.errorTitle'),
        description: error.message || t('contact.form.errorDesc'),
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
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('contact.subtitle')}
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
                      <FormLabel>{t('contact.form.name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('contact.form.namePlaceholder')}
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
                      <FormLabel>{t('contact.form.email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('contact.form.emailPlaceholder')}
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
                      <FormLabel>{t('contact.form.subject')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('contact.form.subjectPlaceholder')}
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
                      <FormLabel>{t('contact.form.message')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('contact.form.messagePlaceholder')}
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
                  {contactMutation.isPending ? t('contact.form.sending') : t('contact.form.submit')}
                </Button>
              </form>
            </Form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t('contact.info.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t('contact.info.subtitle')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">{t('contact.info.email')}</div>
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
                    <div className="font-medium text-foreground mb-1">{t('contact.info.phone')}</div>
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
                    <div className="font-medium text-foreground mb-1">{t('contact.info.address')}</div>
                    <p className="text-muted-foreground">
                      <Trans i18nKey="contact.info.addressText" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h4 className="font-semibold text-foreground mb-3">
                {t('contact.card.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('contact.card.text')}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
