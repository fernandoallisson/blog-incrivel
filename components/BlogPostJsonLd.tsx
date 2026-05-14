import Script from 'next/script';
import type { ApiPost } from '@/lib/api';

interface BlogPostJsonLdProps {
  post: ApiPost;
}

export default function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const coverImage = post.cover_image 
    ? (post.cover_image.startsWith('http') ? post.cover_image : `${siteUrl}${post.cover_image}`)
    : `${siteUrl}/favicon.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary.replace(/<[^>]*>/g, ''),
    image: [coverImage],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Incrível Tech',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.category_name || 'Blog',
    keywords: post.tags?.map(tag => tag.name).join(', ') || '',
  };

  return <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
