import BlogPostView from '@/features/blog/BlogPostView';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostView slug={params.slug} />;
}
