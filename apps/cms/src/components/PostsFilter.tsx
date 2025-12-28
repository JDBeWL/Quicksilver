'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostsFilterProps {
    dict: {
        search_placeholder?: string;
        all?: string;
        published?: string;
        draft?: string;
        clear?: string;
    };
}

export default function PostsFilter({ dict }: PostsFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'all');

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (status !== 'all') params.set('status', status);
        
        const query = params.toString();
        router.push(query ? `?${query}` : '?', { scroll: false });
    }, [search, status, router]);

    const hasFilters = search || status !== 'all';

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder={dict.search_placeholder || '搜索文章...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>
            <div className="flex gap-2">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="all">{dict.all || '全部'}</option>
                    <option value="published">{dict.published || '已发布'}</option>
                    <option value="draft">{dict.draft || '草稿'}</option>
                </select>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
