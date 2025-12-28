'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function TogglePublishButton({ postSlug, published }: { postSlug: string; published: boolean }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(published);

    async function handleToggle() {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/posts/${postSlug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !isPublished }),
            });
            if (res.ok) {
                setIsPublished(!isPublished);
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to toggle publish status', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-1 rounded transition-colors ${
                isPublished 
                    ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30' 
                    : 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30'
            } disabled:opacity-50`}
            title={isPublished ? '点击取消发布' : '点击发布'}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPublished ? (
                <Eye className="h-4 w-4" />
            ) : (
                <EyeOff className="h-4 w-4" />
            )}
        </button>
    );
}
