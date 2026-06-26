'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';

interface Props {
  postSlug: string;
  postTitle: string;
}

export function LikeShare({ postSlug, postTitle }: Props) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${postSlug}/like`)
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {});
  }, [postSlug]);

  async function handleLike() {
    if (liked) return;
    const res = await fetch(`/api/posts/${postSlug}/like`, { method: 'POST' });
    if (res.ok) {
      const d = await res.json();
      setCount(d.count);
      setLiked(true);
    }
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: postTitle, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="flex items-center gap-4 pt-8 mt-12 border-t border-border">
      <button
        onClick={handleLike}
        disabled={liked}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm ${
          liked
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500'
            : 'border-border hover:bg-stone-50 dark:hover:bg-stone-900 text-muted hover:text-foreground'
        }`}
      >
        <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        <span>{count}</span>
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors text-sm text-muted hover:text-foreground"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  );
}
