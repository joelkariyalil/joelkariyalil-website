import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { getAllPosts, getPostBySlug, BlogPost } from '@/lib/markdown';
import { useState, useEffect } from 'react';

interface BlogPostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -35% 0px' }
    );

    const headers = document.querySelectorAll('h1, h2, h3');
    headers.forEach((header) => observer.observe(header));

    return () => {
      headers.forEach((header) => observer.unobserve(header));
    };
  }, []);

  return (
    <Layout
      title={`${post.title} - Joel Kariyalil`}
      description={post.excerpt}
      type="blog"
      ogImage={post.coverImage ? `/content/blogs/${post.slug}/assets/${post.coverImage}` : undefined}
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              <span>{post.readingTime}</span>
            </div>
            {post.coverImage && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={`/content/blogs/${post.slug}/assets/${post.coverImage}`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Table of Contents - Desktop */}
          {post.tableOfContents.length > 0 && (
            <div className="hidden xl:block">
              <div className="fixed top-24 -right-[280px] w-64 overflow-auto pr-8">
                <h4 className="mb-4 text-sm font-semibold">Table of Contents</h4>
                <ul className="space-y-2 text-sm">
                  {post.tableOfContents.map((heading) => (
                    <li
                      key={heading.id}
                      style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                    >
                      <a
                        href={`#${heading.id}`}
                        className={`hover:text-foreground block py-1 ${
                          activeId === heading.id
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Mobile Table of Contents */}
          {post.tableOfContents.length > 0 && (
            <details className="mb-8 xl:hidden">
              <summary className="cursor-pointer text-sm font-semibold">
                Table of Contents
              </summary>
              <ul className="mt-4 space-y-2 text-sm">
                {post.tableOfContents.map((heading) => (
                  <li
                    key={heading.id}
                    style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(
                /src="\.\/assets\/(.*?)"/g, 
                `src="/content/blogs/${post.slug}/assets/$1"`
              ).replace(
                /poster="\.\/assets\/(.*?)"/g,
                `poster="/content/blogs/${post.slug}/assets/$1"`
              )
            }}
          />
        </article>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug(params?.slug as string);
  return {
    props: {
      post,
    },
  };
}; 