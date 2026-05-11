'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicHeader from '@/components/layout/PublicHeader';
import { fetchCategories, fetchPosts, type ApiCategory, type ApiPost } from '@/lib/api';
import { isPostPublic } from '@/lib/publication';
import BlogHero from './BlogHero';
import PostsBrowser from './PostsBrowser';

export default function BlogHome() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const [postData, categoryData] = await Promise.all([fetchPosts(), fetchCategories()]);
        setPosts(postData.filter((post) => isPostPublic(post)).sort(byNewest));
        setCategories(categoryData);
      } catch {
        setError('Não foi possível carregar os posts agora.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    function syncCategoryFromHash() {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#category-', '');
      if (!hash || hash === window.location.hash) return;
      setActiveCategory(hash);
    }

    syncCategoryFromHash();
    window.addEventListener('hashchange', syncCategoryFromHash);
    return () => window.removeEventListener('hashchange', syncCategoryFromHash);
  }, []);

  const categoryOptions = useMemo(() => categories.map((category) => ({
    ...category,
    count: posts.filter((post) => post.category_slug === category.slug).length,
  })).filter((category) => category.count > 0), [categories, posts]);

  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((post) => {
      const inCategory = activeCategory === 'all' || post.category_slug === activeCategory;
      const inQuery = !term || [post.title, post.summary, post.category_name, post.author_name].filter(Boolean).some((value) => value!.toLowerCase().includes(term));
      return inCategory && inQuery;
    });
  }, [activeCategory, posts, query]);

  return (
    <main className="min-h-screen bg-app">
      <PublicHeader />
      <BlogHero />
      <PostsBrowser loading={loading} error={error} posts={filteredPosts} categories={categoryOptions} query={query} activeCategory={activeCategory} onQuery={setQuery} onCategory={setActiveCategory} />
      <PublicFooter />
    </main>
  );
}

function byNewest(a: ApiPost, b: ApiPost) {
  return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
}
