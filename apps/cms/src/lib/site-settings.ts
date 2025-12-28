import fs from 'fs';
import path from 'path';

export interface SiteSettings {
    title: string;
    subtitle: { zh: string; en: string };
    description: { zh: string; en: string };
    logo: string;
    favicon: string;
    author: string;
    language: string;
    footer: string;
}

const defaultSettings: SiteSettings = {
    title: 'Quicksilver',
    subtitle: {
        zh: '灵感，塑你所想',
        en: 'Shape your story, your way.',
    },
    description: {
        zh: '由 Quicksilver Core 驱动的博客',
        en: 'A blog powered by Quicksilver Core',
    },
    logo: '',
    favicon: '',
    author: '',
    language: 'zh',
    footer: 'Powered by Quicksilver Core',
};

function getSettingsPath(): string {
    const contentDir = path.join(process.cwd(), '..', '..', 'content');
    return path.join(contentDir, 'site-settings.json');
}

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const settingsPath = getSettingsPath();
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf-8');
            const parsed = JSON.parse(data);
            return {
                ...defaultSettings,
                ...parsed,
                subtitle: { ...defaultSettings.subtitle, ...(parsed.subtitle || {}) },
                description: { ...defaultSettings.description, ...(parsed.description || {}) },
            };
        }
    } catch (error) {
        console.error('Failed to read site settings:', error);
    }
    return defaultSettings;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    try {
        const settingsPath = getSettingsPath();
        const currentSettings = await getSiteSettings();
        
        const newSettings: SiteSettings = {
            title: settings.title ?? currentSettings.title,
            subtitle: {
                zh: typeof settings.subtitle === 'object' ? settings.subtitle.zh : currentSettings.subtitle.zh,
                en: typeof settings.subtitle === 'object' ? settings.subtitle.en : currentSettings.subtitle.en,
            },
            description: {
                zh: typeof settings.description === 'object' ? settings.description.zh : currentSettings.description.zh,
                en: typeof settings.description === 'object' ? settings.description.en : currentSettings.description.en,
            },
            logo: settings.logo ?? currentSettings.logo,
            favicon: settings.favicon ?? currentSettings.favicon,
            author: settings.author ?? currentSettings.author,
            language: settings.language ?? currentSettings.language,
            footer: settings.footer ?? currentSettings.footer,
        };
        
        const dir = path.dirname(settingsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2), 'utf-8');
        return newSettings;
    } catch (error) {
        console.error('Failed to save site settings:', error);
        throw error;
    }
}
