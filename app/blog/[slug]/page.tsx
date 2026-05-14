import type { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import { isPostPublic } from '@/lib/publication';
import BlogPostView from '@/features/blog/BlogPostView';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await fetchPostBySlug(params.slug);
    
    if (!isPostPublic(post)) {
      return {
        title: 'Post não encontrado',
        description: 'Este post não está disponível.',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech';
    const postUrl = `${siteUrl}/blog/${params.slug}`;
    const coverImage = post.cover_image ? (post.cover_image.startsWith('http') ? post.cover_image : `${siteUrl}${post.cover_image}`) : `${siteUrl}/favicon.png`;

    // Remove HTML tags from summary for clean description
    const cleanSummary = post.summary.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: post.title,
      description: cleanSummary || post.summary,
      keywords: post.tags?.map(tag => tag.name) || [],
      authors: [{ name: post.author_name }],
      openGraph: {
        type: 'article',
        url: postUrl,
        title: post.title,
        description: cleanSummary || post.summary,
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        authors: [post.author_name],
        publishedTime: post.published_at || post.created_at,
        modifiedTime: post.updated_at,
        tags: post.tags?.map(tag => tag.name) || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: cleanSummary || post.summary,
        images: [coverImage],
        creator: '@IncriavelTech',
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch {
    return {
      title: 'Erro ao carregar',
      description: 'Não foi possível carregar os metadados do post.',
    };
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostView slug={params.slug} />;
}
