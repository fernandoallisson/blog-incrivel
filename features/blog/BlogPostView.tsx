'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicHeader from '@/components/layout/PublicHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { fetchCommentsByPost, fetchPostBySlug, fetchPublicPromoCards, recordView, type ApiComment, type ApiPost, type ApiPromoCard } from '@/lib/api';
import { isPostPublic } from '@/lib/publication';
import CommentsSection from './CommentsSection';
import PostContent from './PostContent';
import PostHero from './PostHero';

export default function BlogPostView({ slug }: { slug: string }) {
  const [post, setPost] = useState<ApiPost | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [promoCards, setPromoCards] = useState<ApiPromoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    let active = true;
    async function loadPost() {
      setLoading(true);
      try {
        const item = await fetchPostBySlug(slug);
        if (!active) return;
        if (!isPostPublic(item)) {
          setPost(null);
          setError('Post não encontrado.');
          return;
        }
        setPost(item);
        recordView(item.id);
        fetchPublicPromoCards(item.id).then((cards) => { if (active) setPromoCards(cards); }).catch(() => { if (active) setPromoCards([]); });
        await loadComments(item.id, active);
      } catch {
        if (active) setError('Não foi possível carregar este post.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPost();
    return () => { active = false; };
  }, [slug]);

  async function loadComments(postId = post?.id, active = true) {
    if (!postId) return;
    try {
      const commentData = await fetchCommentsByPost(postId);
      if (active) setComments(commentData);
    } catch {
      if (active) setComments([]);
    }
  }

  async function share() {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: post?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copiado.');
      }
    } catch {
      setShareStatus('Compartilhamento cancelado.');
    }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-app text-muted">Carregando post...</main>;

  if (error || !post) {
    return (
      <main className="grid min-h-screen place-items-center bg-app p-6">
        <Card className="p-6">
          <div className="mb-3.5 text-error">{error || 'Post não encontrado.'}</div>
          <Link href="/"><Button variant="secondary" icon="chevleft">Voltar ao blog</Button></Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app">
      <PublicHeader backHref="/" />
      <article className="mx-auto max-w-[1180px] px-5 py-10 md:px-6">
        <PostHero post={post} onPostChange={setPost} shareStatus={shareStatus} onShare={share} />
        <PostContent post={post} promoCards={promoCards} onShare={share} />
      </article>
      <CommentsSection post={post} comments={comments} onReload={() => loadComments(post.id)} />
      <PublicFooter />
    </main>
  );
}
