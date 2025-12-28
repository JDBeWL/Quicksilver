import Link from 'next/link';
import { getDictionary } from '../get-dictionary';
import { Locale } from '../i18n-config';
import { PluginSlot } from './PluginSlot';
import { checkPageExists } from '@quicksilver/content-core';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export default async function Navbar({ lang }: { lang: Locale }) {
    const dict = await getDictionary(lang);
    const hasAboutPage = checkPageExists('about');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
            <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
                {/* 左侧品牌 */}
                <Link href={`/${lang}`} className="flex items-center gap-2 group shrink-0">
                    <span className="text-lg sm:text-xl font-serif font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                        {dict.navbar.brand}
                    </span>
                </Link>

                {/* 右侧工具栏 */}
                <nav className="flex items-center gap-0.5 sm:gap-1">
                    {hasAboutPage && (
                        <Link 
                            href={`/${lang}/about`} 
                            className="hidden sm:block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                        >
                            {dict.navbar.about}
                        </Link>
                    )}
                    
                    <div className="hidden sm:block w-px h-5 bg-border/60 mx-2" />
                    
                    <PluginSlot name="navbar-end" />
                    
                    <ThemeToggle />
                    <LanguageSwitcher />
                    
                    {/* 移动端 About 链接 */}
                    {hasAboutPage && (
                        <Link 
                            href={`/${lang}/about`} 
                            className="sm:hidden p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4"/>
                                <path d="M12 8h.01"/>
                            </svg>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
