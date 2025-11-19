import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-primary mb-2">{t('common.novyxDev')}</div>
            <p className="text-sm text-muted-foreground">
              {t('footer.rights', { year: currentYear })}
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md transition-colors"
              data-testid="link-impresszum"
            >
              {t('footer.impressum')}
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md transition-colors"
              data-testid="link-privacy"
            >
              {t('footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
