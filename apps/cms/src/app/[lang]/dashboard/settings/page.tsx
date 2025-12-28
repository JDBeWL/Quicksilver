import { getSafeSession } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import SiteSettingsForm from '@/components/SiteSettingsForm';
import { getSiteSettings } from '@/lib/site-settings';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const session = await getSafeSession();
    
    if (!session?.user?.id) {
        redirect(`/${lang}/login`);
    }

    const settings = await getSiteSettings();

    return (
        <div className="py-6 w-full px-6 lg:px-10">
            <Link href={`/${lang}/dashboard`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
                <ArrowLeft className="h-4 w-4" />
                {dict.common.back_home || '返回'}
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{dict.dashboard.settings?.title || '站点设置'}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{dict.dashboard.settings?.description || '配置站点基本信息'}</p>
                </div>
                <SiteSettingsForm settings={settings} dict={dict} />
            </div>
        </div>
    );
}
