import { MetadataRoute } from 'next';
import { fetchPosts } from '@/lib/api';
import { isPostPublic } from '@/lib/publication';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech';
  
  try {
    const posts = await fetchPosts();
    const publicPosts = posts.filter(isPostPublic);

    const postEntries: MetadataRoute.Sitemap = publicPosts.map(post => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...postEntries,
    ];
  } catch {
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
