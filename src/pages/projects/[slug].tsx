import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { getAllProjects, getProjectBySlug, Project } from '@/lib/projects';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface ProjectPageProps {
  project: Project & {
    mdxSource: any;
  };
}

export default function ProjectPage({ project }: ProjectPageProps) {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-600">{project.date}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <MDXRemote {...project.mdxSource} />
        </div>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = getAllProjects();

  return {
    paths: projects.map((project) => ({
      params: {
        slug: project.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = getProjectBySlug(params?.slug as string);
  const mdxSource = await serialize(project.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  });

  return {
    props: {
      project: {
        ...project,
        mdxSource,
      },
    },
  };
}; 