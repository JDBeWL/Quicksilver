import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { getDictionary } from '../../get-dictionary';
import { Locale } from '../../i18n-config';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { getAllPosts } from '@quicksilver/content-core';

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'zh' }];
}

export const dynamicParams = false;

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const allPosts = getAllPosts().filter((p: any) => p.published);
    
    // 精选文章：通过 frontmatter 中的 pinned/featured 字段决定
    const featuredPost = allPosts.find((p: any) => p.pinned || p.featured);

    // Date locale handling
    const { enUS, zhCN } = require('date-fns/locale');
    const localeMap: Record<string, any> = { 'en': enUS, 'zh': zhCN };
    const dateLocale = localeMap[lang] || enUS;

    // 提取文章摘要
    const getExcerpt = (content: string, maxLength = 120) => {
        const text = content?.replace(/[#*`_\[\]]/g, '').replace(/\n+/g, ' ').trim() || '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.1] animate-fade-up">
                            {dict.home.hero_title}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-up delay-100">
                            {dict.home.hero_desc}
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Post - 仅当有 pinned/featured 文章时显示 */}
            {featuredPost && (
                <section className="container mx-auto px-6 pb-16">
                    <Link 
                        href={`/${lang}/posts/${featuredPost.slug}`} 
                        className="group block relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
                    >
                        <div className="p-8 md:p-12 lg:p-16">
                            <div className="flex items-center gap-2 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
                                <span className="w-6 h-px bg-primary" />
                                {lang === 'zh' ? '精选文章' : 'Featured'}
                            </div>
                            
                            <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                                {featuredPost.title}
                            </h2>
                            
                            <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-2 max-w-3xl">
                                {getExcerpt(featuredPost.content, 160)}
                            </p>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">{featuredPost.author || 'Anonymous'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <time>{formatDistance(new Date(featuredPost.date), new Date(), { addSuffix: true, locale: dateLocale })}</time>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* All Posts Grid */}
            <section className="container mx-auto px-6 pb-24">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold">
                        {lang === 'zh' ? '全部文章' : 'All Posts'}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        {allPosts.length} {lang === 'zh' ? '篇' : 'posts'}
                    </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allPosts.map((post: any, index: number) => (
                        <article 
                            key={post.slug} 
                            className="group article-card h-full"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <Link 
                                href={`/${lang}/posts/${post.slug}`} 
                                className="flex flex-col h-full p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                {/* 文章信息 */}
                                <div className="flex flex-col flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <time className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {formatDistance(new Date(post.date), new Date(), { addSuffix: true, locale: dateLocale })}
                                        </time>
                                        {(post.pinned || post.featured) && (
                                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {lang === 'zh' ? '精选' : 'Featured'}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-lg font-serif font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                                        {getExcerpt(post.content)}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 pt-2 mt-auto">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {post.author?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {post.author || 'Anonymous'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {allPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-xl font-serif font-medium mb-2">{dict.home.no_posts}</h3>
                        <p className="text-muted-foreground">
                            {lang === 'zh' ? '这里还没有文章，请稍后查看。' : 'No articles yet. Please check back later.'}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
