'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeletePostButton({ postId }: { postId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setIsDeleting(true);
        try {
            await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            router.refresh();
        } catch (error) {
            console.error('Failed to delete', error);
            setIsDeleting(false);
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </Button>
    );
}
