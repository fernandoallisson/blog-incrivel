import type { Metadata } from 'next';
import BlogHome from '@/features/blog/BlogHome';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog Incrível Tech',
  description: 'Explore artigos sobre tecnologia, conformidade legal e crescimento em sorteios digitais. Dicas, melhores práticas e insights de especialistas.',
  keywords: ['blog', 'tecnologia', 'sorteios digitais', 'legalidade', 'conformidade'],
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech',
    title: 'Blog Incrível Tech',
    description: 'Explore artigos sobre tecnologia, conformidade legal e crescimento em sorteios digitais.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech'}/favicon.png`,
        width: 1200,
        height: 1200,
        alt: 'Logo Incrível Tech',
      },
    ],
  },
};

export default function HomePage() {
  return <BlogHome />;
}
