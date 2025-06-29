import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { getAllProjects, getProjectBySlug, Project } from '@/lib/projects';

interface ProjectPageProps {
  project: Project;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-600">{project.date}</p>
          {project.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {project.coverImage && (
          <div className="relative h-96 mb-8">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: project.htmlContent || '' }}
        />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getAllProjects();
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = await getProjectBySlug(params?.slug as string);

  return {
    props: {
      project,
    },
  };
}; 