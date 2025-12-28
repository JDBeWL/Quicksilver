'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface SiteSettings {
    title: string;
    subtitle: { zh: string; en: string };
    description: { zh: string; en: string };
    logo: string;
    favicon: string;
    author: string;
    language: string;
    footer: string;
}

interface SiteSettingsFormProps {
    settings: SiteSettings;
    dict: any;
}

export default function SiteSettingsForm({ settings, dict }: SiteSettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(settings);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: dict.dashboard.settings?.save_success || '保存成功' });
                router.refresh();
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            setMessage({ type: 'error', text: dict.dashboard.settings?.save_error || '保存失败' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <section className="space-y-4">
                <h2 className="text-lg font-medium border-b pb-2">{dict.dashboard.settings?.basic || '基本信息'}</h2>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.dashboard.settings?.site_title || '站点标题'}</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.dashboard.settings?.author || '作者'}</label>
                    <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </section>

            {/* 多语言内容 */}
            <section className="space-y-4">
                <h2 className="text-lg font-medium border-b pb-2">{dict.dashboard.settings?.i18n_content || '多语言内容'}</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    {/* 中文 */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium text-sm text-muted-foreground">中文</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{dict.dashboard.settings?.subtitle || '副标题'}</label>
                            <input
                                type="text"
                                value={formData.subtitle.zh}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: { ...prev.subtitle, zh: e.target.value } }))}
                                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{dict.dashboard.settings?.site_description || '描述'}</label>
                            <textarea
                                value={formData.description.zh}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, zh: e.target.value } }))}
                                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
                            />
                        </div>
                    </div>

                    {/* English */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium text-sm text-muted-foreground">English</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{dict.dashboard.settings?.subtitle || 'Subtitle'}</label>
                            <input
                                type="text"
                                value={formData.subtitle.en}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: { ...prev.subtitle, en: e.target.value } }))}
                                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{dict.dashboard.settings?.site_description || 'Description'}</label>
                            <textarea
                                value={formData.description.en}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))}
                                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 外观设置 */}
            <section className="space-y-4">
                <h2 className="text-lg font-medium border-b pb-2">{dict.dashboard.settings?.appearance || '外观'}</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{dict.dashboard.settings?.logo_url || 'Logo URL'}</label>
                        <input
                            type="text"
                            value={formData.logo}
                            onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                            className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{dict.dashboard.settings?.favicon_url || 'Favicon URL'}</label>
                        <input
                            type="text"
                            value={formData.favicon}
                            onChange={(e) => setFormData(prev => ({ ...prev, favicon: e.target.value }))}
                            className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.dashboard.settings?.footer_text || '页脚文字'}</label>
                    <input
                        type="text"
                        value={formData.footer}
                        onChange={(e) => setFormData(prev => ({ ...prev, footer: e.target.value }))}
                        className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.dashboard.settings?.default_language || '默认语言'}</label>
                    <select
                        value={formData.language}
                        onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="zh">中文</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </section>

            {message && (
                <div className={`text-sm px-3 py-2 rounded-md ${message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {dict.dashboard.settings?.save || '保存设置'}
            </Button>
        </form>
    );
}
