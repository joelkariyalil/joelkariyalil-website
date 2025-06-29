import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { getAllPosts, getAllBlogTags, BlogPost } from '@/lib/markdown';

interface BlogIndexProps {
  featuredPosts: BlogPost[];
  allPosts: BlogPost[];
  allTags: string[];
}

export default function BlogIndex({ featuredPosts, allPosts, allTags }: BlogIndexProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return allPosts;
    return allPosts.filter(post => 
      post.showTags !== false && selectedTags.every(tag => post.techStack?.includes(tag))
    );
  }, [allPosts, selectedTags]);

  // Group posts by common tags
  const groupedPosts = useMemo(() => {
    if (selectedTags.length === 0) return null;
    
    const groups = new Map<string, BlogPost[]>();
    
    filteredPosts.forEach(post => {
      if (post.showTags === false) return; // Skip posts that don't show tags
      const commonTags = post.techStack?.filter(tag => selectedTags.includes(tag)) || [];
      const groupKey = commonTags.sort().join(', ');
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(post);
    });
    
    return Array.from(groups.entries());
  }, [filteredPosts, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex gap-8">
          <div className={`flex-1 ${isFilterOpen ? 'mr-64' : ''}`}>
            {/* Featured Posts Section - Only show when no tags selected */}
            {selectedTags.length === 0 && featuredPosts.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8">Featured Blogs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} featured />
                  ))}
                </div>
              </section>
            )}

            {/* All Posts Section */}
            <section>
              <h2 className="text-3xl font-bold mb-8">
                {selectedTags.length > 0 ? 'Filtered Blogs' : 'All Blogs'}
              </h2>
              
              {groupedPosts ? (
                // Show grouped posts when tags are selected
                groupedPosts.map(([groupKey, posts]) => (
                  <div key={groupKey} className="mb-16">
                    <h3 className="text-xl font-semibold mb-8">Blogs with {groupKey}</h3>
                    <div className="space-y-12">
                      {posts.map(post => (
                        <BlogCard key={post.slug} post={post} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Show all posts when no tags are selected
                <div className="space-y-12">
                  {filteredPosts.map(post => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Tag Filter Panel */}
          <div className={`fixed right-0 top-0 bottom-0 w-64 bg-white border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ marginTop: '64px' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filter by Tags</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {(allTags || []).length > 0 ? (
                allTags.map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{tag}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="block group"
      >
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{post.date}</p>
        {post.showTags !== false && post.techStack && post.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-700 line-clamp-2">{post.excerpt}</p>
      </Link>
    );
  }

  // Regular blog card (non-featured)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col md:flex-row gap-8 group"
    >
      <div className="relative w-full md:w-72 h-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{post.date}</p>
        {post.showTags !== false && post.techStack && post.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
      </div>
    </Link>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();
  const allTags = await getAllBlogTags();
  const featuredPosts = allPosts.filter(post => post.isFeatured);

  return {
    props: {
      featuredPosts,
      allPosts,
      allTags,
    },
  };
};
