import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { getAllProjects, getAllTags, Project as ProjectType } from '@/lib/projects';

interface Project extends ProjectType {
  coverImage: string;
  date: string;
  excerpt: string;
}

interface ProjectsPageProps {
  featuredProjects: Project[];
  allProjects: Project[];
  allTags: string[];
}

export default function ProjectsPage({ featuredProjects, allProjects, allTags }: ProjectsPageProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) return allProjects;
    return allProjects.filter(project => 
      selectedTags.every(tag => project.tags.includes(tag))
    );
  }, [allProjects, selectedTags]);

  // Group projects by common tags
  const groupedProjects = useMemo(() => {
    if (selectedTags.length === 0) return null;
    
    const groups = new Map<string, Project[]>();
    
    filteredProjects.forEach(project => {
      const commonTags = project.tags.filter(tag => selectedTags.includes(tag));
      const groupKey = commonTags.sort().join(', ');
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(project);
    });
    
    return Array.from(groups.entries());
  }, [filteredProjects, selectedTags]);

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
          <h1 className="text-4xl font-bold">Projects</h1>
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
            {/* Featured Projects Section - Only show when no tags selected */}
            {selectedTags.length === 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project.slug} project={project} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            <section>
              <h2 className="text-3xl font-bold mb-8">
                {selectedTags.length > 0 ? 'Filtered Projects' : 'All Projects'}
              </h2>
              
              {groupedProjects ? (
                // Show grouped projects when tags are selected
                groupedProjects.map(([groupKey, projects]) => (
                  <div key={groupKey} className="mb-16">
                    <h3 className="text-xl font-semibold mb-8">Projects with {groupKey}</h3>
                    <div className="space-y-12">
                      {projects.map(project => (
                        <ProjectCard key={project.slug} project={project} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Show all projects when no tags are selected
                <div className="space-y-12">
                  {filteredProjects.map(project => (
                    <ProjectCard key={project.slug} project={project} />
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
              {allTags.map(tag => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  if (featured) {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="block group"
      >
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
          {project.coverImage && (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{project.date}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-700 line-clamp-2">{project.excerpt}</p>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="flex flex-col md:flex-row gap-8 group"
    >
      <div className="relative w-full md:w-72 h-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{project.date}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-700 line-clamp-3">{project.excerpt}</p>
      </div>
    </Link>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allProjects = await getAllProjects();
  const allTags = await getAllTags();

  // Filter projects that have required fields and cast to Project type
  const validProjects = allProjects.filter((project): project is Project => 
    typeof project.coverImage === 'string' && 
    project.coverImage !== '' &&
    typeof project.date === 'string' &&
    typeof project.excerpt === 'string'
  );

  // Sort projects by date
  const sortedProjects = [...validProjects].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get featured projects
  const featuredProjects = sortedProjects.filter(project => project.isFeatured);

  return {
    props: {
      featuredProjects,
      allProjects: sortedProjects,
      allTags,
    },
  };
};
