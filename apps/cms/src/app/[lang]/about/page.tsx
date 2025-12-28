import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function AboutPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">{dict.about.title}</h1>
                <p className="text-muted-foreground">{dict.about.description}</p>
                <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Powered by Quicksilver Core
                    </p>
                </div>
            </div>
        </div>
    );
}
