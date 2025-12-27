import { notFound } from 'next/navigation';
import { getPageBySlug } from '@quicksilver/content-core';
import { MDXContent } from '../../../components/mdx-content';
import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const page = getPageBySlug('about');

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen pb-24">
            {/* 页面头部 */}
            <header className="pt-8 pb-12 md:pt-12 md:pb-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* 返回按钮 */}
                        <Button 
                            variant="ghost" 
                            asChild 
                            className="mb-8 -ml-3 text-muted-foreground hover:text-foreground"
                        >
                            <Link href={`/${lang}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {dict.common.back_home}
                            </Link>
                        </Button>

                        {/* 页面标签 */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
                            <span className="w-6 h-px bg-primary" />
                            {dict.navbar.about}
                        </div>

                        {/* 标题 */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15]">
                            {page.title}
                        </h1>
                    </div>
                </div>
            </header>

            {/* 内容区域 */}
            <main className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    <article className="prose prose-lg dark:prose-invert
                        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight 
                        prose-p:text-foreground/80 prose-p:leading-8
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-primary/30 prose-blockquote:bg-muted/30
                    ">
                        <MDXContent source={page.content || ''} dict={dict} />
                    </article>
                </div>
            </main>
        </div>
    );
}
