// 文章数据 API
import { getCollection, type CollectionEntry } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  
  const postsData = posts
    .filter((post: CollectionEntry<'blog'>) => !post.data.draft)
    .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post: CollectionEntry<'blog'>) => ({
      title: post.data.title,
      slug: post.slug,
      description: post.data.description || '',
      categories: post.data.categories,
      tags: post.data.tags,
      date: post.data.date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    }));
  
  return new Response(JSON.stringify(postsData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
