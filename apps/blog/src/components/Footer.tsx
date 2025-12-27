import { Locale } from '../i18n-config';
import { getDictionary } from '../get-dictionary';

export default async function Footer({ lang }: { lang: Locale }) {
    const dict = await getDictionary(lang);

    return (
        <footer className="border-t border-border/40 bg-muted/20">
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                        Powered by Quicksilver Core
                    </span>
                </div>
            </div>
        </footer>
    );
}
