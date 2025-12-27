import Link from 'next/link';
import { notFound } from 'next/navigation';
import 'highlight.js/styles/github-dark.css';
import { MDXContent } from '../../../../components/mdx-content';
import { formatDistance, format } from 'date-fns';
import { Button } from '../../../../components/ui/button';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { Locale } from '../../../../i18n-config';
import { getDictionary } from '../../../../get-dictionary';
import { PluginSlot } from '../../../../components/PluginSlot';
import { getPostBySlug, getAllPosts } from '@quicksilver/content-core';

export const dynamicParams = false;

export async function generateStaticParams() {
    const posts = getAllPosts();
    const langs: Locale[] = ['en', 'zh'];

    return langs.flatMap((lang) =>
        posts.map((post: any) => ({
            lang,
            slug: post.slug,
        }))
    );
}

// 估算阅读时间
function getReadingTime(content: string, lang: string): string {
    const wordsPerMinute = lang === 'zh' ? 400 : 200;
    const words = content.replace(/[#*`_\[\]]/g, '').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return lang === 'zh' ? `${minutes} 分钟` : `${minutes} min read`;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string; lang: Locale }> }) {
    const { slug, lang } = await params;
    const dict = await getDictionary(lang);
    const post = getPostBySlug(slug);

    if (!post || !post.published) {
        notFound();
    }

    // Date locale handling
    const { enUS, zhCN } = require('date-fns/locale');
    const localeMap: Record<string, any> = { 'en': enUS, 'zh': zhCN };
    const dateLocale = localeMap[lang] || enUS;
    
    const readingTime = getReadingTime(post.content || '', lang);

    return (
        <div className="min-h-screen pb-24">
            {/* 文章头部 */}
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

                        {/* 内容区域 - 与文章主体对齐，排除侧边栏宽度 */}
                        <div className="lg:pr-[calc(14rem+2rem)] xl:pr-[calc(16rem+3rem)]">
                            {/* 文章标签 */}
                            <div className="flex items-center gap-2 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
                                <span className="w-6 h-px bg-primary" />
                                {lang === 'zh' ? '博文' : 'Article'}
                            </div>

                            {/* 标题 */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15] mb-8">
                                {post.title}
                            </h1>

                            {/* 元信息 */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground pb-8 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                        {post.author?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span className="font-medium text-foreground">{post.author || 'Anonymous'}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={post.date}>
                                        {format(new Date(post.date), 'MMM d, yyyy', { locale: dateLocale })}
                                    </time>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{readingTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 文章内容 */}
            <main className="container mx-auto px-6">
                <div className="flex gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {/* 主内容 - 考虑侧边栏目录宽度 */}
                    <article className="flex-1 min-w-0 prose prose-lg dark:prose-invert
                        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight 
                        prose-p:text-foreground/80 prose-p:leading-8
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-primary/30 prose-blockquote:bg-muted/30
                        prose-pre:bg-[#0d1117] prose-pre:border-0
                        prose-img:rounded-xl prose-img:shadow-lg
                    ">
                        <MDXContent source={post.content || ''} dict={dict} />
                    </article>

                    {/* 侧边栏 - TOC 目录插件 */}
                    <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
                        <div className="sticky top-24">
                            <PluginSlot name="post-sidebar" />
                        </div>
                    </aside>
                </div>
            </main>

            {/* 文章底部 */}
            <footer className="container mx-auto px-6 mt-16">
                <div className="max-w-7xl mx-auto pt-8 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" asChild className="-ml-3">
                            <Link href={`/${lang}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {lang === 'zh' ? '返回首页' : 'Back to Home'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
