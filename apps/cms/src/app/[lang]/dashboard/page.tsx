import Link from 'next/link';
import { getAllPosts } from '@quicksilver/content-core';
import { getSafeSession } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Edit, FileText } from 'lucide-react';
import DeletePostButton from '@/components/DeletePostButton';
import TogglePublishButton from '@/components/TogglePublishButton';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

// Force SSR for dashboard
export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const session = await getSafeSession();
    if (!session?.user?.id) {
        redirect(`/${lang}/login`);
    }

    const posts = getAllPosts();
    const publishedCount = posts.filter(p => p.published).length;
    const draftCount = posts.filter(p => !p.published).length;

    return (
        <div className="py-6 w-full px-6 lg:px-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{dict.navbar.dashboard}</h1>
                <Button asChild size="sm">
                    <Link href={`/${lang}/dashboard/create`}>
                        <Plus className="h-4 w-4 mr-1" />
                        {dict.navbar.write}
                    </Link>
                </Button>
            </div>

            {/* Main Content - Side by Side Layout */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Left Sidebar - Stats */}
                <div className="xl:w-56 flex-shrink-0">
                    <div className="border rounded-lg p-4 space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground">{dict.dashboard.stats.total_posts}</h2>
                        <div className="space-y-3">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">{posts.length}</span>
                                <span className="text-sm text-muted-foreground">篇文章</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    <span>{dict.dashboard.stats.published}</span>
                                </div>
                                <span className="font-medium">{publishedCount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span>{dict.dashboard.stats.drafts}</span>
                                </div>
                                <span className="font-medium">{draftCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Posts Table */}
                <div className="flex-1 min-w-0">
                    {posts.length === 0 ? (
                        <div className="border border-dashed rounded-lg py-16 text-center text-muted-foreground">
                            <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <h3 className="font-medium">{dict.dashboard.empty.title}</h3>
                            <p className="text-sm">{dict.dashboard.empty.desc}</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="text-left font-medium px-4 py-2.5">{dict.dashboard.table?.title || '标题'}</th>
                                        <th className="text-left font-medium px-4 py-2.5 hidden sm:table-cell">{dict.dashboard.table?.slug || 'Slug'}</th>
                                        <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">{dict.dashboard.table?.date || '日期'}</th>
                                        <th className="text-center font-medium px-4 py-2.5 w-16">{dict.dashboard.table?.status || '状态'}</th>
                                        <th className="text-right font-medium px-4 py-2.5 w-20">{dict.dashboard.table?.actions || '操作'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {posts.map((post: any) => (
                                        <tr key={post.slug} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-2.5">
                                                <Link href={`/${lang}/dashboard/edit/${post.slug}`} className="font-medium hover:underline line-clamp-1">
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2.5 hidden sm:table-cell">
                                                <span className="font-mono text-xs text-muted-foreground">/{post.slug}</span>
                                            </td>
                                            <td className="px-4 py-2.5 hidden md:table-cell text-muted-foreground">
                                                {new Date(post.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <TogglePublishButton postSlug={post.slug} published={post.published} />
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                                                        <Link href={`/${lang}/dashboard/edit/${post.slug}`}>
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                    <DeletePostButton postId={post.slug} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
